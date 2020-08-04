/**
 * Internal dependencies
 */
import SVGCircle from './images/circle.svg'
import SVGSquare from './images/square.svg'
import SVGBlob1 from './images/blob1.svg'

/**
 * External dependencies
 */
import { camelCase } from 'lodash'
import { appendImportant, __getValue } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'
import { svgRenderToString } from '../svg'
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

const createImageStyles = ( attrNameTemplate = '%s', screen = 'desktop', blockAttributes = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = __getValue( blockAttributes, getAttrName )

	const shape = getValue( 'Shape' )
	const getHeight = widthAttrName => {
		return getValue( 'Square' ) && getValue( widthAttrName ) ? getValue( widthAttrName, '%spx' ) : 'auto'
	}

	if ( screen !== 'tablet' && screen !== 'mobile' ) { // Desktop.
		return {
			borderRadius: ! shape ? getValue( 'BorderRadius', '%spx' ) : undefined,
			width: getValue( 'Width', '%spx' ),
			height: getValue( 'Width' ) ? appendImportant( getHeight( 'Width' ) ) : undefined,
		}
	} else if ( screen === 'tablet' ) { // Tablet.
		return {
			width: getValue( 'TabletWidth', '%spx' ),
			height: getValue( 'TabletWidth' ) ? appendImportant( getHeight( 'TabletWidth' ) ) : undefined,
		}
	}
	// Mobile.
	return {
		width: getValue( 'MobileWidth', '%spx' ),
		height: getValue( 'MobileWidth' ) ? appendImportant( getHeight( 'MobileWidth' ) ) : undefined,
	}
}

export const createImageMask = ( attrNameTemplate = '%s', blockAttributes = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = __getValue( blockAttributes, getAttrName )

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
			...createImageStyles( attrNameTemplate, 'desktop', blockAttributes, options ),
			...createImageMask( attrNameTemplate, blockAttributes, options ),
		}
	} else {
		style[ `.${ mainClassName }` ] = {
			...createImageMask( attrNameTemplate, blockAttributes, options ),
		}
		style.desktopOnly = {
			[ `${ mainClassName }` ]: {
				...createImageStyles( attrNameTemplate, 'desktop', blockAttributes, options ),
			}
		}
	}

	return style
}

