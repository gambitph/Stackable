/**
 * This replaces the old method of generating block styles.
 *
 * Generates css for the block based on the style definition provided.
 *
 * This is an optimized version of the old method of useStyles + StyleComponent.
 * Instead of using a huge object and converting that into CSS, the use of
 * objects is replaced by React Components.
 */

/**
 * Internal dependencies
 */
import {
	appendClass,
	getAttributeFunc,
	getBlockUniqueClassname,
	getDependencyAttrnamesFast,
	getMediaQuery,
	isVersionSupported,
	prependClass,
} from './util'
import { useDynamicContent } from '../dynamic-content-control'
export { BlockCssCompiler } from './block-css-compiler'
import { useBlockAttributesContext } from '~stackable/hooks'
import {
	 getAttributeName, getAttrName, getUniqueBlockClass, prependCSSClass, useQueryLoopInstanceId,
} from '~stackable/util'

/**
 * External dependencies
 */
import { pick, kebabCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { memo } from '@wordpress/element'

const BlockCss = props => {
	const {
		selector: _selector = '',
		styleRule: _styleRule = '',
		hoverStyleRule: _hoverStyleRule = '',
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
		renderIn = '', // edit or save or blank for both
		valuePreCallback = null,
		valueCallback = null,
		enabledCallback = null, // Function that if returns false, will not render this style.
		vendorPrefixes = [], // Add vendor prefixes to also generate for the styleRule, e.g. '-webkit-'
		clampCallback = null, // Function that can be used to limit the value in tablet/mobile based on the desktop value
		unitCallback = null, // Function that can override

		// breakTablet = 1024,
		// breakMobile = 768,
		// doImportant = true,

		version = '', // If given, the styles for only this version will be rendered.
		versionAdded = '', // The version of Stackable when this style was added.
		versionDeprecated = '', // The version of Stackable when this style wasn't used anymore.

		compileCssTo = null, // If rendering for saving, the object passed here is used to add the css to (instead of outputting styles).

		attributes = {}, // The attributes used for this style.

		editorMode = true, // If true, this renders css for the editor.
		clientId = '', // The block's clientId, only used if rendering for the editor.
		instanceId = '', // Used by the Query Loop block, this is the instance of the template being displayed.
		blockState = 'normal', // The block's hover state to render the styles for.
	} = props

	// const editorMode = ! compileCssTo

	// // const [ currentHoverState ] = useBlockHoverState()
	// const [ blockState ] = useBlockHoverState()
	// const { clientId } = useBlockEditContext()

	// // Extract the attributes used by the styleParams. This hook only triggers
	// // when the extracted attributes change in value.
	// const attributes = useBlockAttributesContext( attributes => {
	// 	return {
	// 		...pick( attributes, getDependencyAttrnamesFast( props ) ),
	// 		clientId,
	// 	}
	// } )

	// const instanceId = useQueryLoopInstanceId( attributes.uniqueId )

	// Check the version of when this style is applicable.
	if ( ! isVersionSupported( version, versionAdded, versionDeprecated ) ) {
		return null
	}

	const getAttribute = getAttributeFunc( attributes, attrNameTemplate )

	const attrName = attrNameTemplate ? getAttrName( attrNameTemplate, _attrName ) : _attrName

	// Only render in correct place if needed.
	if ( renderIn ) {
		if ( editorMode && renderIn === 'save' ) {
			return null
		} else if ( ! editorMode && renderIn === 'edit' ) {
			return null
		}
	}

	// Allow to be disabled.
	if ( enabledCallback ) {
		if ( ! enabledCallback( getAttribute, attributes ) ) {
			return null
		}
	}

	const getValue = ( attrName, device, state ) => {
		const unitAttrName = getAttributeName( `${ attrName }Unit`, device, state )
		const actualAttrName = getAttributeName( attrName, device, state )

		let unit = hasUnits ? ( attributes[ unitAttrName ] || hasUnits ) : ''
		let value = attributes[ actualAttrName ]

		/**
		 * Allow unspecified units to be set based on the larger used
		 * unitdesktop/tablet unit if value is empty. For example in `rem`,
		 * any mobile value that's automatically applied should also show
		 * `rem`
		 */
		if ( value === '' && ( device === 'tablet' || device === 'mobile' ) ) {
			const desktopUnit = attributes[ getAttributeName( `${ attrName }Unit`, 'desktop', state ) ]
			const tabletUnit = attributes[ getAttributeName( `${ attrName }Unit`, 'tablet', state ) ]
			if ( device === 'tablet' ) {
				unit = desktopUnit
			} else if ( device === 'mobile' ) {
				const tabletValue = attributes[ getAttributeName( attrName, 'tablet', state ) ]
				if ( tabletValue !== '' ) {
					unit = tabletUnit
				} else {
					unit = desktopUnit
				}
			}
		}

		// Allow others to override the unit.
		if ( unitCallback ) {
			unit = unitCallback( unit, device, state )
		}

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

	const hover = hoverCallback ? hoverCallback( getAttribute, attributes ) : _hover

	// Some BlockCss components do not have the responsive prop. This is default behavior of obtaining the desktop value.
	const hasDesktop = responsive === 'all' || responsive === false || ( Array.isArray( responsive ) && responsive.find( s => s.startsWith( 'desktop' ) ) )
	const hasTablet = responsive === 'all' || ( Array.isArray( responsive ) && responsive.find( s => s.startsWith( 'tablet' ) ) )
	const hasMobile = responsive === 'all' || ( Array.isArray( responsive ) && responsive.find( s => s.startsWith( 'mobile' ) ) )

	const hasHover = hover === 'all' || ( Array.isArray( hover ) && hover.includes( 'hover' ) )
	const hasParentHover = hover === 'all' || ( Array.isArray( hover ) && hover.includes( 'parent-hover' ) )
	const hasCollapsed = hover === 'all' || ( Array.isArray( hover ) && hover.includes( 'collapsed' ) )

	let valueDesktop,
		valueDesktopCollapsed,
		valueDesktopHover,
		valueDesktopParentHover,
		valueMobile,
		valueMobileCollapsed,
		valueMobileHover,
		valueMobileParentHover,
		valueTablet,
		valueTabletCollapsed,
		valueTabletHover,
		valueTabletParentHover

	if ( hasDesktop ) {
		valueDesktop = getValue( attrName, 'desktop', 'normal' )
		if ( hasHover ) {
			valueDesktopHover = getValue( attrName, 'desktop', 'hover' )
		}
		if ( hasParentHover ) {
			valueDesktopParentHover = getValue( attrName, 'desktop', 'parent-hover' )
		}
		if ( hasCollapsed ) {
			valueDesktopCollapsed = getValue( attrName, 'desktop', 'collapsed' )
		}
	}

	if ( hasTablet ) {
		valueTablet = getValue( attrName, 'tablet', 'normal' )
		if ( hasHover ) {
			valueTabletHover = getValue( attrName, 'tablet', 'hover' )
		}
		if ( hasParentHover ) {
			valueTabletParentHover = getValue( attrName, 'tablet', 'parent-hover' )
		}
		if ( hasCollapsed ) {
			valueTabletCollapsed = getValue( attrName, 'tablet', 'collapsed' )
		}
	}

	if ( hasMobile ) {
		valueMobile = getValue( attrName, 'mobile', 'normal' )
		if ( hasHover ) {
			valueMobileHover = getValue( attrName, 'mobile', 'hover' )
		}
		if ( hasParentHover ) {
			valueMobileParentHover = getValue( attrName, 'mobile', 'parent-hover' )
		}
		if ( hasCollapsed ) {
			valueMobileCollapsed = getValue( attrName, 'mobile', 'collapsed' )
		}
	}

	// Skip everything if all values are null.
	if ( typeof valueDesktop === 'undefined' &&
		typeof valueDesktopHover === 'undefined' &&
		typeof valueDesktopParentHover === 'undefined' &&
		typeof valueDesktopCollapsed === 'undefined' &&
		typeof valueTablet === 'undefined' &&
		typeof valueTabletHover === 'undefined' &&
		typeof valueTabletParentHover === 'undefined' &&
		typeof valueTabletCollapsed === 'undefined' &&
		typeof valueMobile === 'undefined' &&
		typeof valueMobileHover === 'undefined' &&
		typeof valueMobileParentHover === 'undefined' &&
		typeof valueMobileCollapsed === 'undefined' ) {
		return null
	}

	// Allow style rule to be dynamic.
	let styleRule = _styleRule
	if ( styleRuleCallback ) {
		styleRule = styleRuleCallback( getAttribute, attributes )
	}
	const hoverStyleRule = _hoverStyleRule || styleRule

	let selector = selectorCallback ? selectorCallback( getAttribute, attributes, clientId ) : _selector
	let hoverSelector = hoverSelectorCallback ? hoverSelectorCallback( getAttribute, attributes, clientId ) : _hoverSelector

	const desktopQuery = ( Array.isArray( responsive ) ? responsive.find( s => s.startsWith( 'desktop' ) ) : 'desktop' ) || 'desktop'
	const tabletQuery = ( Array.isArray( responsive ) ? responsive.find( s => s.startsWith( 'tablet' ) ) : 'tablet' ) || 'tablet'
	const mobileQuery = ( Array.isArray( responsive ) ? responsive.find( s => s.startsWith( 'mobile' ) ) : 'mobile' ) || 'mobile'

	let collapsedSelector = ''
	let parentHoverSelector = ''

	// TODO: why do we have this condition for the collapsedSelector, but they just do the same prepending??
	if ( hasCollapsed ) {
		if ( blockState === 'collapsed' ) {
			collapsedSelector = prependClass( selector, ':where(.stk-block-accordion.stk--is-open) .%s' )
		} else {
			collapsedSelector = prependClass( selector, ':where(.stk-block-accordion.stk--is-open) .%s' )
		}
	}

	if ( hasParentHover ) {
		if ( blockState === 'parent-hover' ) {
			parentHoverSelector = prependClass( selector, '.%s.stk--is-hovered' )
		} else {
			parentHoverSelector = prependClass( selector, ':where(.stk-hover-parent:hover, .stk-hover-parent.stk--is-hovered) .%s' )
		}
	}

	// Create the hoverSelector, this is done by prepending the selector
	// with a '.%s:hover' class (%s is replaced with the block's unique
	// class) However, for the editor, we sometimes target the block itself
	// using the selector `[data-block="clientId"]`, for these scenarios the
	// method will not work. Instead we just append `:hover` to the block
	// selector directly.
	if ( hasHover ) {
		const selectorHasDataBlock = ( hoverSelector || selector ).includes( '[data-block=' ) && ( hoverSelector || selector ).endsWith( ']' )
		if ( selectorHasDataBlock ) {
		// If there is a [data-block] append the :hover or .stk-is-hovered directly to it.
			if ( blockState === 'hover' ) {
			// In editor, always use the `selector` instead of the hoverSelector.
				hoverSelector = appendClass( selector, '.stk--is-hovered' )
			} else {
				hoverSelector = hoverSelector || appendClass( selector, ':hover' )
			}
		} else {
		// Prepend .%s:hover to the selector.
			if ( blockState === 'hover' ) { // eslint-disable-line no-lonely-if
			// In editor, always use the `selector` instead of the hoverSelector.
				hoverSelector = prependClass( selector, '.%s.stk--is-hovered' )
			} else {
				hoverSelector = hoverSelector || prependClass( selector, '.%s:hover' )
			}
		}
	}

	//
	let blockUniqueClassName = getBlockUniqueClassname( attributes.uniqueId, clientId )
	if ( instanceId ) {
		if ( ! blockUniqueClassName.match( /-[\d]$/g ) ) {
			blockUniqueClassName = blockUniqueClassName + `-${ instanceId }`
		}

		if ( typeof selector === 'string' ) {
		// Add instance id to classes. ( e.g. `stk-abc123` -> `stk-abc123-2`, where 2 is `instanceId`. )
			selector = selector.replace( /[^^?](.%s)([^-])/g, `$1-${ instanceId }$2` )
			hoverSelector = hoverSelector.replace( /[^^?](.%s)([^-])/g, `$1-${ instanceId }$2` )
			parentHoverSelector = parentHoverSelector.replace( /[^^?](.%s)([^-])/g, `$1-${ instanceId }$2` )
			collapsedSelector = collapsedSelector.replace( /[^^?](.%s)([^-])/g, `$1-${ instanceId }$2` )
		}
	}

	if ( ! props.editorMode ) {
		blockUniqueClassName = applyFilters( 'stackable.block-css.uniqueClass.save', blockUniqueClassName, attributes )
	} else {
		blockUniqueClassName = applyFilters( 'stackable.block-css.uniqueClass.edit', blockUniqueClassName )
	}

	// Selectors can be arrays, flatten them.
	if ( Array.isArray( selector ) ) {
		selector = selector.join( ', ' )
	}
	if ( Array.isArray( hoverSelector ) ) {
		hoverSelector = hoverSelector.join( ', ' )
	}

	selector = prependCSSClass( selector, blockUniqueClassName, blockUniqueClassName, editorMode ? '.editor-styles-wrapper' : '' )
	if ( hasHover ) {
		hoverSelector = prependCSSClass( hoverSelector, blockUniqueClassName, blockUniqueClassName, editorMode ? '.editor-styles-wrapper' : '' )
	}
	if ( hasParentHover ) {
		parentHoverSelector = prependCSSClass( parentHoverSelector, blockUniqueClassName, blockUniqueClassName, editorMode ? '.editor-styles-wrapper' : '' )
	}
	if ( hasCollapsed ) {
		collapsedSelector = prependCSSClass( collapsedSelector, blockUniqueClassName, blockUniqueClassName, editorMode ? '.editor-styles-wrapper' : '' )
	}

	let css = ''

	// If rendering for the ditor, output the css, if saving, compile css to an object.
	const createCssFunc = editorMode ? createCssEdit : addCssToCssSaveObject

	css += createCssFunc( selector, styleRule, valueDesktop, desktopQuery, vendorPrefixes, compileCssTo )
	if ( hasHover ) {
		css += createCssFunc( hoverSelector, hoverStyleRule, valueDesktopHover, desktopQuery, vendorPrefixes, compileCssTo )
	}
	if ( hasParentHover ) {
		css += createCssFunc( parentHoverSelector, hoverStyleRule, valueDesktopParentHover, desktopQuery, vendorPrefixes, compileCssTo )
	}
	if ( hasCollapsed ) {
		css += createCssFunc( collapsedSelector, styleRule, valueDesktopCollapsed, desktopQuery, vendorPrefixes, compileCssTo )
	}

	if ( hasTablet ) {
		css += createCssFunc( selector, styleRule, valueTablet, tabletQuery, vendorPrefixes, compileCssTo )
		if ( hasHover ) {
			css += createCssFunc( hoverSelector, hoverStyleRule, valueTabletHover, tabletQuery, vendorPrefixes, compileCssTo )
		}
		if ( hasParentHover ) {
			css += createCssFunc( parentHoverSelector, hoverStyleRule, valueTabletParentHover, tabletQuery, vendorPrefixes, compileCssTo )
		}
		if ( hasCollapsed ) {
			css += createCssFunc( collapsedSelector, styleRule, valueTabletCollapsed, desktopQuery, vendorPrefixes, compileCssTo )
		}
	}

	if ( hasMobile ) {
		css += createCssFunc( selector, styleRule, valueMobile, mobileQuery, vendorPrefixes, compileCssTo )
		if ( hasHover ) {
			css += createCssFunc( hoverSelector, hoverStyleRule, valueMobileHover, mobileQuery, vendorPrefixes, compileCssTo )
		}
		if ( hasParentHover ) {
			css += createCssFunc( parentHoverSelector, hoverStyleRule, valueMobileParentHover, mobileQuery, vendorPrefixes, compileCssTo )
		}
		if ( hasCollapsed ) {
			css += createCssFunc( collapsedSelector, styleRule, valueMobileCollapsed, desktopQuery, vendorPrefixes, compileCssTo )
		}
	}

	// When saving, allow others to change the output css. We do this here for
	// the save function, the edit does the filter in the BlockCssEdit
	// component.
	if ( ! props.editorMode ) {
		// Note that the original css value is always empty, see addCssToCssSaveObject.
		css = applyFilters( 'stackable.block-styles.save', css, blockUniqueClassName, attributes )
	}

	return css || null
}

// This is used for rendering styles for the editor.
const BlockCssEdit = memo( props => {
	const {
		clientId,
	} = props

	// Extract the attributes used by the styleParams. This hook only triggers
	// when the extracted attributes change in value.
	const attributes = useBlockAttributesContext( attributes => {
		return {
			...pick( attributes, getDependencyAttrnamesFast( props ) ),
			clientId,
		}
	} )

	const instanceId = useQueryLoopInstanceId( attributes.uniqueId )

	// Call as a function and not as createElement.
	const css = BlockCss( {
		...props,
		clientId,
		attributes,
		instanceId,
	} )

	let output = useDynamicContent( css )
	output = applyFilters( 'stackable.block-styles.edit', output, getUniqueBlockClass( attributes.uniqueId ) )

	return css ? <style>{ output }</style> : null
} )

// Unify in a single component so it's easier to write block styles.
const _BlockCss = props => {
	if ( props.styles ) {
		console.error( 'BlockCss `styles` prop is deprecated, use individual BlockCss components instead.' ) // eslint-disable-line no-console
	}

	// If no compileCssTo prop is provided, then we just print the styles directly.
	if ( ! props.compileCssTo ) {
		return <BlockCssEdit { ...props } />
	}
	// Else, it means we need to compile all the css into the object passed to the compileCssTo prop.
	// Call as a function so we just return the string quickly.
	return BlockCss( {
		...props,
		editorMode: false,
	} )
}

export default _BlockCss

/**
 * Generates a CSS string based on the inputs.
 *
 * @param {string} selector Selector
 * @param {string} rule Snake cased css rule, supports custom css properties
 * @param {string} value The value of the style
 * @param {string} device desktop, desktopOnly, desktopTablet, etc the media query where this rule should apply
 * @param {Array} vendorPrefixes List of vendor prefixes e.g. '--webkit-`
 *
 * @return {string} The generated css style
 */
function createCssEdit( selector, rule, value, device = 'desktop', vendorPrefixes = [] ) {
	if ( typeof value === 'undefined' ) {
		return ''
	}

	// KebabCase the style rule, but support custom CSS properties (double dashes) and vendor prefixes (one dash).
	const cleanedRuleName = rule.replace( /^(--?)?(.*?$)/, ( matches, dashes, rule ) => `${ dashes || '' }${ kebabCase( rule ) }` )
	let css = `${ cleanedRuleName }: ${ value } !important`
	if ( vendorPrefixes.length ) {
		vendorPrefixes.forEach( vendorPrefx => {
			css += `;${ vendorPrefx }${ cleanedRuleName }: ${ value } !important`
		} )
	}
	css = `\n${ selector } {\n\t${ css }\n}`

	// The Block Editor has these fixed breakpoints.
	const tabletBreakpoint = 781
	const mobileBreakpoint = 361

	const mediaQuery = getMediaQuery( device, tabletBreakpoint, mobileBreakpoint )
	if ( mediaQuery ) {
		css = `\n${ mediaQuery } {${ css }\n}`
	}

	return css
}

/**
 * Generates a CSS string based on the inputs. Similar to createCss, but instead
 * of generating a string, it populates the provided CssSaveCompiler object.
 *
 * @param {string} selector Selector
 * @param {string} rule Snake cased css rule, supports custom css properties
 * @param {string} value The value of the style
 * @param {string} device desktop, desktopOnly, desktopTablet, etc the media
 * query where this rule should apply
 * @param {Array} vendorPrefixes List of vendor prefixes e.g. '--webkit-`
 * @param {CssSaveCompiler} compileToObject The CssSaveCompiler object where the
 * css will be added to
 *
 * @return {string} Always returns an empty string.
 */
function addCssToCssSaveObject( selector, rule, value, device = 'desktop', vendorPrefixes = [], compileToObject = {} ) {
	 if ( typeof value === 'undefined' ) {
		 return ''
	 }

	 // KebabCase the style rule, but support custom CSS properties (double dashes) and vendor prefixes (one dash).
	 const cleanedRuleName = rule.replace( /^(--?)?(.*?$)/, ( matches, dashes, rule ) => `${ dashes || '' }${ kebabCase( rule ) }` )

	 compileToObject.addStyle( selector, cleanedRuleName, `${ value } !important`, device )
	 if ( vendorPrefixes.length ) {
		 vendorPrefixes.forEach( vendorPrefx => {
			 compileToObject.addStyle( selector, `${ vendorPrefx }${ cleanedRuleName }`, `${ value } !important`, device )
		 } )
	 }

	 return ''
}
