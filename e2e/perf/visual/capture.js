// Usage: node capture.js <outDir> [filterRegex]
// Captures, for each target: server HTML, ordered asset list (link/style/script with position + handle),
// the asset contents, full-page screenshots per viewport, and computed styles per viewport.
const crypto = require( 'crypto' )
const fs = require( 'fs' )
const path = require( 'path' )
const cheerio = require( 'cheerio' )
const { chromium } = require( 'playwright-core' )
const SITE = process.env.SITE || 'http://127.0.0.1:8891'
const OUT = path.resolve( process.argv[ 2 ] || 'out' )
const FILTER = process.argv[ 3 ] ? new RegExp( process.argv[ 3 ] ) : null
const T0 = new Date( '2026-12-01T09:00:00+08:00' ).getTime()
const PROPS = [ 'display',
	'position',
	'color',
	'background-color',
	'background-image',
	'font-family',
	'font-size',
	'font-weight',
	'font-style',
	'line-height',
	'letter-spacing',
	'text-align',
	'text-transform',
	'text-decoration-line',
	'margin-top',
	'margin-right',
	'margin-bottom',
	'margin-left',
	'padding-top',
	'padding-right',
	'padding-bottom',
	'padding-left',
	'border-top-width',
	'border-top-style',
	'border-top-color',
	'border-bottom-width',
	'border-left-width',
	'border-right-width',
	'border-top-left-radius',
	'border-bottom-right-radius',
	'width',
	'height',
	'max-width',
	'min-height',
	'flex-direction',
	'flex-wrap',
	'flex-grow',
	'flex-basis',
	'justify-content',
	'align-items',
	'gap',
	'row-gap',
	'column-gap',
	'grid-template-columns',
	'box-shadow',
	'opacity',
	'transform',
	'z-index',
	'overflow',
	'fill',
	'stroke',
	'object-fit',
	'visibility' ]
const sha = s => crypto.createHash( 'sha1' ).update( s ).digest( 'hex' ).slice( 0, 16 )

function assetList( html ) {
	const $ = cheerio.load( html )
	const list = []
	// Region boundaries: head, body (inside site container), footer (after the site container = wp_footer output).
	const siteEl = $( '.wp-site-blocks' ).length ? $( '.wp-site-blocks' ).first() : $( '#page' ).first()
	const all = $( 'link[rel="stylesheet"], style, script' ).toArray()
	const inSite = new Set( siteEl.find( 'link, style, script' ).toArray() )
	const siteNodes = siteEl.length ? siteEl[ 0 ] : null
	all.forEach( ( el, i ) => {
		const $el = $( el )
		const tag = el.tagName
		const inHead = $el.closest( 'head' ).length > 0
		let region = inHead ? 'head' : ( inSite.has( el ) ? 'body' : 'footer' )
		// Elements in body before the site container (e.g. wp_body_open) count as body.
		if ( region === 'footer' && siteNodes ) {
			const pos = $( 'body *' ).index( el ),
				sitePos = $( 'body *' ).index( siteNodes )
			if ( pos < sitePos ) {
				region = 'body-open'
			}
		}
		const id = $el.attr( 'id' ) || ''
		const handle = id.replace( /-(css|js|inline-css|js-extra|js-after|js-before|inline-js)$/, '' )
		const src = tag === 'link' ? $el.attr( 'href' ) : ( tag === 'script' ? $el.attr( 'src' ) : null )
		const content = src ? null : $el.html()
		// Stackable-related flag.
		const isStk = /ugb|stk|stackable/i.test( id + ' ' + ( src || '' ) ) || ( tag === 'style' && /\.stk-/.test( content || '' ) )
		list.push( {
			i, tag, region, id, handle, src: src || null, media: $el.attr( 'media' ) || null, type: $el.attr( 'type' ) || null, inlineBytes: content ? Buffer.byteLength( content ) : 0, inlineSha: content ? sha( content ) : null, isStk, blockScoped: !! $el.closest( '.stk-block' ).length,
		} )
	} )
	return { list, $ }
}

async function fetchText( url, cookieHeader ) {
	const r = await fetch( url, { headers: { cookie: cookieHeader } } )
	return { status: r.status, text: await r.text() }
}

( async () => {
	const targets = require( './targets' ).filter( t => ! FILTER || FILTER.test( t.id ) )
	fs.mkdirSync( OUT, { recursive: true } )
	const assetDir = path.join( OUT, '_assets' ); fs.mkdirSync( assetDir, { recursive: true } )
	const manifest = fs.existsSync( path.join( OUT, 'manifest.json' ) ) ? JSON.parse( fs.readFileSync( path.join( OUT, 'manifest.json' ) ) ) : {
		site: SITE, created: new Date().toISOString(), targets: {},
	}
	const browser = await chromium.launch( { executablePath: '/usr/bin/google-chrome', args: [ '--no-sandbox', '--disable-gpu', '--font-render-hinting=none', '--disable-lcd-text', '--force-color-profile=srgb', '--hide-scrollbars' ] } )
	for ( const t of targets ) {
		const dir = path.join( OUT, t.id ); fs.mkdirSync( dir, { recursive: true } )
		const cookieHeader = Object.entries( t.cookies ).map( ( [ k, v ] ) => `${ k }=${ v }` ).join( '; ' )
		const url = SITE + t.path
		// 1. Server HTML + assets.
		const { status, text: html } = await fetchText( url, cookieHeader )
		fs.writeFileSync( path.join( dir, 'page.html' ), html )
		const { list, $ } = assetList( html )
		for ( const a of list ) {
			if ( a.src ) {
				const abs = new URL( a.src.replace( /&#038;/g, '&' ), url ).href
				if ( abs.startsWith( SITE ) ) {
					const { text } = await fetchText( abs, cookieHeader )
					a.file = sha( text ) + ( a.tag === 'link' ? '.css' : '.js' ); a.bytes = Buffer.byteLength( text )
					fs.writeFileSync( path.join( assetDir, a.file ), text )
				}
			}
		}
		$( 'link[rel="stylesheet"], style, script' ).each( ( i, el ) => {
			const c = $( el ).html(); if ( ! list[ i ].src && c ) {
				list[ i ].file = list[ i ].inlineSha + ( el.tagName === 'script' ? '.js' : '.css' ); fs.writeFileSync( path.join( assetDir, list[ i ].file ), c )
			}
		} )
		fs.writeFileSync( path.join( dir, 'assets.json' ), JSON.stringify( list, null, 1 ) )

		// 2. Rendered: screenshots + computed styles + runtime asset list (after JS / AJAX).
		const shots = {}
		for ( const vw of t.viewports ) {
			const ctx = await browser.newContext( {
				viewport: { width: vw, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'no-preference',
			} )
			if ( cookieHeader ) {
				await ctx.addCookies( Object.entries( t.cookies ).map( ( [ name, value ] ) => ( {
					name, value, url: SITE,
				} ) ) )
			}
			const page = await ctx.newPage()
			await page.clock.install( { time: T0 } )
			await page.clock.pauseAt( T0 + 1000 )
			// Block external requests (Google maps / YouTube) for determinism.
			await page.route( /^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort() )
			await page.goto( url, { waitUntil: 'load', timeout: 120000 } )
			await page.clock.runFor( 500 )
			// Scroll through to trigger entrance animations / count up / progress.
			const h = await page.evaluate( () => document.documentElement.scrollHeight )
			for ( let y = 0; y < h; y += 400 ) {
				await page.evaluate( y => window.scrollTo( 0, y ), y ); await page.clock.runFor( 300 )
			}
			if ( t.id.endsWith( 'dyn-alm' ) ) {
				await page.clock.resume()
				await page.waitForSelector( '.lm-alm-item', { timeout: 20000 } ).catch( () => {} )
				const btn = await page.$( '.alm-load-more-btn' ); if ( btn ) {
					await btn.click(); await page.waitForFunction( () => document.querySelectorAll( '.lm-alm-item' ).length >= 2, null, { timeout: 20000 } ).catch( () => {} )
				}
				await page.waitForTimeout( 1500 ); await page.clock.pauseAt( Date.now() + 1000 ).catch( () => {} )
				const h2 = await page.evaluate( () => document.documentElement.scrollHeight )
				for ( let y = 0; y < h2; y += 400 ) {
					await page.evaluate( y => window.scrollTo( 0, y ), y ); await page.waitForTimeout( 50 )
				}
			}
			await page.clock.runFor( 5000 )
			// Wait for all images to load (lazy images can still be loading after the scroll).
			await page.evaluate( () => document.querySelectorAll( 'img[loading=lazy]' ).forEach( i => {
				i.loading = 'eager'
			} ) )
			await page.waitForFunction( () => [ ...document.images ].every( i => i.complete ), null, { timeout: 15000 } ).catch( () => {} )
			await page.evaluate( () => window.scrollTo( 0, 0 ) )
			await page.evaluate( () => document.fonts.ready )
			if ( t.id.endsWith( 'dyn-popup' ) ) {
				await page.click( '.lm-open-popup a' ).catch( () => {} ); await page.clock.runFor( 2000 )
			}
			await page.clock.runFor( 1000 )
			const file = `shot-${ vw }.png`
			await page.screenshot( {
				path: path.join( dir, file ), fullPage: ! t.id.endsWith( 'dyn-popup' ), animations: 'disabled', caret: 'hide', mask: [ page.locator( 'iframe' ) ], maskColor: '#ff00ff', timeout: 120000,
			} )
			shots[ vw ] = file
			// Computed styles of all elements inside the site container, keyed by DOM path.
			const cs = await page.evaluate( PROPS => {
				const root = document.querySelector( '.wp-site-blocks' ) || document.querySelector( '#page' ) || document.body
				const out = {}
				const pathOf = el => {
					const p = []; while ( el && el !== document.body ) {
						let i = 0,
							s = el; while ( ( s = s.previousElementSibling ) ) {
							i++
						} p.unshift( el.tagName.toLowerCase() + ':' + i ); el = el.parentElement
					} return p.join( '>' )
				}
				const els = [ root, ...root.querySelectorAll( '*' ), ...document.querySelectorAll( '.pum-container, .pum-container *, .alm-listing *' ) ]
				for ( const el of els ) {
					if ( [ 'SCRIPT', 'STYLE', 'LINK', 'NOSCRIPT', 'IFRAME' ].includes( el.tagName ) ) {
						continue
					}
					const s = getComputedStyle( el ); const o = {}
					PROPS.forEach( p => {
						o[ p ] = s.getPropertyValue( p )
					} )
					for ( const pseudo of [ '::before', '::after' ] ) {
						const ps = getComputedStyle( el, pseudo ); if ( ps.content && ps.content !== 'none' && ps.content !== 'normal' ) {
							PROPS.forEach( p => {
								o[ pseudo + p ] = ps.getPropertyValue( p )
							} ); o[ pseudo + 'content' ] = ps.content
						}
					}
					out[ pathOf( el ) + '|' + ( el.className && el.className.baseVal === undefined ? String( el.className ).split( /\s+/ ).filter( c => c && ! /^stk-[0-9a-f]{7}/.test( c ) ).slice( 0, 4 ).join( '.' ) : '' ) ] = o
				}
				return out
			}, PROPS )
			fs.writeFileSync( path.join( dir, `computed-${ vw }.json` ), JSON.stringify( cs ) )
			if ( vw === t.viewports[ 0 ] ) {
				const runtime = await page.evaluate( () => [ ...document.querySelectorAll( 'link[rel="stylesheet"], style' ) ].map( ( el, i ) => ( {
					i, tag: el.tagName.toLowerCase(), id: el.id, href: el.href || null, region: el.closest( 'head' ) ? 'head' : 'body', rules: ( () => {
						try {
							return el.sheet ? el.sheet.cssRules.length : null
						} catch ( e ) {
							return null
						}
					} )(),
				} ) ) )
				fs.writeFileSync( path.join( dir, 'runtime-styles.json' ), JSON.stringify( runtime, null, 1 ) )
			}
			await ctx.close()
		}
		const stkCss = list.filter( a => a.isStk && ( a.tag === 'link' || a.tag === 'style' ) )
		manifest.targets[ t.id ] = {
			url: t.path, cookies: t.cookies, status, htmlBytes: Buffer.byteLength( html ), assets: list.length, stkCssBytes: stkCss.reduce( ( s, a ) => s + ( a.bytes || a.inlineBytes || 0 ), 0 ), screenshots: shots, captured: new Date().toISOString(),
		}
		console.log( t.id, status, 'assets', list.length, 'stkCss', manifest.targets[ t.id ].stkCssBytes )
		fs.writeFileSync( path.join( OUT, 'manifest.json' ), JSON.stringify( manifest, null, 1 ) )
	}
	await browser.close()
} )()
