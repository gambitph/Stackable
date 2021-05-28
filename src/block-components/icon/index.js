/**
 * External dependencies
 */
import { useBlockAttributes } from '~stackable/hooks'
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
	useMemo,
} from '@wordpress/element'

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
	id,
} ) => (
	<svg style={ { height: 0, width: 0 } }>
		<defs>
			<linearGradient
				id={ id }
				x1="0"
				x2="100%"
				y1="0"
				y2="0"
			>
				<stop offset="0%" style={ { stopOpacity: 1, stopColor: `var(--${ kebabCase( id ) }-color-1)` } }></stop>
				<stop offset="100%" style={ { stopOpacity: 1, stopColor: `var(--${ kebabCase( id ) }-color-2)` } }></stop>
			</linearGradient>
		</defs>
	</svg>
)

export const Icon = props => {
	const {
		attrNameTemplate = '%s',
	} = props

	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const getValue = __getValue( attributes, getAttrName, '' )

	const ShapeComp = useMemo( () => getShapeSVG( getValue( 'backgroundShape' ) || 'blob1' ), [ getValue( 'backgroundShape' ) ] )

	const linearGradient = useMemo( () =>
		<LinearGradient
			id={ 'linear-gradient-' + attributes.uniqueId }
			iconColor1={ getValue( 'iconColor1' ) }
			iconColor2={ getValue( 'iconColor2' ) }
		/>,
	[
		attributes.uniqueId,
		getValue( 'iconColorGradientDirection' ),
		getValue( 'iconColor1' ),
		getValue( 'iconColor2' ),
	] )

	if ( ! getValue( 'icon' ) ) {
		return null
	}

	return (
		<span className="stk-button__svg-wrapper">
			<SVGIcon
				className="stk-button__inner-svg"
				prependRender={ linearGradient }
				value={ getValue( 'icon' ) }
			/>
			{ getValue( 'showBackgroundShape' ) && <ShapeComp className="stk--shape-icon" /> }
		</span>
	)
}

Icon.Content = props => {
	const {
		attributes,
		attrNameTemplate,
	} = props

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const getValue = __getValue( attributes, getAttrName, '' )

	const ShapeComp = getShapeSVG( getValue( 'backgroundShape' ) || 'blob1' )

	if ( ! getValue( 'icon' ) ) {
		return null
	}

	const linearGradient = (
		<LinearGradient
			id={ 'linear-gradient-' + attributes.uniqueId }
			iconColor1={ getValue( 'iconColor1' ) }
			iconColor2={ getValue( 'iconColor2' ) }
		/>
	)

	return (
		<span className="stk-button__svg-wrapper">
			<SVGIcon.Content
				className="stk-button__inner-svg"
				prependRender={ linearGradient }
				value={ getValue( 'icon' ) }
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

