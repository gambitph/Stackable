/**
 * Internal dependencies
 */
import SVGCircle from './shapes/circle.svg'
import SVGSquare from './shapes/square.svg'
import SVGBlob1 from './shapes/blob1.svg'
import { svgRenderToString } from '~stackable/util'

/**
 * WordPress dependencies
 */
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

export const getShapeCSS = ( shape, shapeFlipX, shapeFlipY, shapeStretch ) => {
	if ( ! shape ) {
		return {}
	}

	const MaskImage = getShapeSVG( shape )
	const MaskComp = <MaskImage
		preserveAspectRatio={ ! [ '', 'square' ].includes( shape ) && shapeStretch ? 'none' : undefined }
		transform={ ! shapeFlipX && ! shapeFlipY ? undefined : `scale(${ shapeFlipX ? -1 : 1 },${ shapeFlipY ? -1 : 1 })` }
	/>
	const maskString = btoa( svgRenderToString( MaskComp ) )

	return `url('data:image/svg+xml;base64,${ maskString }')`
}
