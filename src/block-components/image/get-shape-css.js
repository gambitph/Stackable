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
	/>

	let svgString = svgRenderToString( MaskComp )

	// Safari fix: instead of transform on <svg>, wrap contents in a <g> with transform
	if ( shapeFlipX || shapeFlipY ) {
		const scaleX = shapeFlipX ? -1 : 1
		const scaleY = shapeFlipY ? -1 : 1

		// Extract viewBox to compute translate offset
		const viewBoxMatch = svgString.match( /viewBox=["']([^"']+)["']/ )
		const [ minX, minY, width, height ] = viewBoxMatch
			? viewBoxMatch[ 1 ].trim().split( /[\s,]+/ ).map( Number ) : [ 0, 0, 100, 100 ]

		const translateX = shapeFlipX ? width + ( 2 * minX ) : 0
		const translateY = shapeFlipY ? height + ( 2 * minY ) : 0

		// SVG transform are applied right to left
		// Scale first (flip) and translate (reposition to view)
		svgString = svgString.replace(
			/(<svg[^>]*>)([\s\S]*)(<\/svg>)/,
			`$1<g transform="translate(${ translateX },${ translateY }) scale(${ scaleX },${ scaleY })">$2</g>$3`
		)
	}

	const maskString = btoa( svgString )
	return `url('data:image/svg+xml;base64,${ maskString }')`
}
