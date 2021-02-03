/**
 * External dependencies
 */
import {
	useBlockContext,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { ResizableBox } from '@wordpress/components'
import { useState, useEffect } from '@wordpress/element'

const MIN_COLUMN_WIDTH = 150

const ResizableColumn = props => {
	const {
		isFirstBlock, isLastBlock, isOnlyBlock, adjacentBlocks, blockIndex,
	} = useBlockContext( props.blockProps )
	const {
		toggleSelection,
	} = props.blockProps

	const [ currentWidths, setCurrentWidths ] = useState( [] )
	const [ newWidths, setNewWidths ] = useState( [] )
	const [ maxWidth, setMaxWidth ] = useState( 2000 )
	const [ tempStyles, setTempStyles ] = useState( '' )

	// Reset the column widths in desktop if a column was added / removed.
	const [ prevAdjacentBlocks, setPrevAdjacentBlocks ] = useState( adjacentBlocks.length )
	useEffect( () => {
		if ( prevAdjacentBlocks !== adjacentBlocks.length ) {
			props.onResetDesktop()

			// Remember the previous block length.
			setPrevAdjacentBlocks( adjacentBlocks.length )
		}
	}, [ adjacentBlocks ] )

	return (
		<ResizableBox
			enable={ {
				top: false,
				right: ! isOnlyBlock && ! isLastBlock,
				bottom: false,
				left: ! isOnlyBlock && ! isFirstBlock,
				topRight: false,
				bottomRight: false,
				bottomLeft: false,
				topLeft: false,
			} }
			minWidth={ MIN_COLUMN_WIDTH }
			minHeight="100"
			maxWidth={ maxWidth }
			className="stk-column-resizeable"
			showHandle={ props.showHandle }
			onResizeStart={ ( _event, _direction ) => {
				toggleSelection( false )

				// Get the current pixel width of the columns.
				const columnWidths = adjacentBlocks.map( ( { clientId } ) => {
					const blockEl = document.querySelector( `[data-block="${ clientId }"]` )
					return blockEl?.clientWidth || 0
				} )
				setCurrentWidths( columnWidths )

				// We will keep the new widths here.
				setNewWidths( [] )

				// Set the maximum width for the current column.
				const adjacentBlockIndex = _direction === 'right' ? blockIndex + 1 : blockIndex - 1
				const maxWidth = columnWidths[ blockIndex ] + ( columnWidths[ adjacentBlockIndex ] - MIN_COLUMN_WIDTH )
				setMaxWidth( maxWidth )
			} }
			onResize={ ( _event, _direction, elt, delta ) => {
				// Compute for the new widths.
				const columnWidths = [ ...currentWidths ]
				const totalWidth = currentWidths.reduce( ( a, b ) => a + b, 0 )
				const adjacentBlockIndex = _direction === 'right' ? blockIndex + 1 : blockIndex - 1
				columnWidths[ adjacentBlockIndex ] -= delta.width
				columnWidths[ blockIndex ] += delta.width

				// Fix the widths, ensure that our total width is 100%
				const columnPercentages = ( columnWidths || [] ).map( width => {
					return parseFloat( ( width / totalWidth * 100 ).toFixed( 1 ) )
				} )
				const totalCurrentWidth = columnPercentages.reduce( ( a, b ) => a + b, 0 )
				if ( totalCurrentWidth !== 100 ) {
					columnPercentages[ adjacentBlockIndex ] = parseFloat( ( columnPercentages[ adjacentBlockIndex ] + 100 - totalCurrentWidth ).toFixed( 1 ) )
				}

				setNewWidths( columnPercentages )

				// Add the temporary styles for our column widths.
				const columnStyles = columnPercentages.map( ( width, i ) => {
					return `[data-block="${ adjacentBlocks[ i ].clientId }"] {
						flex: 1 1 ${ width }% !important;
						max-width: ${ width }% !important;
					}`
				} ).join( '' )
				setTempStyles( columnStyles )
			} }
			onResizeStop={ () => {
				if ( ! newWidths.length ) {
					return
				}

				// Update the block widths.
				props.onChangeDesktop( newWidths )

				// Wait until all attribute updates have been applied.
				setTimeout( () => {
					setTempStyles( '' )
				}, 400 )
			} }
		>
			{ tempStyles && <style>{ tempStyles }</style> }
			{ props.children }
		</ResizableBox>
	)
}

ResizableColumn.defaultProps = {
	showHandle: true,
	blockProps: {},
	onChangeDesktop: () => {},
	onResetDesktop: () => {},
}

export default ResizableColumn
