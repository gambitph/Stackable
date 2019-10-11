/**
 * External dependencies
 */
import { minifyCSS, prependCSSClass } from '~stackable/util'
import { kebabCase, omit } from 'lodash'

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
 *
 * @return {string} The CSS string
 */
export const combineStyleRules = styleObject => {
	return minifyCSS(
		Object.keys( styleObject ).reduce( ( styleString, selector ) => {
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
	)
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
 *
 * @return {string} Minified CSS string
 */
const generateStyles = ( styleObject, blockMainClassName = '', blockUniqueClassName = '', breakTablet = 1025, breakMobile = 768, editorMode = false ) => {
	const styleStrings = []

	const desktopStyles = omit( styleObject, [ 'tablet', 'mobile', 'editor' ] )
	if ( Object.keys( desktopStyles ).length ) {
		const cleanedStyles = addBlockClassNames( desktopStyles, blockMainClassName, blockUniqueClassName, editorMode )
		styleStrings.push( combineStyleRules( cleanedStyles ) )
	}

	if ( typeof styleObject.tablet !== 'undefined' ) {
		const cleanedStyles = addBlockClassNames( styleObject.tablet, blockMainClassName, blockUniqueClassName, editorMode )
		const tabletStyleString = combineStyleRules( cleanedStyles )
		if ( tabletStyleString ) {
			styleStrings.push( `\n@media screen and (max-width: ${ breakTablet }px) {\n${ tabletStyleString } }` )
		}
	}

	if ( typeof styleObject.mobile !== 'undefined' ) {
		const cleanedStyles = addBlockClassNames( styleObject.mobile, blockMainClassName, blockUniqueClassName, editorMode )
		const mobileStyleString = combineStyleRules( cleanedStyles )
		if ( mobileStyleString ) {
			styleStrings.push( `\n@media screen and (max-width: ${ breakMobile }px) {\n${ mobileStyleString } }` )
		}
	}

	// CSS that will only be rendered while editing.
	if ( editorMode ) {
		if ( typeof styleObject.editor !== 'undefined' ) {
			const cleanedStyles = addBlockClassNames( styleObject.editor, blockMainClassName, blockUniqueClassName, editorMode )
			styleStrings.push( combineStyleRules( cleanedStyles ) )
		}
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
