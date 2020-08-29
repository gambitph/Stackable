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
 * Compiles the CSS style object into a CSS string.
 *
 * @param {Object} styleObject An object containing selectors and style rules
 * @param {boolean} minify If true, minify the CSS
 * @return {string} The CSS string
 */
export const combineStyleRules = ( styleObject, minify = true ) => {
	const css = Object.keys( styleObject ).reduce( ( styleString, selector ) => {
		const styles = Object.keys( styleObject[ selector ] ).reduce( ( rules, ruleName ) => {
			const rule = styleObject[ selector ][ ruleName ]
			if ( typeof rule === 'undefined' ) {
				return rules
			}

			// KebabCase the style rule, but support custom CSS properties (double dashes) and vendor prefixes (one dash).
			const cleanedRuleName = ruleName.replace( /^(--?)?(.*?$)/, ( matches, dashes, rule ) => `${ dashes || '' }${ kebabCase( rule ) }` )
			return `${ rules }\n\t${ cleanedRuleName }: ${ rule };`
		}, '' )
		return `${ styleString }\n\n${ selector } {${ styles }\n}`
	}, '' ).trim()

	return minify ? minifyCSS( css ) : css
}

/**
 * Forms a media query string for the given devices.
 *
 * @param {Array} _devices A list of devices: desktop, tablet or mobile
 * @param {number} breakTablet Tablet breakpoint
 * @param {number} breakMobile Mobile breakpoint
 *
 * @return {string} A media query
 */
export const formMediaQuery = ( _devices = [ 'desktop' ], breakTablet = 1025, breakMobile = 768 ) => {
	const devices = sortBy( typeof _devices === 'string' ? _devices.split( ',' ).map( d => d.trim() ) : _devices )

	if ( isEqual( devices, [ 'desktop', 'tablet' ] ) ) {
		return `@media screen and (min-width: ${ breakMobile }px)`
	} else if ( isEqual( devices, [ 'desktop' ] ) ) {
		return `@media screen and (min-width: ${ breakTablet }px)`
	} else if ( isEqual( devices, [ 'mobile', 'tablet' ] ) ) {
		return `@media screen and (max-width: ${ breakTablet }px)`
	} else if ( isEqual( devices, [ 'tablet' ] ) ) {
		return `@media screen and (min-width: ${ breakMobile }px) and (max-width: ${ breakTablet }px)`
	} else if ( isEqual( devices, [ 'mobile' ] ) ) {
		return `@media screen and (max-width: ${ breakMobile }px)`
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
export const generateStyles = ( styleObject, blockMainClassName = '', blockUniqueClassName = '', breakTablet = 1025, breakMobile = 768, editorMode = false, recursiveCalls = 0 ) => {
	const styleStrings = []

	const desktopStyles = omit( styleObject, [ 'desktopTablet', 'desktopOnly', 'tablet', 'tabletOnly', 'mobile', 'ie11', 'editor' ] )
	if ( Object.keys( desktopStyles ).length ) {
		const cleanedStyles = addBlockClassNames( desktopStyles, blockMainClassName, blockUniqueClassName, editorMode )
		styleStrings.push( combineStyleRules( cleanedStyles ) )
	}

	if ( typeof styleObject.desktopTablet !== 'undefined' ) {
		const cleanedStyles = addBlockClassNames( styleObject.desktopTablet, blockMainClassName, blockUniqueClassName, editorMode )
		const styleString = combineStyleRules( cleanedStyles )
		if ( styleString ) {
			styleStrings.push( `\n${ formMediaQuery( [ 'desktop', 'tablet' ], breakTablet, breakMobile ) } {\n${ styleString } }` )
		}
	}

	if ( typeof styleObject.desktopOnly !== 'undefined' ) {
		const cleanedStyles = addBlockClassNames( styleObject.desktopOnly, blockMainClassName, blockUniqueClassName, editorMode )
		const styleString = combineStyleRules( cleanedStyles )
		if ( styleString ) {
			styleStrings.push( `\n${ formMediaQuery( [ 'desktop' ], breakTablet, breakMobile ) } {\n${ styleString } }` )
		}
	}

	if ( typeof styleObject.tablet !== 'undefined' ) {
		const cleanedStyles = addBlockClassNames( styleObject.tablet, blockMainClassName, blockUniqueClassName, editorMode )
		const styleString = combineStyleRules( cleanedStyles )
		if ( styleString ) {
			styleStrings.push( `\n${ formMediaQuery( [ 'mobile', 'tablet' ], breakTablet, breakMobile ) } {\n${ styleString } }` )
		}
	}

	if ( typeof styleObject.tabletOnly !== 'undefined' ) {
		const cleanedStyles = addBlockClassNames( styleObject.tabletOnly, blockMainClassName, blockUniqueClassName, editorMode )
		const styleString = combineStyleRules( cleanedStyles )
		if ( styleString ) {
			styleStrings.push( `\n${ formMediaQuery( [ 'tablet' ], breakTablet, breakMobile ) } {\n${ styleString } }` )
		}
	}

	if ( typeof styleObject.mobile !== 'undefined' ) {
		const cleanedStyles = addBlockClassNames( styleObject.mobile, blockMainClassName, blockUniqueClassName, editorMode )
		const styleString = combineStyleRules( cleanedStyles )
		if ( styleString ) {
			styleStrings.push( `\n${ formMediaQuery( [ 'mobile' ], breakTablet, breakMobile ) } {\n${ styleString } }` )
		}
	}

	if ( typeof styleObject.ie11 !== 'undefined' ) {
		const cleanedStyles = addBlockClassNames( styleObject.ie11, blockMainClassName, blockUniqueClassName, editorMode )
		const styleString = combineStyleRules( cleanedStyles )
		if ( styleString ) {
			styleStrings.push( `\n@media screen and (-ms-high-contrast: active), screen and (-ms-high-contrast: none) {\n${ styleString } }` )
		}
	}

	// CSS that will only be rendered while editing.
	if ( editorMode && typeof styleObject.editor !== 'undefined' && ! recursiveCalls ) {
		styleStrings.push( generateStyles( styleObject.editor, blockMainClassName, blockUniqueClassName, breakTablet, breakMobile, editorMode, recursiveCalls++ ) )
	}

	return minifyCSS( styleStrings.join( '' ) )
}

const BlockStyles = props => {
	const {
		style = {},
		editorMode = false,
		blockUniqueClassName = '',
		blockMainClassName = '',
		breakTablet = 1025,
		breakMobile = 768,
	} = props
	const styles = generateStyles( style, blockMainClassName, blockUniqueClassName, breakTablet, breakMobile, editorMode )
	return styles ? <style>{ styles }</style> : null
}

export default BlockStyles
