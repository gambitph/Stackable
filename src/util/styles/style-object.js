/**
 * Internal dependencies
 */
import { getAttrName } from '../attributes'

/**
 * External dependencies
 */
import { useBlockHoverState, useDeviceType } from '~stackable/hooks'
import { getAttributeName } from '~stackable/util'
import { compact } from 'lodash'
import { QueryLoopContext } from '~stackable/higher-order/with-query-loop-context'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import {
	useMemo, useContext, useState, useEffect,
} from '@wordpress/element'
import { sprintf } from '@wordpress/i18n'
import { useSelect } from '@wordpress/data'

/**
 * Style object, this manages the generation of styles.
 */
class StyleObject {
	constructor( styleParams = [] ) {
	  this.styleParams = styleParams

	  // Initialize
	  this.initStyles()
	  this.attributesUsed = this.getDependencyAttrnames( this.styleParams )
		this.queryLoopInstance = null
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

			const hasTablet = responsive === 'all' || ( Array.isArray( responsive ) && responsive.find( s => s.startsWith( 'tablet' ) ) )
			const hasMobile = responsive === 'all' || ( Array.isArray( responsive ) && responsive.find( s => s.startsWith( 'mobile' ) ) )

			const hasHover = hover === 'all' || ( Array.isArray( hover ) && hover.includes( 'hover' ) )
			const hasParentHover = hover === 'all' || ( Array.isArray( hover ) && hover.includes( 'parent-hover' ) )
			const hasCollapsed = hover === 'all' || ( Array.isArray( hover ) && hover.includes( 'collapsed' ) )

			pushAttr( attrName )
			if ( hasHover ) {
				pushAttr( attrName, 'desktop', 'hover' )
			}
			if ( hasParentHover ) {
				pushAttr( attrName, 'desktop', 'parent-hover' )
			}
			if ( hasCollapsed ) {
				pushAttr( attrName, 'desktop', 'collapsed' )
			}

			if ( hasTablet ) {
				pushAttr( attrName, 'tablet', 'normal' )
				if ( hasHover ) {
					pushAttr( attrName, 'tablet', 'hover' )
				}
				if ( hasParentHover ) {
					pushAttr( attrName, 'tablet', 'parent-hover' )
				}
				if ( hasCollapsed ) {
					pushAttr( attrName, 'tablet', 'collapsed' )
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
				if ( hasCollapsed ) {
					pushAttr( attrName, 'mobile', 'collapsed' )
				}
			}
		} )
		return deps
	}

	setQueryLoopInstance( instanceNumber ) {
		this.queryLoopInstance = instanceNumber
	}

	getQueryLoopInstance() {
		return this.queryLoopInstance
	}

	appendToSelector( selector, rule, value, _device = 'desktop', renderIn = '', vendorPrefixes = [] ) {
		// Add instance id to classes. ( e.g. `stk-abc123` -> `stk-abc123-2`, where 2 is `this.queryLoopInstance`. )
		if ( this.queryLoopInstance ) {
			selector = selector.replace( /[^^?](.%s)([^-])/g, `$1-${ this.queryLoopInstance }$2` )
		}

		// Device name can be `desktopTablet` or `tabletOnly`, for the editor, extract the specific device name.
		const device = renderIn !== 'edit' ? _device : _device.match( /^(desktop|tablet|mobile)/g )

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
		} else {
			if ( typeof styles[ device ] === 'undefined' ) {
				styles[ device ] = {}
			}
			if ( typeof styles[ device ][ selector ] === 'undefined' ) {
				styles[ device ][ selector ] = {}
			}
			styles[ device ][ selector ][ rule ] = value
			vendorPrefixes.forEach( vendorPrefix => {
				styles[ device ][ selector ][ `${ vendorPrefix }${ rule }` ] = value
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
			styleRule: _styleRule = '',
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
			styleRuleCallback = null, // Allow style rules to be dynamically generated.
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

		let styleRule = _styleRule
		// Allow style rule to be dynamic.
		if ( styleRuleCallback ) {
			styleRule = styleRuleCallback( getAttribute, attributes )
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
				// If the value is `auto`, don't add units.
				value = value === 'auto' ? value : `${ value }${ unit }`
			}
			if ( format !== '%s' && format !== '' ) {
				value = sprintf(
					format.replace( /%([sd])%/, '%$1%%' ), // If the format ends with %, that means it's a percentage sign.
					value
				)
			}

			// Allow to be manually adjusted.
			if ( valueCallback ) {
				value = valueCallback( value, getAttribute, device, state, attributes )
			}

			return value
		}

		const hasTablet = responsive === 'all' || ( Array.isArray( responsive ) && responsive.find( s => s.startsWith( 'tablet' ) ) )
		const hasMobile = responsive === 'all' || ( Array.isArray( responsive ) && responsive.find( s => s.startsWith( 'mobile' ) ) )

		const desktopQuery = ( Array.isArray( responsive ) ? responsive.find( s => s.startsWith( 'desktop' ) ) : 'desktop' ) || 'desktop'
		const tabletQuery = ( Array.isArray( responsive ) ? responsive.find( s => s.startsWith( 'tablet' ) ) : 'tablet' ) || 'tablet'
		const mobileQuery = ( Array.isArray( responsive ) ? responsive.find( s => s.startsWith( 'mobile' ) ) : 'mobile' ) || 'mobile'

		const hasHover = hover === 'all' || ( Array.isArray( hover ) && hover.includes( 'hover' ) )
		const hasParentHover = hover === 'all' || ( Array.isArray( hover ) && hover.includes( 'parent-hover' ) )
		const hasCollapsed = hover === 'all' || ( Array.isArray( hover ) && hover.includes( 'collapsed' ) )

		const prependClass = ( _selector, prependString, prependStringIfEditor, blockStateCompare ) => {
			const getSelector = s => {
				const prependArray = []
				prependArray.push( blockState === blockStateCompare ? prependStringIfEditor : prependString )
				prependArray.push( s )
				// Pseudoselectors should not be delimited by spaces.
				return compact( prependArray ).join( s.startsWith( ':' ) ? '' : ' ' )
			}

			if ( Array.isArray( _selector ) ) {
				return _selector.map( getSelector ).join( ', ' )
			}

			return getSelector( _selector )
		}

		const collapsedSelector = prependClass( selector, ':where(.stk-block-accordion.stk--is-open) .%s, .%s.stk--is-open', ':where(.stk-block-accordion.stk--is-open) .%s, .%s.stk--is-open', 'collapsed' )
		const parentHoverSelector = prependClass( selector, ':where(.stk-hover-parent:hover, .stk-hover-parent.stk--is-hovered) .%s', '.%s.stk--is-hovered', 'parent-hovered' )
		hoverSelector = hoverSelector
			// In editor, always use the `selector` instead of the hoverSelector.
			? prependClass( blockState === 'hover' ? selector : hoverSelector || selector, null, '.%s.stk--is-hovered', 'hover' )
			: prependClass( selector, '.%s:hover', '.%s.stk--is-hovered', 'hover' )
		selector = prependClass( selector )

		this.appendToSelector( selector, styleRule, getValue( attrName, 'desktop', 'normal' ), desktopQuery, renderIn, vendorPrefixes )
		if ( hasHover ) {
			this.appendToSelector( hoverSelector, styleRule, getValue( attrName, 'desktop', 'hover' ), desktopQuery, renderIn, vendorPrefixes )
		}
		if ( hasParentHover ) {
			this.appendToSelector( parentHoverSelector, styleRule, getValue( attrName, 'desktop', 'parent-hover' ), desktopQuery, renderIn, vendorPrefixes )
		}
		if ( hasCollapsed ) {
			this.appendToSelector( collapsedSelector, styleRule, getValue( attrName, 'desktop', 'collapsed' ), desktopQuery, renderIn, vendorPrefixes )
		}

		if ( hasTablet ) {
			this.appendToSelector( selector, styleRule, getValue( attrName, 'tablet', 'normal' ), tabletQuery, renderIn, vendorPrefixes )
			if ( hasHover ) {
				this.appendToSelector( hoverSelector, styleRule, getValue( attrName, 'tablet', 'hover' ), tabletQuery, renderIn, vendorPrefixes )
			}
			if ( hasParentHover ) {
				this.appendToSelector( parentHoverSelector, styleRule, getValue( attrName, 'tablet', 'parent-hover' ), tabletQuery, renderIn, vendorPrefixes )
			}
			if ( hasCollapsed ) {
				this.appendToSelector( collapsedSelector, styleRule, getValue( attrName, 'tablet', 'collapsed' ), desktopQuery, renderIn, vendorPrefixes )
			}
		}

		if ( hasMobile ) {
			this.appendToSelector( selector, styleRule, getValue( attrName, 'mobile', 'normal' ), mobileQuery, renderIn, vendorPrefixes )
			if ( hasHover ) {
				this.appendToSelector( hoverSelector, styleRule, getValue( attrName, 'mobile', 'hover' ), mobileQuery, renderIn, vendorPrefixes )
			}
			if ( hasParentHover ) {
				this.appendToSelector( parentHoverSelector, styleRule, getValue( attrName, 'mobile', 'parent-hover' ), mobileQuery, renderIn, vendorPrefixes )
			}
			if ( hasCollapsed ) {
				this.appendToSelector( collapsedSelector, styleRule, getValue( attrName, 'mobile', 'collapsed' ), desktopQuery, renderIn, vendorPrefixes )
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

export const QUERY_LOOP_UNIQUEID_INSTANCES = {}

/**
 * Function which determines whether the block
 * is inside a query loop > post template block
 * and is a preview of the original inner block
 * (part of 2nd - last inner blocks).
 *
 * @param {Object} postContext
 * @param {string} currentPostId
 *
 * @return {boolean} true or false
 */
const isBlockAQueryLoopPreview = ( postContext, currentPostId ) => {
	// Compare if the consumed context's postId is not equal to the current post id.
	return postContext?.postId && currentPostId && postContext?.postId !== currentPostId
}

export const useQueryLoopInstanceId = uniqueId => {
	const postContext = useContext( QueryLoopContext )
	const currentPostId = useSelect( select => select( 'core/editor' )?.getCurrentPostId() )
	const [ instanceId, setInstanceId ] = useState( 0 )

	useEffect( () => {
		if ( isBlockAQueryLoopPreview( postContext, currentPostId ) ) {
			if ( uniqueId ) {
				const newInstanceIds = ( QUERY_LOOP_UNIQUEID_INSTANCES[ uniqueId ] || [] )
				if ( ! newInstanceIds.includes( postContext?.postId ) ) {
					newInstanceIds.push( postContext?.postId )
				}

				QUERY_LOOP_UNIQUEID_INSTANCES[ uniqueId ] = newInstanceIds
				setInstanceId( newInstanceIds.findIndex( id => id === postContext?.postId ) + 1 )
			}
		}
	}, [ postContext?.id, currentPostId, uniqueId ] )

	return instanceId
}

/**
 * Generates styles based on styleParams. This works by creating a memoed
 * StyleObject, and only regenerating the CSS styles only when the
 * affected attributes are modified.
 *
 * This already handles the responsiveness and hover states of the style.
 *
 * @param {Object} _attributes Block attributes
 * @param {Array} styleParams Style definitions for each attribute
 *
 * @return {StyleObject} A object that can be rendered by a StyleComponent
 */
export const useStyles = ( _attributes, styleParams ) => {
	const deviceType = useDeviceType()
	const [ currentHoverState ] = useBlockHoverState()
	const { clientId } = useBlockEditContext()

	// Add the clientId, this can be used by styles for the editor.
	const attributes = {
		..._attributes,
		clientId,
	}

	const instanceId = useQueryLoopInstanceId( attributes.uniqueId )

	const styleObject = useMemo( () => {
		const styleObjectInstance = new StyleObject( styleParams )
		// If the block is inside a query loop, make sure that the uniqueIds are not the same.
		if ( ! styleObjectInstance.getQueryLoopInstance() ) {
			styleObjectInstance.setQueryLoopInstance( instanceId )
		}

		return styleObjectInstance
	}, [ styleParams.length, instanceId ] )

	return useMemo(
		() => {
			return styleObject.generateStyles( attributes, currentHoverState )
		},
		[
			...styleObject.getDependencies( attributes, deviceType, currentHoverState ),
			styleObject,
		]
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
