import { sum } from 'lodash'

/**
 * Gets the row of each column based on their width values. When the width
 * values surpass 100, then the next column collapses down. e.g. [ 30, 40, 50 ]
 * returns [ 1, 1, 2 ], which means:
 * - The 1st column is on the 1st row
 * - The 2nd column is on the 1st row
 * - The 3rd column is on the 2nd row
 *
 * @param {Array} widths Array of width values, e.g. [ 33.33, 33.33, 33.33 ]
 * @return {Array} An array containing the row number of each column.
 */
export const getRowsFromColumns = widths => {
	const columnRows = []
	widths.reduce( ( columnCounts, width ) => {
		const lastTotalWidth = sum( columnCounts[ columnCounts.length - 1 ] )
		if ( lastTotalWidth + width > 100 ) {
			columnCounts.push( [ width ] )
		} else {
			columnCounts[ columnCounts.length - 1 ].push( width )
		}
		columnRows.push( columnCounts.length )
		return columnCounts
	}, [ [] ] )

	return columnRows
}
