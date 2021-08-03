/**
 * External dependencies
 */
import { useAttributeEditHandlers, useBlockAttributes } from '~stackable/hooks'
import {
	getAttrNameFunction, __getValue, getShapeSVG,
} from '~stackable/util'
import { kebabCase } from 'lodash'

/**
 * Internal dependencies
 */
import { Edit } from './edit'
import { addAttributes } from './attributes'
import { Style } from './style'
import { extractSvg } from './util'
import FontAwesomeIcon from './font-awesome-icon'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import {
	useMemo, Fragment, useState, useRef, useEffect, useCallback,
} from '@wordpress/element'
import { IconSearchPopover } from '~stackable/components'

const SVGIcon = props => {
	const {
		...propsToPass
	} = props

	propsToPass.value = useMemo( () => props.value === 'string' ? extractSvg( props.value ) : props.value, [ props.value ] )

	return <FontAwesomeIcon { ...propsToPass } />
}

SVGIcon.Content = props => {
	const {
		...propsToPass
	} = props

	propsToPass.value = props.value === 'string' ? extractSvg( props.value ) : props.value

	return <FontAwesomeIcon.Content { ...propsToPass } />
}

const LinearGradient = ( {
	id: _id,
} ) => {
	const id = kebabCase( _id )
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
						stopColor: `var(--${ id }-color-1)`,
					} }></stop>
					<stop offset="100%" style={ {
						stopOpacity: 1,
						stopColor: `var(--${ id }-color-2)`,
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

	const [ isOpen, setIsOpen ] = useState( false )
	const popoverEl = useRef( null )

	const clickOutsideListener = useCallback( event => {
		if ( isOpen ) {
			if ( ! event.target.closest( popoverEl.current ) && ! event.target.closest( '.components-popover' ) ) {
				setIsOpen( false )
			}
		}
	} )

	// Assign the outside click listener.
	useEffect( () => {
		document.body.addEventListener( 'click', clickOutsideListener )
		return () => document.body.removeEventListener( 'click', clickOutsideListener )
	}, [ clickOutsideListener ] )

	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	const {
		getAttribute,
		updateAttributeHandler,
	} = useAttributeEditHandlers( attrNameTemplate )

	const ShapeComp = useMemo( () => getShapeSVG( getAttribute( 'backgroundShape' ) || 'blob1' ), [ getAttribute( 'backgroundShape' ) ] )

	const linearGradient = useMemo( () =>
		hasLinearGradient
			? (
				<LinearGradient
					id={ 'linear-gradient-' + attributes.uniqueId }
					iconColor1={ getAttribute( 'iconColor1' ) }
					iconColor2={ getAttribute( 'iconColor2' ) }
				/>
			)
			: <Fragment />,
	[
		attributes.uniqueId,
		getAttribute( 'iconColorGradientDirection' ),
		getAttribute( 'iconColor1' ),
		getAttribute( 'iconColor2' ),
	] )

	if ( ! getAttribute( 'icon' ) ) {
		return null
	}

	return (
		<span // eslint-disable-line
			className="stk--svg-wrapper"
			onClick={ event => {
				// Only register a click to .stk--inner-svg.
				if ( event.target.closest( '.stk--inner-svg' ) ) {
					setIsOpen( ! isOpen )
				}
			} }

		>
			<SVGIcon
				className="stk--inner-svg"
				prependRender={ linearGradient }
				value={ getAttribute( 'icon' ) }
				ariaLabel={ getAttribute( 'ariaLabel' ) }
			/>
			{ getAttribute( 'showBackgroundShape' ) && <ShapeComp className="stk--shape-icon" /> }
			{ isOpen && (
				<IconSearchPopover
					useRef={ popoverEl }
					onChange={ updateAttributeHandler( 'icon' ) }
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
	} = props

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const getValue = __getValue( attributes, getAttrName, '' )

	const ShapeComp = getShapeSVG( getValue( 'backgroundShape' ) || 'blob1' )

	if ( ! getValue( 'icon' ) ) {
		return null
	}

	const linearGradient = hasLinearGradient ? (
		<LinearGradient
			id={ 'linear-gradient-' + attributes.uniqueId }
			iconColor1={ getValue( 'iconColor1' ) }
			iconColor2={ getValue( 'iconColor2' ) }
		/>
	) : <Fragment />

	return (
		<span className="stk--svg-wrapper">
			<SVGIcon.Content
				className="stk--inner-svg"
				prependRender={ linearGradient }
				value={ getValue( 'icon' ) }
				ariaLabel={ getValue( 'ariaLabel' ) }
			/>
			{ getValue( 'showBackgroundShape' ) && (
				<ShapeComp className="stk--shape-icon" />
			) }
		</span>
	)
}

Icon.InspectorControls = Edit

Icon.addAttributes = addAttributes

Icon.Style = Style

