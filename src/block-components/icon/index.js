/**
 * External dependencies
 */
import { useAttributeEditHandlers, useBlockAttributesContext } from '~stackable/hooks'
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

	const {
		getAttribute,
		updateAttributeHandler,
	} = useAttributeEditHandlers( attrNameTemplate )

	const ShapeComp = useMemo( () => getShapeSVG( getAttribute( 'backgroundShape' ) || 'blob1' ), [ getAttribute( 'backgroundShape' ) ] )

	const icon = value || getAttribute( 'icon' )
	if ( ! icon ) {
		return null
	}

	const linearGradient = hasLinearGradient ? (
		renderToString( <LinearGradient
			id={ 'linear-gradient-' + uniqueId }
			iconColor1={ getAttribute( 'iconColor1' ) }
			iconColor2={ getAttribute( 'iconColor2' ) }
		/> )
	) : undefined

	const classNames = classnames(
		[ 'stk--svg-wrapper' ],
		{
			'stk--show-cursor': debouncedIsSelected,
			'stk--has-icon2': getAttribute( 'icon2' ),
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
					ariaLabel={ getAttribute( 'ariaLabel' ) }
				/>
			) }
			{ getAttribute( 'showBackgroundShape' ) && <ShapeComp className="stk--shape-icon" /> }
			{ isOpen && (
				<IconSearchPopover
					__hasPopover={ true }
					__deprecateUseRef={ popoverEl }
					onClose={ () => setIsOpen( false ) }
					onChange={ icon => {
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
			{ getAttribute( 'icon2' ) && (
				<SvgIcon
					className="stk--inner-svg stk--icon-2"
					prependRenderString={ linearGradient }
					value={ getAttribute( 'icon2' ) }
					ariaLabel={ getAttribute( 'ariaLabel' ) }
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

