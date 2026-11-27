import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import {
	comparePluginTrees,
	logicalChunkPath,
	pluginRootFromExtract,
} from './diff.mjs'

const HASH_A = 'a'.repeat( 20 )
const HASH_B = 'b'.repeat( 20 )

const write = ( root, relPath, contents ) => {
	const full = join( root, relPath )
	mkdirSync( join( full, '..' ), { recursive: true } )
	writeFileSync( full, contents )
}

const withTrees = ( setup, assertResult ) => {
	const root = mkdtempSync( join( tmpdir(), 'stk-release-ready-' ) )
	const oldRoot = join( root, 'old' )
	const newRoot = join( root, 'new' )
	const dest = join( root, 'out' )
	try {
		setup( oldRoot, newRoot )
		const result = comparePluginTrees( oldRoot, newRoot, dest, 'free' )
		assertResult( result )
	} finally {
		rmSync( root, { recursive: true, force: true } )
	}
}

test( 'logical chunk path strips the webpack content hash', () => {
	assert.equal(
		logicalChunkPath( `dist/chunks/google-fonts.${ HASH_A }.js` ),
		'dist/chunks/google-fonts.js'
	)
	assert.equal(
		logicalChunkPath( `dist/chunks/style-guide.${ HASH_A }.js.LICENSE.txt` ),
		'dist/chunks/style-guide.js.LICENSE.txt'
	)
	assert.equal( logicalChunkPath( 'dist/frontend_blocks.js' ), 'dist/frontend_blocks.js' )
} )

test( 'plugin root is the single directory inside an unzipped plugin zip', () => {
	const root = mkdtempSync( join( tmpdir(), 'stk-release-ready-zip-' ) )
	try {
		mkdirSync( join( root, 'stackable-ultimate-gutenberg-blocks' ) )
		assert.equal(
			pluginRootFromExtract( root ),
			join( root, 'stackable-ultimate-gutenberg-blocks' )
		)
	} finally {
		rmSync( root, { recursive: true, force: true } )
	}
} )

test( 'a hashed chunk rename with a small size change is not a size flag', () => {
	withTrees( ( oldRoot, newRoot ) => {
		write( oldRoot, `dist/chunks/google-fonts.${ HASH_A }.js`, 'a'.repeat( 1000 ) )
		write( newRoot, `dist/chunks/google-fonts.${ HASH_B }.js`, 'b'.repeat( 1100 ) )
		write( oldRoot, `dist/chunks/style-guide.${ HASH_A }.js.LICENSE.txt`, 'license\n' )
		write( newRoot, `dist/chunks/style-guide.${ HASH_B }.js.LICENSE.txt`, 'license\n' )
	}, result => {
		assert.deepEqual( result.added, [] )
		assert.deepEqual( result.removed, [] )
		assert.equal( result.renames.length, 2 )
		assert.equal( result.sizes.length, 1 )
		assert.equal( result.sizes[ 0 ].path, 'dist/chunks/google-fonts.js' )
		assert.equal( result.sizes[ 0 ].status, 'renamed' )
		assert.equal( result.sizes[ 0 ].flag, false )
		assert.equal( result.sizes[ 0 ].deltaBytes, 100 )
	} )
} )

test( 'a hashed chunk that grows past the size ratio is still flagged', () => {
	withTrees( ( oldRoot, newRoot ) => {
		write( oldRoot, `dist/chunks/style-guide.${ HASH_A }.js`, 'a'.repeat( 1000 ) )
		write( newRoot, `dist/chunks/style-guide.${ HASH_B }.js`, 'b'.repeat( 1600 ) )
	}, result => {
		assert.equal( result.sizes.length, 1 )
		assert.equal( result.sizes[ 0 ].status, 'renamed' )
		assert.equal( result.sizes[ 0 ].flag, true )
		assert.deepEqual( result.added, [] )
		assert.deepEqual( result.removed, [] )
	} )
} )

test( 'a chunk that appears or disappears without a pair is still flagged', () => {
	withTrees( ( oldRoot, newRoot ) => {
		write( oldRoot, `dist/chunks/old-only.${ HASH_A }.js`, 'old' )
		write( newRoot, `dist/chunks/new-only.${ HASH_B }.js`, 'new' )
	}, result => {
		assert.deepEqual( result.added, [ `dist/chunks/new-only.${ HASH_B }.js` ] )
		assert.deepEqual( result.removed, [ `dist/chunks/old-only.${ HASH_A }.js` ] )
		assert.deepEqual( result.renames, [] )
		assert.equal( result.sizes.filter( row => row.flag ).length, 2 )
	} )
} )
