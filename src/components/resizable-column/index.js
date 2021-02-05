/**
 * Internal dependencies
 */
import useDeviceEditorClasses from './use-device-editor-classes'

/**
 * External dependencies
 */
import {
	useBlockContext,
} from '~stackable/hooks'
import { clamp } from 'lodash'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { ResizableBox } from '@wordpress/components'
import { useState, useEffect } from '@wordpress/element'
import { withSelect } from '@wordpress/data'

const MIN_COLUMN_WIDTHS = {
	Desktop: 100,
	Tablet: 50,
	Mobile: 50,
}

const ResizableColumn = props => {
	const {
		isFirstBlock, isLastBlock, isOnlyBlock, adjacentBlocks, blockIndex, parentBlock,
	} = useBlockContext( props.blockProps )

	// This is used to add editor classes based on the preview device type.
	// Mainly for generating editor styles.
	useDeviceEditorClasses( props.previewDeviceType )

	const {
		toggleSelection,
	} = props.blockProps

	const [ currentWidths, setCurrentWidths ] = useState( [] )
	const [ newWidthsPercent, setNewWidthsPercent ] = useState( [] )
	const [ maxWidth, setMaxWidth ] = useState( 2000 )
	const [ tempStyles, setTempStyles ] = useState( '' )

	const isDesktop = props.previewDeviceType === 'Desktop'
	const isTablet = props.previewDeviceType === 'Tablet'

	// Reset the column widths in desktop if a column was added / removed.
	const [ prevAdjacentBlocks, setPrevAdjacentBlocks ] = useState( adjacentBlocks.length )
	useEffect( () => {
		if ( prevAdjacentBlocks !== adjacentBlocks.length ) {
			// Reset the desktop sizes, no need to resize tablet and mobile.
			props.onResetDesktop()

			// Remember the previous block length.
			setPrevAdjacentBlocks( adjacentBlocks.length )
		}
	}, [ adjacentBlocks ] )

	const className = classnames( [
		'stk-column-resizeable',
		className,
	] )

	return (
		<ResizableBox
			enable={ {
				top: false,
				right: props.previewDeviceType === 'Desktop' ? ! isOnlyBlock && ! isLastBlock : ! isOnlyBlock,
				bottom: false,
				left: props.previewDeviceType === 'Desktop' ? ! isOnlyBlock && ! isFirstBlock : false,
				topRight: false,
				bottomRight: false,
				bottomLeft: false,
				topLeft: false,
			} }
			minWidth={ MIN_COLUMN_WIDTHS[ props.previewDeviceType ] }
			minHeight="100"
			maxWidth={ maxWidth }
			className={ className }
			showHandle={ props.showHandle }
			onResizeStart={ ( _event, _direction ) => {
				toggleSelection( false )

				// In desktop, get all the column widths.
				if ( isDesktop ) {
					// Get the current pixel width of the columns.
					const columnWidths = adjacentBlocks.map( ( { clientId } ) => {
						const blockEl = document.querySelector( `[data-block="${ clientId }"]` )
						return blockEl?.clientWidth || 0
					} )
					setCurrentWidths( columnWidths )

					// Set the maximum width for the current column. The max
					// width depends on the adjacent block, the adjacent should
					// go past the minimum.
					const adjacentBlockIndex = _direction === 'right' ? blockIndex + 1 : blockIndex - 1
					const maxWidth = columnWidths[ blockIndex ] + ( columnWidths[ adjacentBlockIndex ] - MIN_COLUMN_WIDTHS.Desktop )
					setMaxWidth( maxWidth )

				// Tablet and mobile.
				} else {
					// Get the current pixel width of the columns.
					const blockEl = document.querySelector( `[data-block="${ props.blockProps.clientId }"]` )
					const columnWidth = blockEl?.clientWidth || 0
					setCurrentWidths( columnWidth )

					// The maximum width is the total width of the row.
					const parentEl = document.querySelector( `[data-block="${ parentBlock.clientId }"]` )
					const maxWidth = parentEl?.clientWidth || 0
					setMaxWidth( maxWidth )
				}
			} }
			onResize={ ( _event, _direction, elt, delta ) => {
				let columnPercentages = []

				// In desktop, when one column is resized, the next column is adjusted also.
				if ( isDesktop ) {
					// Compute for the new widths.
					const columnWidths = [ ...currentWidths ]
					const totalWidth = currentWidths.reduce( ( a, b ) => a + b, 0 )
					const adjacentBlockIndex = _direction === 'right' ? blockIndex + 1 : blockIndex - 1
					columnWidths[ adjacentBlockIndex ] -= delta.width
					columnWidths[ blockIndex ] += delta.width

					// Fix the widths, ensure that our total width is 100%
					columnPercentages = ( columnWidths || [] ).map( width => {
						return parseFloat( ( width / totalWidth * 100 ).toFixed( 1 ) )
					} )
					const totalCurrentWidth = columnPercentages.reduce( ( a, b ) => a + b, 0 )
					if ( totalCurrentWidth !== 100 ) {
						columnPercentages[ adjacentBlockIndex ] = parseFloat( ( columnPercentages[ adjacentBlockIndex ] + 100 - totalCurrentWidth ).toFixed( 1 ) )
					}

					setNewWidthsPercent( columnPercentages )

					// Add the temporary styles for our column widths.
					const columnStyles = columnPercentages.map( ( width, i ) => {
						return `[data-block="${ adjacentBlocks[ i ].clientId }"] {
							flex: 1 1 ${ width }% !important;
							max-width: ${ width }% !important;
						}`
					} ).join( '' )
					setTempStyles( columnStyles )

				// In tablet and mobile, when the column is resized, it's
				// adjusted alone, it can span the whole width for responsive
				// control.
				} else {
					const newWidth = currentWidths + delta.width
					columnPercentages = clamp( parseFloat( ( newWidth / maxWidth * 100 ).toFixed( 1 ) ), 0, 100 )

					setNewWidthsPercent( columnPercentages )

					// Add the temporary styles for our column widths.
					const columnStyles = `[data-block="${ props.blockProps.clientId }"] {
							flex: 1 1 ${ columnPercentages }% !important;
							max-width: ${ columnPercentages }% !important;
						}`
					setTempStyles( columnStyles )
				}
			} }
			onResizeStop={ ( _event, _direction, elt, delta ) => {
				// Update the block widths.
				if ( delta.width ) {
					if ( isDesktop ) {
						props.onChangeDesktop( newWidthsPercent )
					} else if ( isTablet ) {
						props.onChangeTablet( newWidthsPercent )
					} else {
						props.onChangeMobile( newWidthsPercent )
					}
				}

				// Wait until all attribute updates have been applied.
				if ( tempStyles ) {
					setTimeout( () => {
						setTempStyles( '' )
					}, 400 )
				}
			} }
		>
			{ tempStyles && <style>{ tempStyles }</style> }
			{ props.children }
		</ResizableBox>
	)
}

ResizableColumn.defaultProps = {
	className: '',
	showHandle: true,
	blockProps: {},
	onChangeDesktop: () => {},
	onChangeTablet: () => {},
	onChangeMobile: () => {},
	onResetDesktop: () => {},
}

export default compose( [
	withSelect( select => {
		const {
			__experimentalGetPreviewDeviceType,
		} = select( 'core/edit-post' )

		return {
			previewDeviceType: __experimentalGetPreviewDeviceType(),
		}
	} ),
] )( ResizableColumn )
