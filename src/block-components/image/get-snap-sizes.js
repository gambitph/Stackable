import { range } from 'lodash'

const SNAP_SIZE_PERCENT = [ 0.25, 0.5, 0.75, 1 ]
const SNAP_SIZE = range( 50, 2001, 50 )
const SNAP_SIZE_HUNDREDS = range( 100, 2001, 100 )

const SNAP_SIZE_PERCENT_SHIFT = [ 0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.75, 0.8, 0.9, 1.0 ] // don't use range, it produces 0.30000000000004.
const SNAP_SIZE_SHIFT = range( 8, 2001, 8 )

export default ( maxWidth = 1000, maxHeight = 1000, widthUnit = '%', heightUnit = 'px', direction = 'bottom', isShiftKey = false ) => {
	// When resizing diagonally, use loose snapping.
	if ( direction === 'bottomRight' && ! isShiftKey ) {
		return {
			x: widthUnit === '%' ? SNAP_SIZE_PERCENT.map( p => p * maxWidth ) : SNAP_SIZE,
			y: heightUnit === '%' ? SNAP_SIZE_PERCENT.map( p => p * maxHeight ) : SNAP_SIZE_HUNDREDS,
		}
	}
	return {
		x: isShiftKey
			? ( widthUnit === '%' ? SNAP_SIZE_PERCENT_SHIFT.map( p => p * maxWidth ) : SNAP_SIZE_SHIFT )
			: ( widthUnit === '%' ? SNAP_SIZE_PERCENT.map( p => p * maxWidth ) : SNAP_SIZE ),
		y: isShiftKey
			? ( heightUnit === '%' ? SNAP_SIZE_PERCENT_SHIFT.map( p => p * maxHeight ) : SNAP_SIZE_SHIFT )
			: ( heightUnit === '%' ? SNAP_SIZE_PERCENT.map( p => p * maxHeight ) : SNAP_SIZE ),
	}
}
