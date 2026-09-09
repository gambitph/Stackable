#!/usr/bin/env node
/**
 * Ready a Stackable release: build free + premium, upload to Freemius
 * (pending only), download processed zips, diff against baselines, review.
 *
 * Usage:
 *   npm run release:ready
 *   npm run release:ready -- --build-only
 *   npm run release:ready -- --check-only
 *   npm run release:ready -- --no-review
 */

import { execFileSync, spawnSync } from 'node:child_process'
import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	renameSync,
	rmSync,
} from 'node:fs'
import {
	dirname,
	join,
	resolve,
} from 'node:path'
import { fileURLToPath } from 'node:url'
import {
	createDeployment,
	deletePendingDeployment,
	deletePendingDeploymentsForVersion,
	downloadDeployment,
	getLatestDeployment,
	listAllDeployments,
	waitForDeploymentVersion,
} from './freemius.mjs'
import {
	applyFlavorSuffix,
	comparePluginTrees,
	pluginRootFromExtract,
} from './diff.mjs'

const ROOT = resolve( dirname( fileURLToPath( import.meta.url ) ), '../..' )
const RELEASES_DIR = join( ROOT, 'releases' )
const REPORT_DIR = join( ROOT, 'build', 'release-ready' )
const LOCAL_ZIP = join( ROOT, 'build', 'stackable.zip' )
const PREMIUM_DIR = join( ROOT, 'pro__premium_only' )
const WPORG_URL = 'https://downloads.wordpress.org/plugin/stackable-ultimate-gutenberg-blocks.zip'

const log = message => {
	console.log( `[release:ready] ${ message }` ) // eslint-disable-line no-console
}

const fail = message => {
	console.error( `[release:ready] ${ message }` ) // eslint-disable-line no-console
	process.exit( 1 )
}

const parseArgs = argv => ( {
	buildOnly: argv.includes( '--build-only' ),
	checkOnly: argv.includes( '--check-only' ),
	noReview: argv.includes( '--no-review' ),
} )

const loadDotEnv = () => {
	const envPath = join( ROOT, '.env' )
	if ( ! existsSync( envPath ) ) {
		return
	}
	for ( const raw of readFileSync( envPath, 'utf8' ).split( '\n' ) ) {
		const line = raw.trim()
		if ( ! line || line.startsWith( '#' ) ) {
			continue
		}
		const eq = line.indexOf( '=' )
		if ( eq === -1 ) {
			continue
		}
		const key = line.slice( 0, eq ).trim()
		let value = line.slice( eq + 1 ).trim()
		if ( ( value.startsWith( '"' ) && value.endsWith( '"' ) ) ||
			( value.startsWith( '\'' ) && value.endsWith( '\'' ) ) ) {
			value = value.slice( 1, -1 )
		}
		if ( process.env[ key ] === undefined ) {
			process.env[ key ] = value
		}
	}
}

const readPluginVersion = () => {
	const match = readFileSync( join( ROOT, 'plugin.php' ), 'utf8' )
		.match( /^ \* Version:\s*([\d.]+)/m )
	if ( ! match ) {
		fail( 'Could not read Version from plugin.php' )
	}
	return match[ 1 ]
}

const readCurrentChangelog = version => {
	const readme = readFileSync( join( ROOT, 'readme.txt' ), 'utf8' )
	const escaped = version.replace( /\./g, '\\.' )
	const match = readme.match( new RegExp( `^= ${ escaped } =\\s*\\n([\\s\\S]*?)(?=\\n= [\\d.]+ =|$)`, 'm' ) )
	if ( ! match ) {
		fail( `readme.txt has no changelog section "= ${ version } ="` )
	}
	return match[ 0 ].trim()
}

const compareVersions = ( a, b ) => {
	const pa = a.split( '.' ).map( n => parseInt( n, 10 ) || 0 )
	const pb = b.split( '.' ).map( n => parseInt( n, 10 ) || 0 )
	const len = Math.max( pa.length, pb.length )
	for ( let i = 0; i < len; i++ ) {
		const delta = ( pa[ i ] || 0 ) - ( pb[ i ] || 0 )
		if ( delta ) {
			return delta > 0 ? 1 : -1
		}
	}
	return 0
}

const run = ( command, args, cwd = ROOT ) => {
	const result = spawnSync( command, args, {
		cwd,
		stdio: 'inherit',
		shell: false,
	} )
	if ( result.error ) {
		fail( `Failed to start ${ command }: ${ result.error.message }` )
	}
	if ( result.status !== 0 ) {
		fail( `${ command } ${ args.join( ' ' ) } exited ${ result.status }` )
	}
}

const findTagByVersion = ( tags, version ) =>
	tags.find( tag => tag.version === version )

const isTransientFetchError = error => {
	const parts = [ error?.message, error?.cause?.message, error?.cause?.code ]
		.filter( Boolean )
		.join( ' ' )
	return /fetch failed|ECONNRESET|ETIMEDOUT|ENOTFOUND|UND_ERR|socket hung up|network/i.test( parts )
}

const withTransientRetry = async ( label, fn, attempts = 5 ) => {
	for ( let attempt = 1; attempt <= attempts; attempt++ ) {
		try {
			return await fn()
		} catch ( error ) {
			if ( ! isTransientFetchError( error ) || attempt === attempts ) {
				throw error
			}
			log( `${ label } failed (${ error.message }), retrying (${ attempt }/${ attempts })…` )
			await new Promise( resolve => setTimeout( resolve, 2000 * attempt ) )
		}
	}
}

const waitUntilPendingTagGone = async ( token, version, deletedIds ) => {
	const gone = new Set( deletedIds.map( id => String( id ) ) )
	const started = Date.now()
	const timeoutMs = 2 * 60 * 1000
	let attempt = 0
	while ( Date.now() - started < timeoutMs ) {
		attempt += 1
		let tag
		try {
			tag = await getLatestDeployment( token, 'pending' )
		} catch ( error ) {
			if ( ! isTransientFetchError( error ) ) {
				throw error
			}
			log( `Waiting for deleted tag to leave pending, lookup failed (${ error.message }) (${ attempt })…` )
			await new Promise( resolve => setTimeout( resolve, 3000 ) )
			continue
		}
		const stillThere = tag &&
			String( tag.version ) === String( version ) &&
			gone.has( String( tag.id ) )
		if ( ! stillThere ) {
			return
		}
		log( `Waiting for deleted tag ${ tag.id } to leave pending (${ attempt })…` )
		await new Promise( resolve => setTimeout( resolve, 3000 ) )
	}
	throw new Error(
		`Timed out waiting for deleted pending tag ${ [ ...gone ].join( ', ' ) } to disappear`
	)
}

const deleteKnownPendingTag = async ( token, version, tag ) => {
	await withTransientRetry(
		`Delete pending tag ${ tag.id }`,
		() => deletePendingDeployment( token, tag, version )
	)
	log( `Deleted pending Freemius tag ${ tag.id } (${ tag.version })` )
	await waitUntilPendingTagGone( token, version, [ tag.id ] )
	return [ tag ]
}

/**
 * Remove a same-version pending tag before a create.
 * Freemius keeps one pending tag per version. A leftover may be from a free
 * or paid zip. `fallbackTag` is the free tag we just uploaded, used when the
 * latest-pending lookup flakes.
 *
 * @param {string} token
 * @param {string} version
 * @param {object} options
 * @param {string} options.reason Shown in logs.
 * @param {object} [options.fallbackTag]
 * @return {Promise<Array<object>>}
 */
const removePendingSameVersion = async ( token, version, {
	reason,
	fallbackTag,
} = {} ) => {
	log( `Checking for a pending ${ version } tag (${ reason })…` )
	try {
		const deleted = await withTransientRetry(
			`Pending-tag lookup for ${ version }`,
			() => deletePendingDeploymentsForVersion( token, version )
		)
		if ( deleted.length ) {
			for ( const tag of deleted ) {
				log( `Deleted pending Freemius tag ${ tag.id } (${ tag.version })` )
			}
			await waitUntilPendingTagGone( token, version, deleted.map( tag => tag.id ) )
			return deleted
		}
	} catch ( error ) {
		if ( ! fallbackTag || ! isTransientFetchError( error ) ) {
			throw error
		}
		log(
			`Pending-tag lookup failed (${ error.message }). ` +
			`Deleting known pending tag ${ fallbackTag.id }…`
		)
		return deleteKnownPendingTag( token, version, fallbackTag )
	}

	if ( fallbackTag ) {
		log(
			`Latest pending did not list ${ version }. ` +
			`Deleting known pending tag ${ fallbackTag.id }…`
		)
		return deleteKnownPendingTag( token, version, fallbackTag )
	}

	log( `No pending Freemius tag for ${ version }` )
	return []
}

const uploadPendingZip = async ( token, version, zipPath ) => {
	try {
		await createDeployment( token, zipPath )
	} catch ( error ) {
		if ( ! isTransientFetchError( error ) ) {
			throw error
		}
		log(
			`Upload request ended without a response (${ error.message }). ` +
			`Waiting to see if ${ version } appears on Freemius…`
		)
	}
}

const waitThenDownload = async ( token, version, deleted, isPremium, destDir ) => {
	const flavor = isPremium ? 'premium' : 'free'
	log( `Waiting for pending Freemius tag ${ version } before downloading ${ flavor }…` )
	const tag = await waitForDeploymentVersion( token, version, {
		excludeIds: deleted.map( item => item.id ),
		onAttempt: ( { attempt, found, error } ) => {
			if ( found ) {
				return
			}
			if ( error ) {
				log( `Latest-pending attempt ${ attempt } failed (${ error.message }), retrying…` )
				return
			}
			log( `Latest-pending attempt ${ attempt }: ${ version } not ready yet, retrying…` )
		},
	} )
	log( `Downloading ${ flavor } zip for tag ${ tag.id }…` )
	const destPath = await downloadFlavored( token, tag.id, isPremium, destDir )
	return {
		destPath,
		tag,
	}
}

const newestTagVersion = tags =>
	tags.reduce( ( newest, tag ) => {
		if ( ! tag.version ) {
			return newest
		}
		if ( ! newest || compareVersions( tag.version, newest ) > 0 ) {
			return tag.version
		}
		return newest
	}, null )

const previousReleasedTag = ( tags, currentVersion ) => {
	const released = tags.filter( tag =>
		tag.release_mode === 'released' &&
		tag.version &&
		tag.version !== currentVersion
	)
	if ( ! released.length ) {
		return null
	}
	return released.reduce( ( best, tag ) =>
		compareVersions( tag.version, best.version ) > 0 ? tag : best
	)
}

const saveFlavoredZip = ( download, flavor, destDir ) => {
	const flavored = applyFlavorSuffix( download.filename, flavor )
	const destPath = join( destDir, flavored )
	if ( download.destPath !== destPath ) {
		renameSync( download.destPath, destPath )
	}
	return destPath
}

const downloadFlavored = async ( token, tagId, isPremium, destDir ) => {
	const flavor = isPremium ? 'premium' : 'free'
	const download = await downloadDeployment( token, tagId, isPremium, destDir )
	return saveFlavoredZip( download, flavor, destDir )
}

const requireLocalZip = () => {
	if ( ! existsSync( LOCAL_ZIP ) ) {
		fail( `Missing ${ LOCAL_ZIP } after build` )
	}
}

const extractZip = ( zipPath, destDir ) => {
	rmSync( destDir, { recursive: true, force: true } )
	mkdirSync( destDir, { recursive: true } )
	execFileSync( 'unzip', [ '-q', '-o', zipPath, '-d', destDir ] )
	return pluginRootFromExtract( destDir )
}

const downloadUrlToFile = async ( url, destPath ) => {
	const response = await fetch( url, { redirect: 'follow' } )
	if ( ! response.ok ) {
		fail( `Download failed (${ response.status }): ${ url }` )
	}
	const { writeFile, mkdir } = await import( 'node:fs/promises' )
	const { dirname: destDirname } = await import( 'node:path' )
	await mkdir( destDirname( destPath ), { recursive: true } )
	await writeFile( destPath, Buffer.from( await response.arrayBuffer() ) )
	return destPath
}

const findReleaseZip = ( flavor, version ) => {
	if ( ! existsSync( RELEASES_DIR ) ) {
		return null
	}
	const files = readdirSync( RELEASES_DIR ).filter( name => name.endsWith( '.zip' ) )
	const flavorRe = flavor === 'free' ? /-free\.zip$/i : /-premium\.zip$/i
	const flavored = files.filter( name => flavorRe.test( name ) )
	const versioned = flavored.filter( name => name.includes( version ) )
	const pool = versioned.length ? versioned : flavored
	if ( ! pool.length ) {
		return null
	}
	return join( RELEASES_DIR, pool.sort().reverse()[ 0 ] )
}

const findPreviousPremiumZip = currentVersion => {
	if ( ! existsSync( RELEASES_DIR ) ) {
		return null
	}
	const files = readdirSync( RELEASES_DIR )
		.filter( name => /-premium\.zip$/i.test( name ) && ! name.includes( currentVersion ) )
	if ( ! files.length ) {
		return null
	}
	return join( RELEASES_DIR, files.sort().reverse()[ 0 ] )
}

const readZipPluginVersion = pluginRoot => {
	const headerFile = [ 'plugin.php', 'stackable.php' ]
		.map( name => join( pluginRoot, name ) )
		.find( existsSync )
	if ( ! headerFile ) {
		return null
	}
	const match = readFileSync( headerFile, 'utf8' ).match( /Version:\s*([\d.]+)/ )
	return match ? match[ 1 ] : null
}

const runReview = version => {
	const agent = spawnSync(
		'agent',
		[
			'-p',
			'--mode=ask',
			`/review-release Review the release-ready artifacts for Stackable ${ version }. ` +
			`Repo root is ${ ROOT }. ` +
			`Read only the "= ${ version } =" changelog section in readme.txt. ` +
			'Read build/release-ready/free.source.diff, free.sizes.json, free.tree.txt, ' +
			'paid.source.diff, paid.sizes.json, and paid.tree.txt. ' +
			`Confirm unzipped zip headers / Stable tag match ${ version }. ` +
			'Do not edit plugin files. Do not write a verdict file. Print the full review to the terminal.',
		],
		{ cwd: ROOT, stdio: 'inherit' }
	)
	if ( agent.error && agent.error.code === 'ENOENT' ) {
		fail(
			'Cursor CLI `agent` was not found. Zips and diffs are ready. ' +
			'Run /review-release in Cursor to finish the review.'
		)
	}
	if ( agent.status !== 0 ) {
		fail( `agent review exited ${ agent.status }` )
	}
}

const buildPhase = async ( token, version ) => {
	if ( ! existsSync( PREMIUM_DIR ) ) {
		fail( `Missing ${ PREMIUM_DIR }. Check out the premium repo before building.` )
	}

	log( 'Listing Freemius deployments…' )
	const tags = await listAllDeployments( token )
	const newest = newestTagVersion( tags )
	if ( newest && compareVersions( version, newest ) < 0 ) {
		fail( `Refusing to upload ${ version }, Freemius already has newer ${ newest }` )
	}

	const existing = findTagByVersion( tags, version )
	if ( existing && ( existing.release_mode === 'released' || existing.release_mode === 'beta' ) ) {
		fail( `${ version } is already ${ existing.release_mode } on Freemius. This command only creates or retries pending tags.` )
	}

	const previous = previousReleasedTag( tags, version )
	if ( ! previous ) {
		fail( `No previously released Freemius tag found (other than ${ version })` )
	}
	log( `Previous released paid baseline: ${ previous.version } (tag ${ previous.id })` )

	mkdirSync( RELEASES_DIR, { recursive: true } )

	log( `Downloading previous paid zip ${ previous.version }…` )
	const previousPaidPath = await downloadFlavored( token, previous.id, true, RELEASES_DIR )
	log( `Saved ${ previousPaidPath }` )

	log( 'Building free plugin…' )
	run( 'npm', [ 'run', 'build' ], ROOT )
	requireLocalZip()

	log( `Uploading free build as ${ version } (pending)…` )
	let deletedFree = []
	try {
		deletedFree = await removePendingSameVersion( token, version, {
			reason: 'free or paid leftover',
		} )
		await uploadPendingZip( token, version, LOCAL_ZIP )
	} catch ( error ) {
		fail(
			`${ error.message }\n` +
			'This command will not change release_mode.'
		)
	}
	const freeUpload = await waitThenDownload( token, version, deletedFree, false, RELEASES_DIR )
	log( `Saved ${ freeUpload.destPath }` )

	log( 'Building premium plugin…' )
	run( 'npm', [ 'run', 'build' ], PREMIUM_DIR )
	requireLocalZip()

	log( `Uploading premium build as ${ version } (pending)…` )
	let deletedPaid = []
	try {
		deletedPaid = await removePendingSameVersion( token, version, {
			reason: 'pending free from this run',
			fallbackTag: freeUpload.tag,
		} )
		await uploadPendingZip( token, version, LOCAL_ZIP )
	} catch ( error ) {
		fail(
			`${ error.message }\n` +
			`Failed before the premium zip could replace pending ${ version }. ` +
			`Freemius still has the previous (free) pending tag. Re-run to delete it and upload both builds again. This command will not change release_mode.`
		)
	}
	const paidUpload = await waitThenDownload( token, version, deletedPaid, true, RELEASES_DIR )
	log( `Saved ${ paidUpload.destPath }` )

	return {
		freePath: freeUpload.destPath,
		paidPath: paidUpload.destPath,
		previousPaidPath,
	}
}

const resolveZips = ( version, built ) => {
	const freePath = built?.freePath || findReleaseZip( 'free', version )
	const paidPath = built?.paidPath || findReleaseZip( 'premium', version )
	const previousPaidPath = built?.previousPaidPath || findPreviousPremiumZip( version )
	if ( ! freePath || ! existsSync( freePath ) ) {
		fail( `Missing FREE zip in ${ RELEASES_DIR } for ${ version }` )
	}
	if ( ! paidPath || ! existsSync( paidPath ) ) {
		fail( `Missing PAID zip in ${ RELEASES_DIR } for ${ version }` )
	}
	if ( ! previousPaidPath || ! existsSync( previousPaidPath ) ) {
		fail( `Missing previous PAID zip in ${ RELEASES_DIR }` )
	}
	return {
		freePath,
		paidPath,
		previousPaidPath,
	}
}

const checkPhase = async ( version, zips ) => {
	rmSync( REPORT_DIR, { recursive: true, force: true } )
	mkdirSync( REPORT_DIR, { recursive: true } )

	const wporgZip = join( REPORT_DIR, 'wporg.zip' )
	log( `Downloading WordPress.org baseline ${ WPORG_URL }…` )
	await downloadUrlToFile( WPORG_URL, wporgZip )

	const wporgRoot = extractZip( wporgZip, join( REPORT_DIR, 'unpacked', 'wporg' ) )
	const freeRoot = extractZip( zips.freePath, join( REPORT_DIR, 'unpacked', 'free' ) )
	const paidPrevRoot = extractZip( zips.previousPaidPath, join( REPORT_DIR, 'unpacked', 'paid-prev' ) )
	const paidNewRoot = extractZip( zips.paidPath, join( REPORT_DIR, 'unpacked', 'paid-new' ) )

	const wporgVersion = readZipPluginVersion( wporgRoot )
	if ( wporgVersion === version ) {
		log( `Warning: WordPress.org zip is already ${ version }. Diff may be tiny. Continuing.` )
	} else if ( wporgVersion ) {
		log( `WordPress.org baseline version: ${ wporgVersion }` )
	}

	log( 'Diffing FREE zip against WordPress.org baseline…' )
	comparePluginTrees( wporgRoot, freeRoot, REPORT_DIR, 'free' )
	log( 'Diffing PAID zip against previous released paid zip…' )
	comparePluginTrees( paidPrevRoot, paidNewRoot, REPORT_DIR, 'paid' )
	log( `Wrote diffs under ${ REPORT_DIR }` )
}

const main = async () => {
	const args = parseArgs( process.argv.slice( 2 ) )
	if ( args.buildOnly && args.checkOnly ) {
		fail( 'Use only one of --build-only or --check-only' )
	}

	loadDotEnv()
	const version = readPluginVersion()
	readCurrentChangelog( version )
	log( `Version ${ version }` )

	let built = null
	if ( ! args.checkOnly ) {
		const token = process.env.FREEMIUS_API_TOKEN
		if ( ! token ) {
			fail( 'Missing FREEMIUS_API_TOKEN in the environment or .env' )
		}
		built = await buildPhase( token, version )
	}

	if ( args.buildOnly ) {
		log( 'Stopped after Freemius uploads and /releases zips (--build-only).' )
		return
	}

	const zips = resolveZips( version, built )
	await checkPhase( version, zips )

	if ( args.noReview ) {
		log( 'Skipped review (--no-review).' )
		return
	}

	log( 'Starting /review-release…' )
	runReview( version )
	log( 'Done.' )
}

main().catch( error => {
	fail( error.stack || error.message )
} )
