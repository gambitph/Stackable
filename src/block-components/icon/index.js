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
import { Style } from './style'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import {
	useMemo, Fragment, useState, useRef, useEffect,
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

export const Icon = props => {
	const {
		attrNameTemplate = '%s',
		hasLinearGradient = true,
	} = props

	const { isSelected } = useBlockEditContext()
	const [ isOpen, setIsOpen ] = useState( false )
	const popoverEl = useRef( null )

	// When the block is unselected, make sure that the popover is closed.
	useEffect( () => {
		if ( ! isSelected && isOpen ) {
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

	const attributes = useBlockAttributesContext()

	const {
		getAttribute,
		updateAttributeHandler,
	} = useAttributeEditHandlers( attrNameTemplate )

	const ShapeComp = useMemo( () => getShapeSVG( getAttribute( 'backgroundShape' ) || 'blob1' ), [ getAttribute( 'backgroundShape' ) ] )

	if ( ! getAttribute( 'icon' ) ) {
		return null
	}

	const linearGradient = hasLinearGradient ? (
		<LinearGradient
			id={ 'linear-gradient-' + attributes.uniqueId }
			iconColor1={ getAttribute( 'iconColor1' ) }
			iconColor2={ getAttribute( 'iconColor2' ) }
		/>
	) : <Fragment />

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
				if ( debouncedIsSelected ) {
					// Only register a click to .stk--inner-svg.
					if ( event.target.closest( '.stk--inner-svg' ) && ! isOpen ) {
						setIsOpen( ! isOpen )
					}
				}
			} }

		>
			{ getAttribute( 'icon' ) && (
				<SvgIcon
					className="stk--inner-svg"
					prependRender={ linearGradient }
					value={ getAttribute( 'icon' ) }
					ariaLabel={ getAttribute( 'ariaLabel' ) }
				/>
			) }
			{ getAttribute( 'showBackgroundShape' ) && <ShapeComp className="stk--shape-icon" /> }
			{ isOpen && (
				<IconSearchPopover
					useRef={ popoverEl }
					onChange={ icon => {
						updateAttributeHandler( 'icon' )( icon )
						setIsOpen( false )
					} }
				/>
			) }
			{ getAttribute( 'icon2' ) && (
				<SvgIcon
					className="stk--inner-svg stk--icon-2"
					prependRender={ linearGradient }
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
	} = props

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const getValue = __getValue( attributes, getAttrName, '' )

	const ShapeComp = getShapeSVG( getValue( 'backgroundShape' ) || 'blob1' )

	const linearGradient = hasLinearGradient ? (
		<LinearGradient
			id={ 'linear-gradient-' + attributes.uniqueId }
			iconColor1={ getValue( 'iconColor1' ) }
			iconColor2={ getValue( 'iconColor2' ) }
		/>
	) : <Fragment />

	const className = classnames(
		[ 'stk--svg-wrapper' ],
		{ 'stk--has-icon2': getValue( 'icon2' ) }
	)

	if ( ! getValue( 'icon' ) && ! getValue( 'icon2' ) ) {
		return null
	}

	return (
		<span className={ className }>
			{ getValue( 'icon' ) && (
				<SvgIcon.Content
					className="stk--inner-svg"
					prependRender={ linearGradient }
					value={ getValue( 'icon' ) }
					ariaLabel={ getValue( 'ariaLabel' ) }
				/>
			) }
			{ getValue( 'showBackgroundShape' ) && (
				<ShapeComp className="stk--shape-icon" />
			) }
			{ getValue( 'icon2' ) && ( // This is a second icon that's only outputted for reference. It's up to the parent block to decide what to do with it.
				<SvgIcon.Content
					className="stk--inner-svg stk--icon-2"
					prependRender={ linearGradient }
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

Icon.Style = Style

