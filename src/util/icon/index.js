export { default as createIconAttributes } from './attributes'
export { createIconAttributeNames } from './attributes'
export { createIconStyleSet } from './styles'

export const numShapesInSvg = svgString => {
	if ( typeof svgString !== 'string' ) {
		return 0
	}
	return ( svgString.match( /<(circle|ellipse|line|polygon|polyline|rect|shape|path)/g ) || [] ).length || 1
}
