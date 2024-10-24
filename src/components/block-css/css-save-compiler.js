/**
 * This object is used for compiling the css generated by the different BlockCss
 * components.  Mainly used for the save function of blocks.
 */

// import { minifyCSS } from '~stackable/util'
import { getMediaQuery } from './util'

const DEVICES = [ 'desktop', 'desktopOnly', 'desktopTablet', 'tabletOnly', 'tablet', 'mobile' ]

class CssSaveCompiler {
	constructor() {
		this.styles = null
	}

	addStyle( selector, rule, value = undefined, device = 'desktop' ) {
		if ( ! this.styles ) {
			this.styles = {}
		}
		// Add the style in this.styles
		if ( ! this.styles[ device ] ) {
			this.styles[ device ] = {}
		}
		if ( ! this.styles[ device ][ selector ] ) {
			this.styles[ device ][ selector ] = {}
		}
		if ( typeof value === 'undefined' ) {
			// TODO: not sure if we need to do this because we might accidentally delete something that wants to add a style.
			// delete this.styles[ device ][ selector ][ rule ]
		} else if ( this.styles[ device ][ selector ][ rule ] !== value ) {
			// Only update if the value changed
			this.styles[ device ][ selector ][ rule ] = value
		}
	}

	// Compile all this.styles into a single string.
	compile() {
		if ( ! this.styles ) {
			return ''
		}

		const allCss = []

		// Follow this order so we can put the media queries that override for smaller screens last.
		DEVICES.forEach( device => {
			if ( ! this.styles[ device ] ) {
				return
			}

			let css = ''

			const selectors = Object.keys( this.styles[ device ] )
			selectors.forEach( selector => {
				let selectorCss = ''
				const rules = Object.keys( this.styles[ device ][ selector ] )
				rules.forEach( rule => {
					// If the style was not added, then delete it from this.styles
					// if ( this.addedStyles[ `${ device }|${ selector }|${ rule }` ] === false ) {
					// 	delete this.styles[ device ][ selector ][ rule ]
					// 	delete this.addedStyles[ `${ device }|${ selector }|${ rule }` ]
					// } else {
					const value = this.styles[ device ][ selector ][ rule ]
					selectorCss += `${ rule }:${ value };`
					// Reset the flag
					// this.addedStyles[ `${ device }|${ selector }|${ rule }` ] = false
					// }
				} )
				if ( selectorCss ) {
					css += `${ selector }{${ selectorCss }}`
				}
			} )

			const mediaQuery = getMediaQuery( device )
			if ( mediaQuery && css ) {
				css = `${ mediaQuery }{${ css }}`
			}

			allCss.push( css )
		} )

		// Let's not minify to make it faster
		// return minifyCSS( allCss.join( '' ) )
		return allCss.join( '' )
	}
}

export default CssSaveCompiler
