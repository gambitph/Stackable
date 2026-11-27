/**
 * With the legacy flag on, the frontend output must stay identical to the old
 * release (3.20.3 for free; the Premium baseline for Premium).
 *
 * Record the reference with the old release:
 *   STK_PERF_PLUGIN=<3.20.3> STK_PERF_LEGACY=release STK_PERF_REF_WRITE=1 npx playwright test -c playwright.perf.config.js legacy-identical
 * Then run with the new build and STK_PERF_LEGACY=on to compare.
 *
 * With STK_PERF_LEGACY_CSS_ORDER=ignore the stylesheets are compared as sets
 * of rules. CI records the reference from the WordPress.org release, whose
 * bundle has the rules in a slightly different order (the build order wasn't
 * fixed before 3.21.0, see sortByGlobOrder in gulpfile.js).
 */
const fs = require( 'fs' )
const path = require( 'path' )
const crypto = require( 'crypto' )
const { test, expect } = require( '@playwright/test' )
const { cfg, resetSite, createPage, get, stkStyles, wp } = require( './lib/site' )

test.skip( ! cfg.isLegacyMode, 'legacy flag on / old release only' )

const REF_DIR = process.env.STK_PERF_REF_DIR || '/workspace/stackable-css-bloat/round2/legacy-ref'
const REF = path.join( REF_DIR, `legacy-${ cfg.isPremium ? 'premium' : 'free' }.json` )
const WRITE = !! process.env.STK_PERF_REF_WRITE
const PAGES = [ 'benchmark', 'heading', 'accordion', 'columns', 'scheme', 'tabs', 'image', 'icon-list', 'none' ]
const FIXTURE = { scheme: 'color-scheme.html', none: 'no-stackable.html' }
const sha = s => crypto.createHash( 'sha1' ).update( s ).digest( 'hex' ).slice( 0, 16 )
const IGNORE_CSS_ORDER = process.env.STK_PERF_LEGACY_CSS_ORDER === 'ignore'
// The top-level rules (and at-rules) of a stylesheet, sorted.
const sortedRules = css => {
	try {
		return require( 'postcss' ).parse( css ).nodes.map( n => n.toString() ).sort().join( '\n' )
	} catch ( e ) {
		return css
	}
}
// Version strings differ between the release and the new build.
const normalize = html => html
	.replace( /<!-- stk-perf .*? -->/g, '' )
	.replace( /([?&](?:#038;)?ver=)[0-9][^'"&]*/g, '$1X' )
	.replace( /"version":"[^"]*"/g, '"version":"X"' )
	.replace( /stackable_version[^,]*,/g, '' )

const snapshot = async ( p ) => {
	const html = ( await get( p ) ).text
	const styles = await stkStyles( html )
	return {
		tags: styles.map( s => `${ s.tag }#${ s.id }${ s.href ? ' ' + s.href : '' }@${ s.inHead ? 'head' : 'body' }` ),
		css: styles.map( s => sha( s.css ) ),
		rules: styles.map( s => sha( sortedRules( s.css ) ) ),
		html: sha( normalize( html ) ),
		htmlBytes: normalize( html ).length,
		_html: normalize( html ),
	}
}

const ref = WRITE ? {} : ( fs.existsSync( REF ) ? JSON.parse( fs.readFileSync( REF, 'utf8' ) ) : null )

test.beforeAll( async () => {
	await resetSite()
	for ( const p of PAGES ) {
		createPage( p, FIXTURE[ p ] || `${ p }.html` )
	}
} )

test.afterAll( () => {
	if ( WRITE ) {
		fs.mkdirSync( REF_DIR, { recursive: true } )
		fs.writeFileSync( REF, JSON.stringify( ref, null, 1 ) )
	}
} )

for ( const theme of [ 'twentytwentyfive', 'twentytwentyone' ] ) {
	for ( const p of PAGES ) {
		test( `${ theme } /${ p }/ is identical to the old release`, async () => {
			wp( 'theme', 'activate', theme )
			const snap = await snapshot( `/${ p }/` )
			const key = `${ theme }/${ p }`
			if ( WRITE ) {
				ref[ key ] = snap
				return
			}
			expect( ref, `reference ${ REF } missing` ).not.toBeNull()
			const r = ref[ key ]
			expect( snap.tags ).toEqual( r.tags )
			if ( IGNORE_CSS_ORDER ) {
				expect( snap.rules ).toEqual( r.rules )
			} else {
				expect( snap.css ).toEqual( r.css )
			}
			if ( snap.html !== r.html ) {
				// Show the first difference.
				const a = r._html, b = snap._html
				let i = 0
				while ( i < a.length && a[ i ] === b[ i ] ) {
					i++
				}
				expect( b.slice( Math.max( 0, i - 200 ), i + 200 ) ).toBe( a.slice( Math.max( 0, i - 200 ), i + 200 ) )
			}
		} )
	}
}
