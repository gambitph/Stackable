#!/usr/bin/env node
/**
 * Fast performance budget for the frontend-css CI job.
 *
 * Loads the DynamicWP-style 4-block page (section, heading, text, button)
 * over HTTP — no browser — and checks the numbers that move the ranking:
 * Stackable CSS bytes, inline <style> bytes, Stackable JS bytes, extra
 * database queries, and extra DOM nodes vs the same page without Stackable.
 *
 * Reuses the throwaway site from ci/run.sh (STK_PERF_* env). Meant to
 * finish in a few seconds.
 *
 * If a change legitimately needs more CSS, JS, queries, or DOM, raise the
 * matching number in DEFAULT_BUDGETS below and say why in the commit (for
 * example "heading CSS grew because we added a new layout"). Do not raise
 * a budget only to make CI green — first read the actual-vs-budget line
 * in the job log.
 */
const cheerio = require( 'cheerio' )
const {
	cfg, resetSite, createPage, get, metrics, stkStyles,
} = require( '../lib/site' )

// The e2e Freemius license mock (Premium only) adds a few queries that
// are not Stackable's.
const MOCK_QUERIES = cfg.isPremium && cfg.premiumMock ? 3 : 0

// Limits for the 4-block page, a little above what this branch measures,
// so a typo-sized change still fails but a tiny fluctuation does not.
// The new loading must stay far below the old ~106 kB CSS bundle. Legacy
// mode is that old bundle, so its CSS budget is higher; queries and DOM
// must not get worse.
//
// Override one limit while debugging with STK_BUDGET_CSS, STK_BUDGET_INLINE,
// STK_BUDGET_JS, STK_BUDGET_QUERIES or STK_BUDGET_DOM.
const DEFAULT_BUDGETS = {
	// New per-block loading (legacy flag off). Measured on this branch:
	// about 21 kB CSS (all of it inline), 1.7 kB JS (the injected-block
	// loader), +1 query and +3 DOM nodes.
	off: {
		cssBytes: 28000,
		inlineBytes: 28000,
		jsBytes: 4000,
		queryDelta: 3,
		domDelta: 12,
	},
	// Legacy big stylesheet (flag on). Measured: about 109 kB CSS (mostly
	// linked files, about 3.6 kB inline), no injected-block loader, +1 query
	// and +5 DOM nodes.
	on: {
		cssBytes: 130000,
		inlineBytes: 8000,
		jsBytes: 8000,
		queryDelta: 3,
		domDelta: 16,
	},
}

const envInt = ( name, fallback ) => {
	const value = process.env[ name ]
	return value ? parseInt( value, 10 ) : fallback
}

const defaults = cfg.isLegacyMode ? DEFAULT_BUDGETS.on : DEFAULT_BUDGETS.off
const BUDGET = {
	cssBytes: envInt( 'STK_BUDGET_CSS', defaults.cssBytes ),
	inlineBytes: envInt( 'STK_BUDGET_INLINE', defaults.inlineBytes ),
	jsBytes: envInt( 'STK_BUDGET_JS', defaults.jsBytes ),
	queryDelta: envInt( 'STK_BUDGET_QUERIES', defaults.queryDelta ),
	domDelta: envInt( 'STK_BUDGET_DOM', defaults.domDelta ),
}

/**
 * Bytes of Stackable <script> tags on the page (inline or fetched).
 *
 * @param {string} html Page HTML.
 */
async function stkScriptBytes( html ) {
	const $ = cheerio.load( html )
	let bytes = 0
	for ( const el of $( 'script' ).toArray() ) {
		const id = $( el ).attr( 'id' ) || ''
		const src = ( $( el ).attr( 'src' ) || '' ).replace( /&#038;/g, '&' )
		if ( ! /^(ugb|stk)[-_]/.test( id ) && ! src.includes( `/plugins/${ cfg.slug }/` ) ) {
			continue
		}
		const body = src ? ( await get( src ) ).text : ( $( el ).html() || '' )
		bytes += Buffer.byteLength( body )
	}
	return bytes
}

/**
 * Element count of the HTML (server-rendered; scripts are not run).
 *
 * @param {string} html Page HTML.
 * @return {number} How many elements are in the document.
 */
function domCount( html ) {
	return cheerio.load( html )( '*' ).length
}

/**
 * One failed check as "actual is over budget".
 *
 * @param {string} name What was measured.
 * @param {number} actual The value on this run.
 * @param {number} budget The limit.
 * @param {string} unit Suffix such as " B" or "" (queries / DOM already include +).
 */
function overBudget( name, actual, budget, unit = '' ) {
	if ( actual > budget ) {
		return `${ name } ${ actual }${ unit } is over the ${ budget }${ unit } budget`
	}
	return null
}

function overBudgetDelta( name, actual, budget ) {
	if ( actual > budget ) {
		return `${ name } +${ actual } is over the +${ budget } budget`
	}
	return null
}

async function main() {
	const started = Date.now()
	await resetSite()
	createPage( 'benchmark', 'benchmark.html' )
	// First request can write generated CSS caches; measure the next ones.
	await get( '/benchmark/' )

	const withStk = await get( '/benchmark/' )
	const withoutStk = await get( '/benchmark/', { 'X-Stk-Perf-No-Stk': '1' } )
	const withMetrics = await metrics( '/benchmark/' )
	const withoutMetrics = await metrics( '/benchmark/', { 'X-Stk-Perf-No-Stk': '1' } )

	if ( ! withMetrics || ! withoutMetrics ) {
		console.error( 'budget-check: the stk-perf metrics comment was missing (is the mu-plugin installed?)' )
		process.exit( 2 )
	}

	const styles = await stkStyles( withStk.text )
	const cssBytes = styles.reduce( ( sum, s ) => sum + s.bytes, 0 )
	const inlineBytes = styles
		.filter( s => s.tag === 'style' )
		.reduce( ( sum, s ) => sum + s.bytes, 0 )
	const jsBytes = await stkScriptBytes( withStk.text )
	const queryDelta = withMetrics.queries - withoutMetrics.queries - MOCK_QUERIES
	const domDelta = domCount( withStk.text ) - domCount( withoutStk.text )
	const elapsedMs = Date.now() - started

	const results = {
		legacy: cfg.legacy, cssBytes, inlineBytes, jsBytes, queryDelta, domDelta, elapsedMs,
	}
	console.log( 'STK_BUDGET ' + JSON.stringify( results ) )
	console.log(
		`budget (legacy ${ cfg.legacy }): CSS ${ cssBytes } B / ${ BUDGET.cssBytes }, ` +
		`inline ${ inlineBytes } B / ${ BUDGET.inlineBytes }, ` +
		`JS ${ jsBytes } B / ${ BUDGET.jsBytes }, ` +
		`queries +${ queryDelta } / +${ BUDGET.queryDelta }, ` +
		`DOM +${ domDelta } / +${ BUDGET.domDelta } (${ elapsedMs } ms)`
	)

	const failures = [
		overBudget( 'CSS', cssBytes, BUDGET.cssBytes, ' B' ),
		overBudget( 'inline <style>', inlineBytes, BUDGET.inlineBytes, ' B' ),
		overBudget( 'JS', jsBytes, BUDGET.jsBytes, ' B' ),
		overBudgetDelta( 'queries', queryDelta, BUDGET.queryDelta ),
		overBudgetDelta( 'DOM', domDelta, BUDGET.domDelta ),
	].filter( Boolean )

	if ( failures.length ) {
		console.error( 'budget-check failed:\n  ' + failures.join( '\n  ' ) )
		process.exit( 1 )
	}
}

main().catch( err => {
	console.error( err )
	process.exit( 2 )
} )
