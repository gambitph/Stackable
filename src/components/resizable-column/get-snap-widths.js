/**
 * Our columns should be snappable at 25% 33.333% 50% 66.667% 75% 100%
 *
 * However, the snap values that are inputted in our Resizable Component are all
 * widths of the current column.
 *
 * Algorithm:
 * 1. Compute for the snap locations:
 * const width25 = totalWidth * 0.25
 * const width33 = totalWidth * 0.33333
 * ...
 *
 * 2. Get the left or right coordinate of the current column:
 * const leftEdge = columnWidths.slice( 0, columnIndex ).reduce( ( a, b ) => a + b, 0 )
 * const rightEdge = leftEdge + columnWidth
 *
 * 3. Get the snapping widths by using one side as the reference point.
 * For left direction:
 * const snap25 = rightEdge - width25
 * For right:
 * const snap25 = width25 - leftEdge
 */
const SNAP_WIDTHS = [ 0.25, 0.33333, 0.5, 0.66666, 0.75, 1 ]
const SNAP_WIDTHS_TENS = [ 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1 ]

export const getSnapWidths = ( columnWidths, columnIndex, totalWidth, direction = 'right', isShiftKey = false ) => {
	const leftEdge = columnWidths.slice( 0, columnIndex ).reduce( ( a, b ) => a + b, 0 )
	const rightEdge = leftEdge + columnWidths[ columnIndex ]

	const widths = ! isShiftKey ? SNAP_WIDTHS : SNAP_WIDTHS_TENS

	return widths.map( percentWidth => {
		const pxWidth = totalWidth * percentWidth
		return direction === 'right' ? pxWidth - leftEdge : rightEdge - pxWidth
	} )
}
