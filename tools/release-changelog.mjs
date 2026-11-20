#!/usr/bin/env node
/**
 * Update the readme.txt changelog for the current plugin version
 * by running the add-changelog Cursor skill.
 *
 * Usage:
 *   npm run release:changelog
 *
 * The Version header in plugin.php is the confirmed version.
 * The agent writes readme.txt and does not commit.
 */

import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import {
	dirname,
	join,
	resolve,
} from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve( dirname( fileURLToPath( import.meta.url ) ), '..' )

const log = message => {
	console.log( `[release:changelog] ${ message }` ) // eslint-disable-line no-console
}

const fail = message => {
	console.error( `[release:changelog] ${ message }` ) // eslint-disable-line no-console
	process.exit( 1 )
}

const readPluginVersion = () => {
	const match = readFileSync( join( ROOT, 'plugin.php' ), 'utf8' )
		.match( /^ \* Version:\s*([\d.]+)/m )
	if ( ! match ) {
		fail( 'Could not read Version from plugin.php' )
	}
	return match[ 1 ]
}

const main = () => {
	const version = readPluginVersion()
	log( `Version ${ version } is confirmed. Starting /add-changelog…` )

	const agent = spawnSync(
		'agent',
		[
			'-p',
			'--force',
			'--trust',
			'--sandbox',
			'disabled',
			`/add-changelog Update the changelog for version ${ version }. ` +
			`Repo root is ${ ROOT }. ` +
			`Version ${ version } is already confirmed from the Version header in plugin.php. ` +
			'Do not ask to confirm it and do not wait for a reply. ' +
			'Continue from step 3 of the add-changelog skill: detect new vs existing section, ' +
			'collect Release Roadmap items for this version, draft concise changelog lines, ' +
			'and write them into readme.txt. Do not commit.',
		],
		{ cwd: ROOT, stdio: 'inherit' }
	)

	if ( agent.error && agent.error.code === 'ENOENT' ) {
		fail(
			'Cursor CLI `agent` was not found. ' +
			'Run /add-changelog in Cursor to update the changelog.'
		)
	}
	if ( agent.status !== 0 ) {
		fail( `agent changelog exited ${ agent.status }` )
	}

	log( 'Done.' )
}

main()
