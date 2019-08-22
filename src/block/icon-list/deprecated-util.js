/**
 * Deprecated < 1.11
 */
/**
 * Internal dependencies
 */
import {
	ArrowCircleIcon,
	ArrowIcon,
	ArrowOutlineIcon,
	CheckCircleIcon,
	CheckIcon,
	CheckOutlineIcon,
	CrossCircleIcon,
	CrossIcon,
	CrossOutlineIcon,
	PlusCircleIcon,
	PlusIcon,
	PlusOutlineIcon,
	StarCircleIcon,
	StarIcon,
	StarOutlineIcon,
} from './deprecated-icons'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { renderToString } from '@wordpress/element'

/**
 * The list of available icons for the Icon List block.
 */
const BLOCK_ICONS = {
	check: {
		iconFunc: CheckIcon,
		circleFunc: CheckCircleIcon,
		outlineFunc: CheckOutlineIcon,
		title: __( 'Check', i18n ),
		value: 'check',
	},
	plus: {
		iconFunc: PlusIcon,
		circleFunc: PlusCircleIcon,
		outlineFunc: PlusOutlineIcon,
		title: __( 'Plus', i18n ),
		value: 'plus',
	},
	arrow: {
		iconFunc: ArrowIcon,
		circleFunc: ArrowCircleIcon,
		outlineFunc: ArrowOutlineIcon,
		title: __( 'Arrow', i18n ),
		value: 'arrow',
	},
	cross: {
		iconFunc: CrossIcon,
		circleFunc: CrossCircleIcon,
		outlineFunc: CrossOutlineIcon,
		title: __( 'Cross', i18n ),
		value: 'cross',
	},
	star: {
		iconFunc: StarIcon,
		circleFunc: StarCircleIcon,
		outlineFunc: StarOutlineIcon,
		title: __( 'Star', i18n ),
		value: 'star',
	},
}

/**
 * Gets the name of the shape function in the `BLOCK_ICONS` object.
 *
 * @param {string} iconShape The name of the shape.
 *
 * @return {string} The name of the icon function in the `BLOCK_ICONS` that can be called.
 */
const getIconShapeFunction = iconShape => {
	if ( iconShape === 'circle' || iconShape === 'outline' ) {
		return `${ iconShape }Func`
	}
	return 'iconFunc'
}

/**
 * Gets the SVG component for the given icon and shape.
 *
 * @param {string} icon The name of the icon e.g. `star`
 * @param {string} shape The shape of the icon e.g. `` or `circle`
 *
 * @return {Object} An svg component.
 */
export const getIconSVG = ( icon, shape = '' ) => {
	return BLOCK_ICONS[ icon ][ getIconShapeFunction( shape ) ]()
}

/**
 * Gets the SVG string for the given icon and shape that's based64 encoded for use inside styles.
 *
 * @param {string} icon The name of the icon e.g. `star`
 * @param {string} iconShape The shape of the icon e.g. `` or `circle`
 * @param {string} iconColor
 *
 * @return {string} A base64 encoded SVG component to be used inside style attributes.
 */
export const getIconSVGBase64 = ( icon, iconShape, iconColor ) => {
	const shapeFunc = getIconShapeFunction( iconShape )
	const iconString = svgRenderToString( BLOCK_ICONS[ icon ][ shapeFunc ]( iconColor ), false )
	return btoa( iconString )
}

/**
 * Renders an SVG WP Component into a string.
 * renderToString lowercases some attributes, this fixes those.
 *
 * @param {Component} svgComponent
 * @param {boolean} esc Escape `#` in the returned string.
 *
 * @return {string} The SVG as a string.
 *
 */
export const svgRenderToString = ( svgComponent, esc = true ) => {
	const s = renderToString( svgComponent )
		.replace( /viewbox/i, 'viewBox' )

	if ( esc ) {
		return s.replace( /#/g, '%23' ) // Using unescaped '#' characters in a data URI body is deprecated and will be removed in M71, around December 2018. Please use '%23' instead. See https://www.chromestatus.com/features/5656049583390720 for more details.
	}
	return s
}

/**
 * Gets a list of toolbars for picking an icon for the Icon List block.
 *
 * @param {Object} props
 *
 * @return {Array} An array of objects that can be used for the `controls` attribute of a Toolbar Component
 */
export const getIconToolbarList = props => {
	const {
		isActive = () => {},
		onChange = () => {},
	} = props

	return Object.keys( BLOCK_ICONS ).map( value => {
		return {
			...BLOCK_ICONS[ value ],
			icon: getIconSVG( value ),
			isActive: isActive( value ),
			onClick: onChange( value ),
		}
	} )
}

/**
 * Gets a list of toolbars for picking an icon shape based on the given icon.
 *
 * @param {string} icon The name of the icon to show the shapes for.
 * @param {Object} props
 *
 * @return {Array} An array of objects that can be used for the `controls` attribute of a Toolbar Component
 */
export const getIconShapeToolbarList = ( icon, props ) => {
	const {
		isActive = () => {},
		onChange = () => {},
	} = props
	return [ '', 'circle', 'outline' ].map( value => {
		return {
			...BLOCK_ICONS[ icon ],
			icon: getIconSVG( icon, value ),
			isActive: isActive( value ),
			onClick: onChange( value ),
		}
	} )
}
