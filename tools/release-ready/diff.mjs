/**
 * Compare two unzipped plugin trees.
 * Source/text gets a unified diff. Compiled/binary gets size tables only.
 */

import { execFileSync } from 'node:child_process'
import {
	existsSync,
	mkdirSync,
	readdirSync,
	statSync,
	writeFileSync,
} from 'node:fs'
import {
	join,
	relative,
	sep,
} from 'node:path'

const SKIP_DIR_NAMES = new Set( [ '__MACOSX', '.DS_Store' ] )
const IMAGE_EXT = new Set( [ '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.bmp' ] )
const FONT_EXT = new Set( [ '.woff', '.woff2', '.ttf', '.eot', '.otf' ] )
const SIZE_DELTA_BYTES = 200 * 1024
const SIZE_DELTA_RATIO = 0.5
const HUGE_SOURCE_BYTES = 200 * 1024

export const applyFlavorSuffix = ( filename, flavor ) => {
	const trimmed = filename.trim()
	const hasZip = /\.zip$/i.test( trimmed )
	const base = trimmed.replace( /\.zip$/i, '' )
	if ( /-free(?:$|[.-])/i.test( base ) || /-premium(?:$|[.-])/i.test( base ) ) {
		return hasZip ? trimmed : `${ trimmed }.zip`
	}
	return `${ base }-${ flavor }.zip`
}

export const pluginRootFromExtract = extractDir => {
	const entries = readdirSync( extractDir, { withFileTypes: true } )
		.filter( entry => ! SKIP_DIR_NAMES.has( entry.name ) )
	if ( entries.length === 1 && entries[ 0 ].isDirectory() ) {
		return join( extractDir, entries[ 0 ].name )
	}
	return extractDir
}

const extname = filePath => {
	const i = filePath.lastIndexOf( '.' )
	return i === -1 ? '' : filePath.slice( i ).toLowerCase()
}

export const classifyPath = relPath => {
	const normalized = relPath.split( sep ).join( '/' )
	const parts = normalized.split( '/' )
	const ext = extname( normalized )

	if ( ext === '.map' ) {
		return 'compiled'
	}
	if ( IMAGE_EXT.has( ext ) || FONT_EXT.has( ext ) ) {
		return 'compiled'
	}
	if ( parts[ 0 ] === 'dist' && ( ext === '.js' || ext === '.css' ) ) {
		return 'compiled'
	}
	return 'source'
}

const walkFiles = ( dir, base = dir, acc = [] ) => {
	if ( ! existsSync( dir ) ) {
		return acc
	}
	for ( const entry of readdirSync( dir, { withFileTypes: true } ) ) {
		if ( SKIP_DIR_NAMES.has( entry.name ) ) {
			continue
		}
		const full = join( dir, entry.name )
		if ( entry.isDirectory() ) {
			walkFiles( full, base, acc )
			continue
		}
		acc.push( relative( base, full ).split( sep ).join( '/' ) )
	}
	return acc
}

const fileSize = ( root, relPath ) => {
	const full = join( root, relPath )
	return existsSync( full ) ? statSync( full ).size : 0
}

const isSizeFinding = ( oldBytes, newBytes ) => {
	if ( oldBytes === 0 || newBytes === 0 ) {
		return oldBytes !== newBytes
	}
	const delta = Math.abs( newBytes - oldBytes )
	return delta > SIZE_DELTA_BYTES || delta / oldBytes > SIZE_DELTA_RATIO
}

const unifiedDiff = ( oldRoot, newRoot, relPath ) => {
	const oldFile = join( oldRoot, relPath )
	const newFile = join( newRoot, relPath )
	try {
		return execFileSync(
			'diff',
			[ '-u', '--label', `a/${ relPath }`, '--label', `b/${ relPath }`, oldFile, newFile ],
			{ encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }
		)
	} catch ( error ) {
		if ( error.status === 1 && typeof error.stdout === 'string' ) {
			return error.stdout
		}
		if ( error.status === 2 ) {
			return `--- a/${ relPath }\n+++ b/${ relPath }\n@@ binary or unreadable @@\n`
		}
		throw error
	}
}

export const comparePluginTrees = ( oldRoot, newRoot, destDir, prefix ) => {
	mkdirSync( destDir, { recursive: true } )

	const oldFiles = new Set( walkFiles( oldRoot ) )
	const newFiles = new Set( walkFiles( newRoot ) )
	const added = [ ...newFiles ].filter( file => ! oldFiles.has( file ) ).sort()
	const removed = [ ...oldFiles ].filter( file => ! newFiles.has( file ) ).sort()
	const common = [ ...newFiles ].filter( file => oldFiles.has( file ) ).sort()

	const sizes = []
	const sourceChunks = []

	const consider = ( relPath, oldBytes, newBytes, status ) => {
		const kind = classifyPath( relPath )
		if ( kind === 'compiled' ) {
			sizes.push( {
				path: relPath,
				oldBytes,
				newBytes,
				deltaBytes: newBytes - oldBytes,
				status,
				flag: isSizeFinding( oldBytes, newBytes ),
			} )
			return
		}
		if ( status === 'added' ) {
			sourceChunks.push( `--- /dev/null\n+++ b/${ relPath }\n@@ added ${ newBytes } bytes @@\n` )
			return
		}
		if ( status === 'removed' ) {
			sourceChunks.push( `--- a/${ relPath }\n+++ /dev/null\n@@ removed ${ oldBytes } bytes @@\n` )
			return
		}
		if ( oldBytes > HUGE_SOURCE_BYTES || newBytes > HUGE_SOURCE_BYTES ) {
			sourceChunks.push(
				`--- a/${ relPath }\n+++ b/${ relPath }\n@@ huge source file omitted (${ oldBytes } -> ${ newBytes } bytes) @@\n`
			)
			return
		}
		const hunk = unifiedDiff( oldRoot, newRoot, relPath )
		if ( hunk && hunk.trim() ) {
			sourceChunks.push( hunk )
		}
	}

	for ( const relPath of added ) {
		consider( relPath, 0, fileSize( newRoot, relPath ), 'added' )
	}
	for ( const relPath of removed ) {
		consider( relPath, fileSize( oldRoot, relPath ), 0, 'removed' )
	}
	for ( const relPath of common ) {
		consider( relPath, fileSize( oldRoot, relPath ), fileSize( newRoot, relPath ), 'changed' )
	}

	writeFileSync( join( destDir, `${ prefix }.source.diff` ), sourceChunks.join( '\n' ) )
	writeFileSync( join( destDir, `${ prefix }.sizes.json` ), `${ JSON.stringify( sizes, null, '\t' ) }\n` )
	writeFileSync(
		join( destDir, `${ prefix }.tree.txt` ),
		[
			`# ${ prefix } file tree`,
			`added: ${ added.length }`,
			`removed: ${ removed.length }`,
			`common: ${ common.length }`,
			'',
			'## added',
			...added.map( file => `+ ${ file }` ),
			'',
			'## removed',
			...removed.map( file => `- ${ file }` ),
			'',
		].join( '\n' )
	)

	return {
		added,
		removed,
		sizes,
	}
}
