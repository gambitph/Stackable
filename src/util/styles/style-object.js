/**
 * Internal dependencies
 */
import { getAttributeName } from '~stackable/util'
import { useBlockHoverState, useDeviceType } from '~stackable/hooks'

/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element'
import { sprintf } from '@wordpress/i18n'

/**
 * Style object, this manages the generation of styles.
 */
class StyleObject {
	constructor( styleParams = [] ) {
	  this.styleParams = styleParams

	  // Initialize
	  this.initStyles()
	  this.attributesUsed = this.getDependencyAttrnames( this.styleParams )
	}

	/**
	 * Clears out the currently generated styles.
	 */
	initStyles() {
		this.styles = {
			custom: {},
			editor: {},
			saveOnly: {},
		}
	}

	/**
	 * Grabs all the attribute names which will be used in generating styles
	 * from the styleParams. This is used for generating dependency arrays used
	 * by React hooks.
	 *
	 * @param {Array} styleParams Style parameters
	 * @return {Array} Attribute names based on the styleParams
	 */
	getDependencyAttrnames( styleParams ) {
		const deps = []
		styleParams.forEach( styleParams => {
			const {
				attrName = '',
				hasUnits = false,
				responsive = false,
				hover = false,
				dependencies = [], // If this style rerender depends on other attributes, add them here.
				styles = null,
			} = styleParams

			// This is a shorthand, you can define multiple style rules in a
			// single styleParam.
			if ( styles ) {
				Object.values( styles ).forEach( attrName => {
					deps.push( ...this.getDependencyAttrnames( [ {
						...styleParams,
						styles: null,
						attrName,
					} ] ) )
				} )
				return
			}

			const pushAttr = ( attrName, device = 'desktop', state = 'normal' ) => {
				deps.push( getAttributeName( attrName, device, state ) )
				if ( hasUnits ) {
					deps.push( getAttributeName( `${ attrName }Unit`, device, state ) )
				}

				// Add the attribute names of the other dependencies.
				dependencies.forEach( attrName => {
					deps.push( getAttributeName( attrName, device, state ) )
					if ( hasUnits ) {
						deps.push( getAttributeName( `${ attrName }Unit`, device, state ) )
					}
				} )
			}

			const hasTablet = responsive === 'all' || ( Array.isArray( responsive ) && responsive.includes( 'tablet' ) )
			const hasMobile = responsive === 'all' || ( Array.isArray( responsive ) && responsive.includes( 'mobile' ) )

			const hasHover = hover === 'all' || ( Array.isArray( hover ) && hover.includes( 'hover' ) )
			const hasParentHover = hover === 'all' || ( Array.isArray( hover ) && hover.includes( 'parent-hover' ) )

			pushAttr( attrName )
			if ( hasHover ) {
				pushAttr( attrName, 'desktop', 'hover' )
			}
			if ( hasParentHover ) {
				pushAttr( attrName, 'desktop', 'parent-hover' )
			}

			if ( hasTablet ) {
				pushAttr( attrName, 'tablet', 'normal' )
				if ( hasHover ) {
					pushAttr( attrName, 'tablet', 'hover' )
				}
				if ( hasParentHover ) {
					pushAttr( attrName, 'tablet', 'parent-hover' )
				}
			}

			if ( hasMobile ) {
				pushAttr( attrName, 'mobile', 'normal' )
				if ( hasHover ) {
					pushAttr( attrName, 'mobile', 'hover' )
				}
				if ( hasParentHover ) {
					pushAttr( attrName, 'mobile', 'parent-hover' )
				}
			}
		} )
		return deps
	}

	appendToSelector( selector, rule, value, device = 'desktop', renderIn = '', vendorPrefixes = [] ) {
		const stlyes = renderIn === '' ? this.styles
			: this.styles[ renderIn ]

		if ( device === 'desktop' || ! device ) {
			if ( typeof stlyes[ selector ] === 'undefined' ) {
				stlyes[ selector ] = {}
			}
			stlyes[ selector ][ rule ] = value
			vendorPrefixes.forEach( vendorPrefix => {
				stlyes[ selector ][ `${ vendorPrefix }${ rule }` ] = value
			} )
		} else if ( device === 'tablet' ) {
			if ( typeof stlyes.tablet === 'undefined' ) {
				stlyes.tablet = {}
			}
			if ( typeof stlyes.tablet[ selector ] === 'undefined' ) {
				stlyes.tablet[ selector ] = {}
			}
			stlyes.tablet[ selector ][ rule ] = value
			vendorPrefixes.forEach( vendorPrefix => {
				stlyes.tablet[ selector ][ `${ vendorPrefix }${ rule }` ] = value
			} )
		} else if ( device === 'mobile' ) {
			if ( typeof stlyes.mobile === 'undefined' ) {
				stlyes.mobile = {}
			}
			if ( typeof stlyes.mobile[ selector ] === 'undefined' ) {
				stlyes.mobile[ selector ] = {}
			}
			stlyes.mobile[ selector ][ rule ] = value
			vendorPrefixes.forEach( vendorPrefix => {
				stlyes.mobile[ selector ][ `${ vendorPrefix }${ rule }` ] = value
			} )
		}
	}

	generateStyles( attributes, blockState = 'normal' ) {
		this.initStyles()

		this.styleParams.forEach( styleParams => {
			if ( ! styleParams.styles ) {
				this.add( attributes, styleParams, blockState )
			} else {
				// This is a shorthand, you can define multiple style rules in a
				// single styleParam.
				Object.keys( styleParams.styles ).forEach( styleRule => {
					this.add( attributes, {
						...styleParams,
						styleRule,
						attrName: styleParams.styles[ styleRule ],
					}, blockState )
				} )
			}
		} )

		return this.styles
	}

	add( attributes, styleParams = {}, blockState = 'normal' ) {
		const {
			selector: _selector = '',
			styleRule = '',
			attrName = '',
			format = '%s',
			hasUnits = false, // False, or the default unit e.g. 'px' or '%'
			responsive = false,
			hover = false,

			// Additional options.
			selectorCallback = null, // Can be used instead of selector.
			renderIn: _renderIn = '', // editor, custom, saveOnly
			valueCallback = null,
			enabledCallback = null, // Function that if returns false, will not render this style.
			vendorPrefixes = [], // Add vendor prefixes to also generate for the styleRule, e.g. '-webkit-'
			hoverSelector: _hoverSelector = '', // If custom hover selector is provided, use that instead.
		} = styleParams

		const renderIn = _renderIn === 'save' ? 'saveOnly' // Use "save" shorthand for "saveOnly"
			: _renderIn === 'edit' ? 'editor' // Use "edit" shorthand for "editor"
				: _renderIn

		// Allow to be disabled.
		if ( enabledCallback ) {
			if ( ! enabledCallback( attributes ) ) {
				return
			}
		}

		const selector = selectorCallback ? selectorCallback( attributes ) : _selector

		const getValue = ( attrName, device, state ) => {
			const unitAttrName = getAttributeName( `${ attrName }Unit`, device, state )
			const actualAttrName = getAttributeName( attrName, device, state )

			const unit = hasUnits ? ( attributes[ unitAttrName ] || hasUnits ) : ''
			let value = attributes[ actualAttrName ]

			if ( value === '' || typeof value === 'undefined' ) {
				return undefined
			}

			if ( unit ) { // Note: this will only work for non-objects.
				value = `${ value }${ unit }`
			}
			if ( format !== '%s' && format !== '' ) {
				value = sprintf(
					format.replace( /%$/, '%%' ), // If the format ends with %, that means it's a percentage sign.
					value
				)
			}

			// Allow to be manually adjusted.
			if ( valueCallback ) {
				value = valueCallback( value, attributes, device, state )
			}

			return value
		}

		const hasTablet = responsive === 'all' || ( Array.isArray( responsive ) && responsive.includes( 'tablet' ) )
		const hasMobile = responsive === 'all' || ( Array.isArray( responsive ) && responsive.includes( 'mobile' ) )

		const hasHover = hover === 'all' || ( Array.isArray( hover ) && hover.includes( 'hover' ) )
		const hasParentHover = hover === 'all' || ( Array.isArray( hover ) && hover.includes( 'parent-hover' ) )

		let parentHoverSelector = `:where(.stk-block:hover) .%s ${ selector }`
		let hoverSelector = _hoverSelector ? _hoverSelector : `.stk-block.%s:hover ${ selector }`

		// This is for the editor, change the selector to make the styles show up right away.
		if ( blockState === 'hover' ) {
			hoverSelector = `.%s.stk--is-hovered ${ selector }`
		}
		if ( blockState === 'parent-hovered' ) {
			parentHoverSelector = `.%s.stk--is-hovered .%s-container`
		}

		this.appendToSelector( selector, styleRule, getValue( attrName, 'desktop', 'normal' ), 'desktop', renderIn, vendorPrefixes )
		if ( hasHover ) {
			this.appendToSelector( hoverSelector, styleRule, getValue( attrName, 'desktop', 'hover' ), 'desktop', renderIn, vendorPrefixes )
		}
		if ( hasParentHover ) {
			this.appendToSelector( parentHoverSelector, styleRule, getValue( attrName, 'desktop', 'parent-hover' ), 'desktop', renderIn, vendorPrefixes )
		}

		if ( hasTablet ) {
			this.appendToSelector( selector, styleRule, getValue( attrName, 'tablet', 'normal' ), 'tablet', renderIn, vendorPrefixes )
			if ( hasHover ) {
				this.appendToSelector( hoverSelector, styleRule, getValue( attrName, 'tablet', 'hover' ), 'tablet', renderIn, vendorPrefixes )
			}
			if ( hasParentHover ) {
				this.appendToSelector( parentHoverSelector, styleRule, getValue( attrName, 'tablet', 'parent-hover' ), 'tablet', renderIn, vendorPrefixes )
			}
		}

		if ( hasMobile ) {
			this.appendToSelector( selector, styleRule, getValue( attrName, 'mobile', 'normal' ), 'mobile', renderIn, vendorPrefixes )
			if ( hasHover ) {
				this.appendToSelector( hoverSelector, styleRule, getValue( attrName, 'mobile', 'hover' ), 'mobile', renderIn, vendorPrefixes )
			}
			if ( hasParentHover ) {
				this.appendToSelector( parentHoverSelector, styleRule, getValue( attrName, 'mobile', 'parent-hover' ), 'mobile', renderIn, vendorPrefixes )
			}
		}
	}

	getDependencies( attributes, deviceType = 'Desktop', blockState = 'normal' ) {
		return [
			attributes.uniqueId,
			deviceType,
			blockState,
			...this.attributesUsed.map( attrName => attributes[ attrName ] ),
		]
	}
}

export default StyleObject

/**
 * Generates styles based on styleParams. This works by creating a memoed
 * StyleObject, and only regenerating the CSS styles only when the
 * affected attributes are modified.
 *
 * This already handles the responsiveness and hover states of the style.
 *
 * @param {Object} attributes Block attributes
 * @param {Array} styleParams Style definitions for each attribute
 *
 * @return {StyleObject} A object that can be rendered by a StyleComponent
 */
export const useStyles = ( attributes, styleParams ) => {
	const deviceType = useDeviceType()
	const [ currentHoverState ] = useBlockHoverState()

	const styleObject = useMemo( () => new StyleObject( styleParams ), [] )
	return useMemo(
		() => styleObject.generateStyles( attributes, currentHoverState ),
		styleObject.getDependencies( attributes, deviceType, currentHoverState )
	)
}

/**
 * Generates styles based on styleParams. Best used in a block's save function.
 *
 * @param {Object} attributes Block attributes
 * @param {Array} styleParams Style definitions for each attribute
 *
 * @return {StyleObject} A object that can be rendered by a StyleComponent
 */
export const getStyles = ( attributes, styleParams ) => {
	return new StyleObject( styleParams ).generateStyles( attributes )
}
