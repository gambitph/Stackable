/**
 * External dependencies
 */
import {
	useAttributeEditHandlers,
	useAttributeValue,
	useBlockAttributesContext,
} from '~stackable/hooks'
import {
	getAttrNameFunction, __getValue, getShapeSVG, isElementDescendant,
} from '~stackable/util'
import { kebabCase } from 'lodash'
import classnames from 'classnames'
import { IconSearchPopover, SvgIcon } from '~stackable/components'

/**
 * Internal dependencies
 */
import { Edit } from './edit'
import { addAttributes } from './attributes'
import { addStyles } from './style'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { dispatch, select } from '@wordpress/data'
import {
	useMemo, useState, useRef, useEffect, renderToString,
} from '@wordpress/element'

const LinearGradient = ( {
	id,
} ) => {
	const kebabId = kebabCase( id )
	return (
		<svg style={ {
			height: 0,
			width: 0,
		} }>
			<defs>
				<linearGradient
					id={ id }
					x1="0"
					x2="100%"
					y1="0"
					y2="0"
				>
					<stop offset="0%" style={ {
						stopOpacity: 1,
						stopColor: `var(--${ kebabId }-color-1)`,
					} }></stop>
					<stop offset="100%" style={ {
						stopOpacity: 1,
						stopColor: `var(--${ kebabId }-color-2)`,
					} }></stop>
				</linearGradient>
			</defs>
		</svg>
	)
}

const NOOP = () => {}

const getSvgDef = ( href, viewBox = '0 0 24 24' ) => {
	return `<svg viewBox="${ viewBox }"><use href="${ href }" xlink:href="${ href }"></use></svg>`
}

const generateIconId = () => {
	return Math.floor( Math.random() * new Date().getTime() ) % 100000
}

/**
 * Extract viewBox, width, and height from SVG string without DOM manipulation
 * Only checks for the specific attributes we need (case-insensitive)
 *
 * @param {string} svgString The SVG string to parse
 * @return {Object} Object with viewBox, width, and height
 */
const extractSVGDimensions = svgString => {
	if ( ! svgString || typeof svgString !== 'string' ) {
		return {
			viewBox: null,
			width: null,
			height: null,
		}
	}

	// Find the opening <svg> tag
	const svgTagMatch = svgString.match( /<svg\s*[^>]*>/i )
	if ( ! svgTagMatch ) {
		return {
			viewBox: null,
			width: null,
			height: null,
		}
	}

	const svgTag = svgTagMatch[ 0 ]

	// Extract only the attributes we need (case-insensitive)
	// Pattern: attribute name (case-insensitive) = "value" or 'value' or value
	const getAttribute = attrName => {
		const regex = new RegExp( `${ attrName }\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i' )
		const match = svgTag.match( regex )
		if ( match ) {
			return match[ 1 ] || match[ 2 ] || match[ 3 ] || ''
		}
		return null
	}

	const viewBox = getAttribute( 'viewBox' )
	const widthStr = getAttribute( 'width' )
	const heightStr = getAttribute( 'height' )

	const width = widthStr ? parseInt( widthStr, 10 ) : null
	const height = heightStr ? parseInt( heightStr, 10 ) : null

	return {
		viewBox,
		width,
		height,
	}
}

export const Icon = props => {
	const {
		attrNameTemplate = '%s',
		hasLinearGradient = true,
		value = '',
		defaultValue = '',
		onChange = NOOP,
		openEvenIfUnselected = false,
	} = props

	const { isSelected } = useBlockEditContext()
	const [ isOpen, setIsOpen ] = useState( false )
	const popoverEl = useRef( null )

	// When the block is unselected, make sure that the popover is closed.
	useEffect( () => {
		if ( ! isSelected && isOpen && ! openEvenIfUnselected ) {
			setIsOpen( false )
		}
	}, [ isSelected, isOpen ] )

	// Assign the outside click listener.
	useEffect( () => {
		const clickOutsideListener = event => {
			if ( isOpen ) {
				// If the icon is clicked, just close the popover.
				if ( event.target.closest( '.stk--inner-svg' ) ) {
					event.stopPropagation()
				}
				if ( ! event.target.closest( '.stk--inner-svg' ) && ! isElementDescendant( popoverEl.current, event.target ) && ! event.target.closest( '.components-popover' ) ) {
					setIsOpen( false )
				}
			}
		}

		document.body.addEventListener( 'click', clickOutsideListener )
		return () => document.body.removeEventListener( 'click', clickOutsideListener )
	}, [ popoverEl.current, isOpen ] )

	// Enable editing of the icon only when the current block that implements
	// it is selected. We need to use setTimeout since the isSelected is
	// changed earlier.
	const [ debouncedIsSelected, setDebouncedIsSelected ] = useState( false )
	useEffect( () => {
		if ( ! isSelected ) {
			setDebouncedIsSelected( false )
			return
		}
		const t = setTimeout( () => {
			if ( isSelected ) {
				setDebouncedIsSelected( isSelected )
			}
		}, 1 )
		return () => clearTimeout( t )
	}, [ isSelected ] )

	const uniqueId = useBlockAttributesContext( attributes => attributes.uniqueId )

	const { updateAttributeHandler } = useAttributeEditHandlers( attrNameTemplate )

	const backgroundShape = useAttributeValue( 'backgroundShape', attrNameTemplate )
	const iconColorType = useAttributeValue( 'iconColorType', attrNameTemplate )
	const iconAttr = useAttributeValue( 'icon', attrNameTemplate )
	const icon2 = useAttributeValue( 'icon2', attrNameTemplate )
	const iconColor1 = useAttributeValue( 'iconColor1', attrNameTemplate )
	const iconColor2 = useAttributeValue( 'iconColor2', attrNameTemplate )
	const showBackgroundShape = useAttributeValue( 'showBackgroundShape', attrNameTemplate )
	const ariaLabel = useAttributeValue( 'ariaLabel', attrNameTemplate )

	const ShapeComp = useMemo( () => getShapeSVG( backgroundShape || 'blob1' ), [ backgroundShape ] )

	const _icon = value || iconAttr
	const currentIconRef = useRef( _icon )
	const processedIconRef = useRef( null )
	const lastIconValueRef = useRef( null )
	const [ icon, setIcon ] = useState( _icon )

	const addPageIconCount = ( svg, id ) => {
		dispatch( 'stackable/page-icons' ).addPageIcon( svg, id )
	}

	useEffect( () => {
		currentIconRef.current = _icon

		// Skip if we've already processed this icon
		if ( processedIconRef.current === _icon ) {
			return
		}

		// Don't use page icons for multicolor icons
		// because we target svg elements with the :nth-of-type() selector to apply the multicolor styles.
		if ( iconColorType === 'multicolor' ) {
			// Clean up if this icon was previously in the page-icons store
			if ( processedIconRef.current === _icon && _icon ) {
				dispatch( 'stackable/page-icons' ).removePageIcon( _icon )
				processedIconRef.current = null
			}
			setIcon( _icon ) // Use the original icon directly
			lastIconValueRef.current = _icon
			return
		}

		// Check if icon exists in pageIcons Map
		// The Map structure is: [SVG string (key), { id: iconId, count: number } (value)]
		if ( _icon ) {
			const iconStr = String( _icon )
			let originalSvg = null
			let iconId = null

			// Get the current state of the store
			const pageIcons = select( 'stackable/page-icons' ).getPageIcons()

			// First, check if icon already exists in the store
			if ( pageIcons.has( iconStr ) ) {
				// Icon exists, use the existing ID and increment count
				const iconData = pageIcons.get( iconStr )
				iconId = iconData?.id || iconData
				originalSvg = iconStr
				addPageIconCount( iconStr, iconId )

				// Re-check after dispatch to get the actual ID (handles race conditions)
				const updatedPageIcons = select( 'stackable/page-icons' ).getPageIcons()
				if ( updatedPageIcons.has( iconStr ) ) {
					const iconData = updatedPageIcons.get( iconStr )
					iconId = iconData?.id || iconData || iconId
				}
			} else if ( iconStr && iconStr.trim().startsWith( '<svg' ) && ! iconStr.includes( '<use' ) ) {
				// Icon doesn't exist, generate new ID and add it
				originalSvg = iconStr
				iconId = generateIconId()
				addPageIconCount( iconStr, iconId )

				// After dispatch, immediately check the store again to get the actual ID
				// This handles the race condition where another component might have added
				// the same icon with a different ID
				const updatedPageIcons = select( 'stackable/page-icons' ).getPageIcons()
				if ( updatedPageIcons.has( iconStr ) ) {
					const iconData = updatedPageIcons.get( iconStr )
					// Use the ID from the store
					iconId = iconData?.id || iconData || iconId
				}
			}

			if ( originalSvg && iconId ) {
				let viewBox = '0 0 24 24' // Default viewBox
				// Extract viewBox from the original SVG for proper dimensions
				const {
					viewBox: vb,
					width,
					height,
				} = extractSVGDimensions( originalSvg )
				if ( vb ) {
					viewBox = vb
				} else {
					// Fallback to width/height if viewBox is not available
					const finalWidth = width || 24
					const finalHeight = height || 24
					viewBox = `0 0 ${ finalWidth } ${ finalHeight }`
				}
				const newIcon = getSvgDef( `#stk-page-icons__${ iconId }`, viewBox )

				// Only update state if the icon actually changed
				if ( newIcon !== lastIconValueRef.current ) {
					setIcon( newIcon )
					lastIconValueRef.current = newIcon
				}
				processedIconRef.current = _icon
			} else if ( iconStr.includes( '<use' ) ) {
				if ( iconStr !== lastIconValueRef.current ) {
					setIcon( iconStr )
					lastIconValueRef.current = iconStr
				}
				processedIconRef.current = _icon
			} else if ( ! _icon ) {
				// Clear processed ref when icon is removed
				processedIconRef.current = null
				if ( lastIconValueRef.current !== null ) {
					setIcon( null )
					lastIconValueRef.current = null
				}
			}
		} else {
			processedIconRef.current = null
			if ( lastIconValueRef.current !== null ) {
				setIcon( null )
				lastIconValueRef.current = null
			}
		}
	}, [ _icon, iconColorType ] )

	useEffect( () => {
		return () => {
			if ( currentIconRef.current ) {
				dispatch( 'stackable/page-icons' ).removePageIcon( currentIconRef.current )
			}
		}
	}, [] )

	if ( ! icon ) {
		return null
	}

	const linearGradient = hasLinearGradient ? (
		renderToString( <LinearGradient
			id={ 'linear-gradient-' + uniqueId }
			iconColor1={ iconColor1 }
			iconColor2={ iconColor2 }
		/> )
	) : undefined

	const classNames = classnames(
		[ 'stk--svg-wrapper' ],
		{
			'stk--show-cursor': debouncedIsSelected || openEvenIfUnselected,
			'stk--has-icon2': icon2,
		}
	)

	return (
		<span // eslint-disable-line
			className={ classNames }
			onClick={ event => {
				if ( debouncedIsSelected || openEvenIfUnselected ) {
					// Only register a click to .stk--inner-svg.
					if ( event.target.closest( '.stk--inner-svg' ) && ! isOpen ) {
						setIsOpen( ! isOpen )
					}
				}
			} }

		>
			{ icon && (
				<SvgIcon
					className="stk--inner-svg"
					prependRenderString={ linearGradient }
					value={ icon }
					ariaLabel={ ariaLabel }
				/>
			) }
			{ showBackgroundShape && <ShapeComp className="stk--shape-icon" /> }
			{ isOpen && (
				<IconSearchPopover
					__hasPopover={ true }
					__deprecateUseRef={ popoverEl }
					onClose={ () => setIsOpen( false ) }
					onChange={ icon => {
						dispatch( 'stackable/page-icons' ).removePageIcon( _icon )
						if ( onChange === NOOP ) {
							updateAttributeHandler( 'icon' )( icon )
						} else {
							onChange( icon )
						}
						setIsOpen( false )
					} }
					defaultValue={ defaultValue }
				/>
			) }
			{ icon2 && (
				<SvgIcon
					className="stk--inner-svg stk--icon-2"
					prependRenderString={ linearGradient }
					value={ icon2 }
					ariaLabel={ ariaLabel }
					style={ { display: 'none' } }
				/>
			) }
		</span>
	)
}

Icon.Content = props => {
	const {
		attributes,
		attrNameTemplate,
		hasLinearGradient = true,
		children,
		value = '',
	} = props

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const getValue = __getValue( attributes, getAttrName, '' )

	const ShapeComp = getShapeSVG( getValue( 'backgroundShape' ) || 'blob1' )

	const linearGradient = hasLinearGradient ? (
		renderToString( <LinearGradient
			id={ 'linear-gradient-' + attributes.uniqueId }
			iconColor1={ getValue( 'iconColor1' ) }
			iconColor2={ getValue( 'iconColor2' ) }
		/> )
	) : undefined

	const className = classnames(
		[ 'stk--svg-wrapper' ],
		{ 'stk--has-icon2': getValue( 'icon2' ) }
	)

	const icon = value || getValue( 'icon' )
	if ( ! icon && ! getValue( 'icon2' ) ) {
		return null
	}

	return (
		<span className={ className }>
			{ icon && (
				<SvgIcon.Content
					className="stk--inner-svg"
					prependRenderString={ linearGradient }
					value={ icon }
					ariaLabel={ getValue( 'ariaLabel' ) }
				/>
			) }
			{ getValue( 'showBackgroundShape' ) && (
				<ShapeComp className="stk--shape-icon" />
			) }
			{ getValue( 'icon2' ) && ( // This is a second icon that's only outputted for reference. It's up to the parent block to decide what to do with it.
				<SvgIcon.Content
					className="stk--inner-svg stk--icon-2"
					prependRenderString={ linearGradient }
					value={ getValue( 'icon2' ) }
					ariaLabel={ getValue( 'ariaLabel' ) }
					style={ { display: 'none' } }
				/>
			) }
			{ children }
		</span>
	)
}

Icon.InspectorControls = Edit

Icon.addAttributes = addAttributes

Icon.addStyles = addStyles

