#!/usr/bin/env node
/**
 * Static cascade-order check of a build's split stylesheets against its legacy
 * bundle (wraps css-order-check.js). Fails on rules missing from the split
 * files or on order flips that can conflict, except the known benign flips
 * listed in known-flips.json (reviewed in round 1).
 *
 *   node e2e/perf/visual/run-css-order.js <pluginDir> [--legacy=<dist of a release-order bundle>] [--premium]
 */
const fs = require( 'fs' ), path = require( 'path' )
const { spawnSync } = require( 'child_process' )
const args = process.argv.slice( 2 )
const dir = args.find( a => ! a.startsWith( '--' ) )
const rest = args.filter( a => a.startsWith( '--' ) && a !== '--write-known' )
const NODE_PATH = [ path.resolve( __dirname, '../../../node_modules' ), '/workspace/stackable-css-bloat/harness/node_modules' ].join( ':' )
const r = spawnSync( 'node', [ path.join( __dirname, 'css-order-check.js' ), path.join( dir, 'dist' ), ...rest ], { encoding: 'utf8', env: { ...process.env, NODE_PATH } } )
process.stdout.write( r.stdout )
process.stderr.write( r.stderr )
// Reviewed in round 1: editor-only rules no longer in the frontend CSS, and benign order flips.
const known = fs.existsSync( path.join( __dirname, 'known-order-changes.json' ) ) ? JSON.parse( fs.readFileSync( path.join( __dirname, 'known-order-changes.json' ) ) ) : { missing: [], flips: [] }
const m = r.stdout.match( /STK_ORDER_RESULT (\{.*\})/ )
if ( ! m ) {
	console.error( 'no result line from css-order-check.js' )
	process.exit( 2 )
}
const res = JSON.parse( m[ 1 ] )
if ( args.includes( '--write-known' ) ) {
	fs.writeFileSync( path.join( __dirname, 'known-order-changes.json' ), JSON.stringify( { missing: res.missingKeys, flips: res.flips }, null, 1 ) )
}
const unknown = ( res.flips || [] ).filter( f => ! known.flips.includes( f ) )
const unknownMissing = ( res.missingKeys || [] ).filter( k => ! known.missing.includes( k ) )
console.log( `missing ${ res.missing } (unknown ${ unknownMissing.length }), added ${ res.added }, flips ${ ( res.flips || [] ).length } (unknown ${ unknown.length })` )
unknown.forEach( f => console.log( '  unknown flip:', f ) )
unknownMissing.forEach( f => console.log( '  unknown missing rule:', f.slice( 0, 240 ) ) )
process.exit( unknownMissing.length || unknown.length ? 1 : 0 )
