/**
 * External dependencies
 */
import { minifyCSS, prependCSSClass } from '~stackable/util'
import {
	kebabCase, omit, isEqual, sortBy,
} from 'lodash'

/**
 * Returns an identical styleObject with all the selectors modified to be wrapped
 * in the provided unique className selector.
 *
 * @param {Object} styleObject The object containing selectors and style rules
 * @param {string} blockMainClassName The main className of the block
 * @param {string} blockUniqueClassName The unique className of the block
 * @param {boolean} editorMode If true, wrap the selectors with `#editor`
 *
 * @return {Object} Modified styleObject
 */
export const addBlockClassNames = ( styleObject, blockMainClassName = '', blockUniqueClassName = '', editorMode = false ) => {
	return Object.keys( styleObject ).reduce( ( newStyles, selector ) => {
		const newSelector = prependCSSClass( selector, blockMainClassName, blockUniqueClassName, editorMode ? '#editor' : '' )
		return {
			...newStyles,
			[ newSelector ]: styleObject[ selector ],
		}
	}, {} )
}

/**
 * Compiles the CSS style object into a CSS string array.
 *
 * @param {Object} styleObject An object containing selectors and style rules
 * @return {Array} An array of CSS styles
 */
export const combineStyleRules = styleObject => {
	return Object.keys( styleObject ).reduce( ( styleCollection, selector ) => {
		const styles = Object.keys( styleObject[ selector ] ).reduce( ( rules, ruleName ) => {
			const rule = styleObject[ selector ][ ruleName ]
			if ( typeof rule === 'undefined' ) {
				return rules
			}

			// KebabCase the style rule, but support custom CSS properties (double dashes) and vendor prefixes (one dash).
			const cleanedRuleName = ruleName.replace( /^(--?)?(.*?$)/, ( matches, dashes, rule ) => `${ dashes || '' }${ kebabCase( rule ) }` )
			return rules + `\n\t` + cleanedRuleName + ': ' + rule + ';' // Faster than using `
		}, '' )

		styleCollection.push( `\n\n` + selector + ' {' + styles + `\n}` ) // Faster than using `

		return styleCollection
	}, [] )
}

/**
 * Forms a media query string for the given devices.
 *
 * @param {Array} _devices A list of devices: desktop, tablet or mobile
 * @param {number} breakDesktop Tablet breakpoint
 * @param {number} breakTablet Mobile breakpoint
 *
 * @return {string} A media query
 */
export const formMediaQuery = ( _devices = [ 'desktop' ], breakDesktop = 1024, breakTablet = 768 ) => {
	const devices = sortBy( typeof _devices === 'string' ? _devices.split( ',' ).map( d => d.trim() ) : _devices )

	// This should be identical to styles/breakpoints.scss
	if ( isEqual( devices, [ 'desktop', 'tablet' ] ) ) {
		return '@media screen and (min-width: ' + breakTablet + 'px)'
	} else if ( isEqual( devices, [ 'desktop' ] ) ) {
		return '@media screen and (min-width: ' + breakDesktop + 'px)'
	} else if ( isEqual( devices, [ 'mobile', 'tablet' ] ) ) {
		return '@media screen and (max-width: ' + ( breakDesktop - 1 ) + 'px)'
	} else if ( isEqual( devices, [ 'tablet' ] ) ) {
		return '@media screen and (min-width: ' + breakTablet + 'px) and (max-width: ' + ( breakDesktop - 1 ) + 'px)'
	} else if ( isEqual( devices, [ 'mobile' ] ) ) {
		return '@media screen and (max-width: ' + ( breakTablet - 1 ) + 'px)'
	}
	return null
}

/**
 * Generates full CSS style string for a block given its CSS object.
 *
 * @param {Object} styleObject The CSS styles
 * @param {string} blockMainClassName Main block className
 * @param {string} blockUniqueClassName Unique ID className for the block
 * @param {number} breakTablet max-width for tablets
 * @param {number} breakMobile max-width for mobile
 * @param {boolean} editorMode If true, the styles generated will be wrapped in the `#editor` selector
 * @param {boolean} recursiveCalls Used only for editors styles. Number of times this function was called recursively
 *
 * @return {string} Minified CSS string
 */
export const generateStyles = ( styleObject, blockMainClassName = '', blockUniqueClassName = '', breakTablet = 1024, breakMobile = 768, editorMode = false, recursiveCalls = 0 ) => {
	const styleStrings = []

	/**
	 * Clean the style object to lessen the amount of style generation, remove
	 * all styles and rules that are undefined.
	 *
	 * styleObject structure that will be cleaned = {
	 * 		desktopSelector1: { styleRule: value, styleRule2: value },
	 * 		desktopSelector2: { styles },
	 * 		...desktopSelectors: { styles },
	 * 		tablet: {
	 * 			tabletSelector1: { styles },
	 * 			...tabletSelectors: { styles },
	 * 		},
	 * 		...otherDevicesOrModes: {
	 * 			...selectors: { styles },
	 * 		}
	 * }
	 *
	 * For example:
	 *
	 * styleObject = {
	 * 		'.ugb-card__title': {
	 * 			color: 'red',
	 * 		},
	 * 		tablet: {
	 * 			'.ugb-card__title': {
	 * 				color: 'red',
	 * 			},
	 * 		},
	 * 		mobile: {
	 * 			'.ugb-card__title': {
	 * 				color: 'red',
	 * 			},
	 * 		},
	 * }
	 */
	Object.keys( styleObject ).forEach( selector => {
		// We have deeper level object styles for non-desktop style.
		if ( [ 'desktopTablet', 'desktopOnly', 'tablet', 'tabletOnly', 'mobile', 'ie11', 'editor', 'saveOnly', 'custom' ].includes( selector ) ) {
			const mediaQuery = selector
			Object.keys( styleObject[ mediaQuery ] ).forEach( selector => {
				// Remove undefined properties, undefined means we will not use the style rule.
				Object.keys( styleObject[ mediaQuery ][ selector ] ).forEach( key =>
					styleObject[ mediaQuery ][ selector ][ key ] === undefined ? delete styleObject[ mediaQuery ][ selector ][ key ] : {}
				)
				// If we end up with an empty selector (no remaining styles), remove it.
				if ( ! Object.keys( styleObject[ mediaQuery ][ selector ] ).length ) {
					delete styleObject[ mediaQuery ][ selector ]
				}
			} )
			// If we end up with an empty style set (no remaining styles), remove it.
			if ( ! Object.keys( styleObject[ mediaQuery ] ).length ) {
				delete styleObject[ mediaQuery ]
			}
		// Desktop selectors.
		} else {
			// Remove undefined properties, undefined means we will not use the style rule.
			Object.keys( styleObject[ selector ] ).forEach( key => styleObject[ selector ][ key ] === undefined ? delete styleObject[ selector ][ key ] : {} )
			// If we end up with an empty selector (no remaining styles), remove it.
			if ( ! Object.keys( styleObject[ selector ] ).length ) {
				delete styleObject[ selector ]
			}
		}
	} )

	const desktopStyles = omit( styleObject, [ 'desktopTablet', 'desktopOnly', 'tablet', 'tabletOnly', 'mobile', 'ie11', 'editor', 'saveOnly', 'custom' ] )
	if ( Object.keys( desktopStyles ).length ) {
		const cleanedStyles = addBlockClassNames( desktopStyles, blockMainClassName, blockUniqueClassName, editorMode )
		Array.prototype.push.apply( styleStrings, combineStyleRules( cleanedStyles ) ) // Faster than .concat method.
	}

	if ( typeof styleObject.desktopTablet !== 'undefined' ) {
		const cleanedStyles = addBlockClassNames( styleObject.desktopTablet, blockMainClassName, blockUniqueClassName, editorMode )
		const styleString = combineStyleRules( cleanedStyles, ! editorMode )
		if ( styleString ) {
			if ( editorMode ) {
				styleString.forEach( styles => {
					styleStrings.push( `\n\n` + formMediaQuery( [ 'desktop', 'tablet' ], breakTablet, breakMobile ) + ` {\n` + styles + ' }' )
				} )
			} else {
				styleStrings.push( `\n\n${ formMediaQuery( [ 'desktop', 'tablet' ], breakTablet, breakMobile ) } {\n${ styleString.join( '' ) } }` )
			}
		}
	}

	if ( typeof styleObject.desktopOnly !== 'undefined' ) {
		const cleanedStyles = addBlockClassNames( styleObject.desktopOnly, blockMainClassName, blockUniqueClassName, editorMode )
		const styleString = combineStyleRules( cleanedStyles, ! editorMode )
		if ( styleString ) {
			if ( editorMode ) {
				styleString.forEach( styles => {
					styleStrings.push( `\n\n` + formMediaQuery( [ 'desktop' ], breakTablet, breakMobile ) + ` {\n` + styles + ' }' )
				} )
			} else {
				styleStrings.push( `\n\n${ formMediaQuery( [ 'desktop' ], breakTablet, breakMobile ) } {\n${ styleString.join( '' ) } }` )
			}
		}
	}

	if ( typeof styleObject.tablet !== 'undefined' ) {
		const cleanedStyles = addBlockClassNames( styleObject.tablet, blockMainClassName, blockUniqueClassName, editorMode )
		const styleString = combineStyleRules( cleanedStyles, ! editorMode )
		if ( styleString ) {
			if ( editorMode ) {
				styleString.forEach( styles => {
					styleStrings.push( `\n\n` + formMediaQuery( [ 'mobile', 'tablet' ], breakTablet, breakMobile ) + ` {\n` + styles + ' }' )
				} )
			} else {
				styleStrings.push( `\n\n${ formMediaQuery( [ 'mobile', 'tablet' ], breakTablet, breakMobile ) } {\n${ styleString.join( '' ) } }` )
			}
		}
	}

	if ( typeof styleObject.tabletOnly !== 'undefined' ) {
		const cleanedStyles = addBlockClassNames( styleObject.tabletOnly, blockMainClassName, blockUniqueClassName, editorMode )
		const styleString = combineStyleRules( cleanedStyles, ! editorMode )
		if ( styleString ) {
			if ( editorMode ) {
				styleString.forEach( styles => {
					styleStrings.push( `\n\n` + formMediaQuery( [ 'tablet' ], breakTablet, breakMobile ) + ` {\n` + styles + ' }' )
				} )
			} else {
				styleStrings.push( `\n\n${ formMediaQuery( [ 'tablet' ], breakTablet, breakMobile ) } {\n${ styleString.join( '' ) } }` )
			}
		}
	}

	if ( typeof styleObject.mobile !== 'undefined' ) {
		const cleanedStyles = addBlockClassNames( styleObject.mobile, blockMainClassName, blockUniqueClassName, editorMode )
		const styleString = combineStyleRules( cleanedStyles, ! editorMode )
		if ( styleString ) {
			if ( editorMode ) {
				styleString.forEach( styles => {
					styleStrings.push( `\n\n` + formMediaQuery( [ 'mobile' ], breakTablet, breakMobile ) + ` {\n` + styles + ' }' )
				} )
			} else {
				styleStrings.push( `\n\n${ formMediaQuery( [ 'mobile' ], breakTablet, breakMobile ) } {\n${ styleString.join( '' ) } }` )
			}
		}
	}

	if ( typeof styleObject.ie11 !== 'undefined' ) {
		const cleanedStyles = addBlockClassNames( styleObject.ie11, blockMainClassName, blockUniqueClassName, editorMode )
		const styleString = combineStyleRules( cleanedStyles, ! editorMode )
		if ( styleString ) {
			styleStrings.push( `\n\n@media screen and (-ms-high-contrast: active), screen and (-ms-high-contrast: none) {\n${ styleString.join( '' ) } }` )
		}
	}

	if ( typeof styleObject.custom !== 'undefined' ) {
		Array.prototype.push.apply( styleStrings, combineStyleRules( styleObject.custom ) ) // Faster than .concat method.
	}

	// CSS that will only be rendered while editing.
	if ( editorMode && typeof styleObject.editor !== 'undefined' && ! recursiveCalls ) {
		Array.prototype.push.apply( styleStrings, generateStyles( styleObject.editor, blockMainClassName, blockUniqueClassName, breakTablet, breakMobile, editorMode, recursiveCalls++ ) ) // Faster than concat.
	}

	// CSS that will only be rendered while saving.
	if ( ! editorMode && typeof styleObject.saveOnly !== 'undefined' && ! recursiveCalls ) {
		Array.prototype.push.apply( styleStrings, generateStyles( styleObject.saveOnly, blockMainClassName, blockUniqueClassName, breakTablet, breakMobile, editorMode, recursiveCalls++ ) ) // Faster than concat.
	}

	return styleStrings
}

const Style = props => {
	const {
		style = {},
		editorMode = false,
		blockUniqueClassName = '',
		blockMainClassName = '',
		breakTablet = 1024,
		breakMobile = 768,
	} = props
	const styles = generateStyles( style, blockMainClassName, blockUniqueClassName, breakTablet, breakMobile, editorMode )

	// It's way faster in React if you do smaller `<style>` tags instead of just a single one. Do it when in editor mode.
	if ( editorMode ) {
		return styles ? styles.map( ( styles, i ) => <style key={ i }>{ styles }</style> ) : null
	}
	return styles && styles.length ? <style>{ minifyCSS( styles.join( '' ) ) }</style> : null
}

export default Style
