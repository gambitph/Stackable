/**
 * Internal dependencies
 */
import SVGCircle from './images/circle.svg'
import SVGSquare from './images/square.svg'
import SVGBlob1 from './images/blob1.svg'
import { appendImportant, __getValue } from '../styles'
import { svgRenderToString } from '../svg'

/**
 * External dependencies
 */
import { camelCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

const SVGS = {
	circle: SVGCircle,
	square: SVGSquare,
	blob1: SVGBlob1,
}

export const getShapeSVG = shape => {
	const svgs = applyFilters( 'stackable.image.shape.svgs', SVGS )
	return ! svgs[ shape ] ? null : svgs[ shape ]
}

const createImageBorderStyles = ( attrNameTemplate = '%s', blockAttributes = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = __getValue( blockAttributes, getAttrName )

	const shape = getValue( 'Shape' )
	return {
		borderRadius: ! shape ? getValue( 'BorderRadius', '%spx' ) : undefined,
	}
}

const createImageStyles = ( attrNameTemplate = '%s', screen = 'desktop', blockAttributes = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = __getValue( blockAttributes, getAttrName )

	const shape = getValue( 'Shape' )
	const getHeight = ( widthAttrName, square ) => {
		return getValue( square ) && getValue( widthAttrName ) ? getValue( widthAttrName, '%spx' ) : 'auto'
	}

	if ( screen !== 'tablet' && screen !== 'mobile' ) { // Desktop.
		return {
			borderRadius: ! shape ? getValue( 'BorderRadius', '%spx' ) : undefined,
			width: getValue( 'Width', '%spx' ),
			height: getValue( 'Width' ) ? appendImportant( getHeight( 'Width', 'Square' ) ) : undefined,
		}
	} else if ( screen === 'tablet' ) { // Tablet.
		return {
			width: getValue( 'TabletWidth', '%spx' ),
			height: getValue( 'TabletWidth' ) ? appendImportant( getHeight( 'TabletWidth', 'TabletSquare' ) ) : undefined,
		}
	}
	// Mobile.
	return {
		width: getValue( 'MobileWidth', '%spx' ),
		height: getValue( 'MobileWidth' ) ? appendImportant( getHeight( 'MobileWidth', 'MobileSquare' ) ) : undefined,
	}
}

export const createImageMask = ( attrNameTemplate = '%s', blockAttributes = {}, options = {} ) => {
	const {
		parentAttrNameTemplate,
	} = options
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const _getValue = __getValue( blockAttributes, getAttrName )

	const getValue = value => {
		if ( parentAttrNameTemplate ) {
			const getParentAttrName = attrName => camelCase( sprintf( parentAttrNameTemplate, attrName ) )
			const getParentValue = __getValue( blockAttributes, getParentAttrName )
			return _getValue( value ) !== undefined ? _getValue( value ) : getParentValue( value )
		}
		return _getValue( value )
	}

	const shape = getValue( 'Shape' )
	if ( ! shape ) {
		return {}
	}

	const shapeStretch = getValue( 'ShapeStretch' )
	const shapeFlipX = getValue( 'ShapeFlipX' )
	const shapeFlipY = getValue( 'ShapeFlipY' )
	const MaskImage = getShapeSVG( shape )
	const MaskComp = <MaskImage
		preserveAspectRatio={ ! [ '', 'square' ].includes( shape ) && shapeStretch ? 'none' : undefined }
		transform={ ! shapeFlipX && ! shapeFlipY ? undefined : `scale(${ shapeFlipX ? -1 : 1 },${ shapeFlipY ? -1 : 1 })` }
	/>
	const maskString = btoa( svgRenderToString( MaskComp ) )
	return {
		'-webkit-mask-image': `url('data:image/svg+xml;base64,${ maskString }')`,
		'mask-image': `url('data:image/svg+xml;base64,${ maskString }')`,
	}
}

export default createImageStyles

export const createImageStyleSet = ( attrNameTemplate = '%s', mainClassName = '', blockAttributes = {}, options = {} ) => {
	const {
		inherit = true,
	} = options

	const style = {
		[ `.${ mainClassName }` ]: {
			...createImageMask( attrNameTemplate, blockAttributes, options ),
		},
		tabletOnly: {
			[ `.${ mainClassName }` ]: {
				...createImageStyles( attrNameTemplate, 'tablet', blockAttributes, options ),
			},
		},
		mobile: {
			[ `.${ mainClassName }` ]: {
				...createImageStyles( attrNameTemplate, 'mobile', blockAttributes, options ),
			},
		},
	}

	if ( inherit ) {
		style[ `.${ mainClassName }` ] = {
			...style[ `.${ mainClassName }` ],
			...createImageStyles( attrNameTemplate, 'desktop', blockAttributes, options ),
		}
	} else {
		style[ `.${ mainClassName }` ] = {
			...style[ `.${ mainClassName }` ],
			...createImageBorderStyles( attrNameTemplate, blockAttributes ),
		}
		style.desktopTablet = {
			[ `.${ mainClassName }` ]: {
				...createImageStyles( attrNameTemplate, 'desktop', blockAttributes, options ),
			},
		}
	}

	return style
}

