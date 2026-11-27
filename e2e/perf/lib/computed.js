/**
 * Computed styles of the elements on a page, for comparing two ways of
 * loading the CSS on the same markup.
 */
const PROPS = [
	'display',
	'position',
	'color',
	'background-color',
	'background-image',
	'opacity',
	'visibility',
	'font-size',
	'font-weight',
	'font-family',
	'line-height',
	'letter-spacing',
	'text-align',
	'text-transform',
	'text-decoration-line',
	'width',
	'max-width',
	'height',
	'min-height',
	'padding-top',
	'padding-right',
	'padding-bottom',
	'padding-left',
	'margin-top',
	'margin-right',
	'margin-bottom',
	'margin-left',
	'border-top-width',
	'border-top-style',
	'border-top-color',
	'border-top-left-radius',
	'flex-direction',
	'flex-wrap',
	'flex-basis',
	'flex-grow',
	'align-items',
	'justify-content',
	'column-gap',
	'row-gap',
	'grid-template-columns',
	'order',
	'box-shadow',
	'transform',
	'z-index',
	'overflow-x',
	'fill',
	'stroke',
]

/**
 * Returns { key: 'prop:value;...' } for every element under root. Elements
 * are keyed by their position in the DOM (the markup is the same in both
 * runs). Element-specific classes added only by one mode are not part of the key.
 *
 * @param {Object}   page  The Playwright page to read.
 * @param {string}   root  Selector of the subtree to read.
 * @param {string[]} props CSS properties to read.
 */
async function computedStyles( page, root = 'body', props = PROPS ) {
	return page.evaluate( ( { root, props } ) => {
		const scope = document.querySelector( root )
		if ( ! scope ) {
			return null
		}
		const out = {}
		const walk = ( el, key ) => {
			if ( [ 'SCRIPT', 'STYLE', 'LINK', 'NOSCRIPT', 'TEMPLATE' ].includes( el.tagName ) ) {
				return
			}
			const cs = getComputedStyle( el )
			out[ key ] = props.map( p => cs.getPropertyValue( p ) ).join( ';' )
			let i = 0
			for ( const child of el.children ) {
				walk( child, `${ key }>${ child.tagName.toLowerCase() }${ i++ }` )
			}
		}
		walk( scope, scope.tagName.toLowerCase() )
		return out
	}, { root, props } )
}

function diffStyles( a, b, props = PROPS ) {
	const out = []
	for ( const key of Object.keys( a ) ) {
		if ( ! ( key in b ) ) {
			out.push( { key, missing: true } )
			continue
		}
		if ( a[ key ] !== b[ key ] ) {
			const av = a[ key ].split( ';' ),
				bv = b[ key ].split( ';' )
			out.push( { key, props: props.map( ( p, i ) => av[ i ] !== bv[ i ] ? `${ p }: ${ av[ i ] } -> ${ bv[ i ] }` : null ).filter( Boolean ) } )
		}
	}
	return out
}

module.exports = {
	PROPS, computedStyles, diffStyles,
}
