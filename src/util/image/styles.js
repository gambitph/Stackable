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

const createImageStyles = ( attrNameTemplate = '%s', screen = 'desktop', blockAttributes = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = ( attrName = '', format = '' ) => {
		const value = typeof blockAttributes[ getAttrName( attrName ) ] === 'undefined' ? '' : blockAttributes[ getAttrName( attrName ) ]
		return value !== '' ? ( format ? sprintf( format, value ) : value ) : undefined
	}

	const shape = getValue( 'Shape' )

	if ( screen !== 'tablet' && screen !== 'mobile' ) { // Desktop.
		return {
			borderRadius: ! shape ? getValue( 'BorderRadius', '%spx' ) : undefined,
		}
	} else if ( screen === 'tablet' ) { // Tablet.
		return {
			width: getValue( 'TabletWidth', '%spx' ),
			height: getValue( 'TabletWidth', 'auto' ),
		}
	}
	// Mobile.
	return {
		width: getValue( 'MobileWidth', '%spx' ),
		height: getValue( 'MobileWidth', 'auto' ),
	}
}

export const createImageMask = ( attrNameTemplate = '%s', blockAttributes = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = ( attrName = '', format = '' ) => {
		const value = typeof blockAttributes[ getAttrName( attrName ) ] === 'undefined' ? '' : blockAttributes[ getAttrName( attrName ) ]
		return value !== '' ? ( format ? sprintf( format, value ) : value ) : undefined
	}

	const shape = getValue( 'Shape' )
	if ( ! shape ) {
		return {}
	}

	const shapeStretch = getValue( 'ShapeStretch' )
	const shapeFlipX = getValue( 'ShapeFlipX' )
	const shapeFlipY = getValue( 'ShapeFlipY' )
	const MaskImage = applyFilters( 'stackable.image.shape.svgs', SVGS )[ shape ]
	const MaskComp = <MaskImage
		preserveAspectRatio={ ! [ '', 'square', 'circle' ].includes( shape ) && shapeStretch ? 'none' : undefined }
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
	return {
		[ `.${ mainClassName }` ]: {
			...createImageStyles( attrNameTemplate, 'desktop', blockAttributes, options ),
			...createImageMask( attrNameTemplate, blockAttributes, options ),
		},
		tablet: {
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
}
