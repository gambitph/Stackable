import { kebabCase, omit } from 'lodash'
import { minifyCSS } from '@stackable/util'

/**
 * Returns an identical styleObject with all the selectors modified to be wrapped
 * in the provided unique className selector.
 *
 * 	Regex steps:
 *  Add the unique ID:
 *  		".ugb-accordion" -> ".uniqueID .ugb-accordion"
 *  		".ugb-accordion__title" -> ".uniqueID .ugb-accordion__title"
 *  Connect the unique ID and the main class:
 *  		".ugb-accordion" -> ".uniqueID.ugb-accordion"
 *  		".ugb-accordion__title" -> ".uniqueID .ugb-accordion__title"
 *
 * @param {Object} styleObject The object containing selectors and style rules
 * @param {string} blockMainClassName The main className of the block
 * @param {string} blockUniqueClassName The unique className of the block
 *
 * @return {Object} Modified styleObject
 */
const addBlockClassNames = ( styleObject, blockMainClassName = '', blockUniqueClassName = '' ) => {
	return Object.keys( styleObject ).reduce( ( newStyles, selector ) => {
		const newSelector = selector.trim()
			// Add the Unique ID at the start
			.replace( /\s*,\s*/g, `, .${ blockUniqueClassName } ` )

			// The first one at the start doesn't get replaced.
			.replace( /^(.*?)/g, `.${ blockUniqueClassName } ` )

			// Connect the unique ID and the main class.
			.replace( new RegExp( `(.${ blockUniqueClassName }) (.${ blockMainClassName }[^_-\w\d])`, 'g' ), '$1$2' )

			// The last one at the end doesn't get replaced.
			.replace( new RegExp( `(.${ blockUniqueClassName }) (.${ blockMainClassName })$`, 'g' ), '$1$2' )
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
const combineStyleRules = styleObject => {
	return Object.keys( styleObject ).reduce( ( styleString, selector ) => {
		const styles = Object.keys( styleObject[ selector ] ).reduce( ( rules, ruleName ) => {
			const rule = styleObject[ selector ][ ruleName ]
			if ( typeof rule === 'undefined' ) {
				return rules
			}
			return `${ rules }\n\t${ kebabCase( ruleName ) }: ${ rule };`
		}, '' )
		return `${ styleString }\n\n${ selector } {${ styles }\n}`
	}, '' ).trim()
}

/**
 * Generates full CSS style string for a block given its CSS object.
 *
 * @param {Object} styleObject The CSS styles
 * @param {string} blockMainClassName Main block className
 * @param {string} blockUniqueClassName Unique ID className for the block
 * @param {number} breakTablet max-width for tablets
 * @param {number} breakMobile max-width for mobile
 *
 * @return {string} Minified CSS string
 */
const generateStyles = ( styleObject, blockMainClassName = '', blockUniqueClassName = '', breakTablet = 1025, breakMobile = 768 ) => {
	let desktopStyleString = ''
	const desktopStyles = omit( styleObject, [ 'tablet', 'mobile' ] )
	if ( Object.keys( desktopStyles ).length ) {
		const cleanedStyles = addBlockClassNames( desktopStyles, blockMainClassName, blockUniqueClassName )
		desktopStyleString = combineStyleRules( cleanedStyles )
	}

	let tabletStyleString = ''
	if ( typeof styleObject.tablet !== 'undefined' ) {
		const cleanedStyles = addBlockClassNames( styleObject.tablet, blockMainClassName, blockUniqueClassName )
		tabletStyleString = combineStyleRules( cleanedStyles )
	}
	if ( tabletStyleString ) {
		tabletStyleString = `\n@media screen and (max-width: ${ breakTablet }px) {\n${ tabletStyleString } }`
	}

	let mobileStyleString = ''
	if ( typeof styleObject.mobile !== 'undefined' ) {
		const cleanedStyles = addBlockClassNames( styleObject.mobile, blockMainClassName, blockUniqueClassName )
		mobileStyleString = combineStyleRules( cleanedStyles )
	}
	if ( mobileStyleString ) {
		mobileStyleString = `\n@media screen and (max-width: ${ breakMobile }px) {\n${ mobileStyleString } }`
	}

	return minifyCSS( `${ desktopStyleString }${ tabletStyleString }${ mobileStyleString }` )
}

const BlockStyles = props => {
	const {
		style = {},
		blockUniqueClassName = '',
		blockMainClassName = '',
		breakTablet = 1025,
		breakMobile = 768,
	} = props

	return (
		<style>
			{ generateStyles( style, blockMainClassName, blockUniqueClassName, breakTablet, breakMobile ) }
		</style>
	)
}

export default BlockStyles
