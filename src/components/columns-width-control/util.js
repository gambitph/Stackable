const MIN = 10

export const fixColumnWidths = ( columns, direction = 'right' ) => {
	if ( direction === 'left' ) {
		for ( let i = columns.length - 1; i >= 1; i-- ) {
			if ( columns[ i ] < MIN ) {
				const extra = MIN - columns[ i ]
				columns[ i ] = MIN
				columns[ i - 1 ] -= extra
			}
		}
	}

	for ( let i = 0; i < columns.length - 1; i++ ) {
		if ( columns[ i ] < MIN ) {
			const extra = MIN - columns[ i ]
			columns[ i ] = MIN
			columns[ i + 1 ] -= extra
		}
	}

	if ( direction === 'right' ) {
		for ( let i = columns.length - 1; i >= 1; i-- ) {
			if ( columns[ i ] < MIN ) {
				const extra = MIN - columns[ i ]
				columns[ i ] = MIN
				columns[ i - 1 ] -= extra
			}
		}
	}

	return columns
}

export const columnWidthSum = columnWidths => {
	return columnWidths.reduce( ( sum, width ) => sum + width, 0 )
}
