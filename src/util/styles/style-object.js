/**
 * Internal dependencies
 */
import { getAttrName } from '../attributes'

/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element'
import { sprintf } from '@wordpress/i18n'
import { useBlockHoverState, useDeviceType } from '~stackable/hooks'
import { getAttributeName } from '~stackable/util'
import { compact } from 'lodash'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'

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
				attrName: _attrName = '',
				hasUnits = false,
				responsive = false,
				hover: _hover = false,
				hoverCallback = null,
				dependencies = [], // If this style rerender depends on other attributes, add them here.
				styles = null,
				attrNameTemplate = '',
			} = styleParams

			const attrName = attrNameTemplate ? getAttrName( attrNameTemplate, _attrName ) : _attrName
			const hover = hoverCallback ? 'all' : _hover

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
				dependencies.forEach( _attrName => {
					const attrName = attrNameTemplate ? getAttrName( attrNameTemplate, _attrName ) : _attrName

					deps.push( getAttributeName( attrName, 'desktop', 'normal' ) ) // Always depend on the normal state.
					deps.push( getAttributeName( attrName, device, state ) )
					if ( hasUnits ) {
						deps.push( getAttributeName( `${ attrName }Unit`, 'desktop', 'normal' ) ) // Always depend on the normal state.
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
		const styles = renderIn === '' ? this.styles
			: this.styles[ renderIn ]

		if ( device === 'desktop' || ! device ) {
			if ( typeof styles[ selector ] === 'undefined' ) {
				styles[ selector ] = {}
			}
			styles[ selector ][ rule ] = value
			vendorPrefixes.forEach( vendorPrefix => {
				styles[ selector ][ `${ vendorPrefix }${ rule }` ] = value
			} )
		} else if ( device === 'tablet' ) {
			if ( typeof styles.tablet === 'undefined' ) {
				styles.tablet = {}
			}
			if ( typeof styles.tablet[ selector ] === 'undefined' ) {
				styles.tablet[ selector ] = {}
			}
			styles.tablet[ selector ][ rule ] = value
			vendorPrefixes.forEach( vendorPrefix => {
				styles.tablet[ selector ][ `${ vendorPrefix }${ rule }` ] = value
			} )
		} else if ( device === 'mobile' ) {
			if ( typeof styles.mobile === 'undefined' ) {
				styles.mobile = {}
			}
			if ( typeof styles.mobile[ selector ] === 'undefined' ) {
				styles.mobile[ selector ] = {}
			}
			styles.mobile[ selector ][ rule ] = value
			vendorPrefixes.forEach( vendorPrefix => {
				styles.mobile[ selector ][ `${ vendorPrefix }${ rule }` ] = value
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
			attrName: _attrName = '',
			format = '%s',
			hasUnits = false, // False, or the default unit e.g. 'px' or '%'
			responsive = false,
			hover: _hover = false,

			// Additional options.
			attrNameTemplate = '',
			selectorCallback = null, // Can be used instead of selector.
			hoverSelector: _hoverSelector = '', // You can specify your own hover selector (for saving purposes only)
			hoverSelectorCallback = null,
			hoverCallback = null,
			renderIn: _renderIn = '', // editor, custom, saveOnly
			valuePreCallback = null,
			valueCallback = null,
			enabledCallback = null, // Function that if returns false, will not render this style.
			vendorPrefixes = [], // Add vendor prefixes to also generate for the styleRule, e.g. '-webkit-'
			clampCallback = null, // Function that can be used to limit the value in tablet/mobile based on the desktop value
		} = styleParams

		const getAttribute = ( _attrName, device = 'desktop', state = 'normal', getInherited = false ) => {
			const attrName = attrNameTemplate ? getAttrName( attrNameTemplate, _attrName ) : _attrName
			let value = attributes[ getAttributeName( attrName, device, state ) ]

			if ( ! getInherited ) {
				return value
			}

			// Try and get an inherited value (e.g. if no tablet is supplied, get the desktop value)
			const deviceSteps = device === 'mobile' ? [ 'mobile', 'tablet', 'desktop' ]
				: device === 'tablet' ? [ 'tablet', 'desktop' ]
					: [ 'desktop' ]

			deviceSteps.some( device => {
				const _value = attributes[ getAttributeName( attrName, device ) ]
				if ( _value !== '' && typeof _value !== 'undefined' ) {
					value = _value
					return true
				}
				return false
			} )

			return value
		}

		const attrName = attrNameTemplate ? getAttrName( attrNameTemplate, _attrName ) : _attrName

		const renderIn = _renderIn.replace( 'save', 'saveOnly' ) // Use "save" shorthand for "saveOnly"
			.replace( 'edit', 'editor' ) // Use "edit" shorthand for "editor"

		// Allow to be disabled.
		if ( enabledCallback ) {
			if ( ! enabledCallback( getAttribute, attributes ) ) {
				return
			}
		}

		let selector = selectorCallback ? selectorCallback( getAttribute, attributes ) : _selector
		let hoverSelector = hoverSelectorCallback ? hoverSelectorCallback( getAttribute, attributes ) : _hoverSelector
		const hover = hoverCallback ? hoverCallback( getAttribute, attributes ) : _hover

		const getValue = ( attrName, device, state ) => {
			const unitAttrName = getAttributeName( `${ attrName }Unit`, device, state )
			const actualAttrName = getAttributeName( attrName, device, state )

			const unit = hasUnits ? ( attributes[ unitAttrName ] || hasUnits ) : ''
			let value = attributes[ actualAttrName ]

			// Allow unspecified tablet & mobile values to be clamped based on the desktop value.
			if ( clampCallback && responsive ) {
				const desktopValue = attributes[ getAttributeName( attrName, 'desktop', state ) ]
				const tabletValue = attributes[ getAttributeName( attrName, 'tablet', state ) ]
				if ( value === '' || typeof value === 'undefined' ) {
					if ( device === 'tablet' ) {
						value = clampCallback( desktopValue, getAttribute, device, state, unit, attributes )
					} else if ( device === 'mobile' ) {
						value = clampCallback( tabletValue !== '' ? tabletValue : desktopValue, getAttribute, device, state, unit, attributes )
					}
				}
			}

			// Allow value to be overridden, helpful for when the value is blank.
			if ( valuePreCallback ) {
				value = valuePreCallback( value, getAttribute, device, state, attributes )
			}

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
				value = valueCallback( value, getAttribute, device, state, attributes )
			}

			return value
		}

		const hasTablet = responsive === 'all' || ( Array.isArray( responsive ) && responsive.includes( 'tablet' ) )
		const hasMobile = responsive === 'all' || ( Array.isArray( responsive ) && responsive.includes( 'mobile' ) )

		const hasHover = hover === 'all' || ( Array.isArray( hover ) && hover.includes( 'hover' ) )
		const hasParentHover = hover === 'all' || ( Array.isArray( hover ) && hover.includes( 'parent-hover' ) )

		const prependClass = ( _selector, prependString, prependStringIfEditor, blockStateCompare ) => {
			const getSelector = s => {
				const prependArray = []
				prependArray.push( blockState === blockStateCompare ? prependStringIfEditor : prependString )
				prependArray.push( s )
				return compact( prependArray ).join( ' ' )
			}

			if ( Array.isArray( _selector ) ) {
				return _selector.map( getSelector ).join( ', ' )
			}

			return getSelector( _selector )
		}

		const parentHoverSelector = prependClass( selector, ':where(.stk-hover-parent:hover) .%s', '.%s.stk--is-hovered', 'parent-hovered' )
		hoverSelector = hoverSelector
			// In editor, always use the `selector` instead of the hoverSelector.
			? prependClass( blockState === 'hover' ? selector : hoverSelector || selector, null, '.%s.stk--is-hovered', 'hover' )
			: prependClass( selector, '.stk-block.%s:hover', '.%s.stk--is-hovered', 'hover' )
		selector = prependClass( selector )

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
 * @param {Object} _attributes Block attributes
 * @param {Array} styleParams Style definitions for each attribute
 * @param {Array} deps if defined, re-create the StyleObject on deps update
 *
 * @return {StyleObject} A object that can be rendered by a StyleComponent
 */
export const useStyles = ( _attributes, styleParams, deps = [] ) => {
	const deviceType = useDeviceType()
	const [ currentHoverState ] = useBlockHoverState()
	const { clientId } = useBlockEditContext()

	// Add the clientId, this can be used by styles for the editor.
	const attributes = {
		..._attributes,
		clientId,
	}

	const styleObject = useMemo( () => new StyleObject( styleParams ), [ ...deps ] )
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
