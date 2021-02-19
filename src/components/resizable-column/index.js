/**
 * Internal dependencies
 */
import useDeviceEditorClasses from './use-device-editor-classes'
import getSnapWidths from './get-snap-widths'
import { AdvancedTextControl } from '..'

/**
 * External dependencies
 */
import {
	useBlockContext,
} from '~stackable/hooks'
import { clamp, isEqual } from 'lodash'
import classnames from 'classnames'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'
import { ResizableBox, Popover } from '@wordpress/components'
import {
	Fragment, useState, useEffect, useRef, useCallback, useMemo,
} from '@wordpress/element'
import { withSelect } from '@wordpress/data'
import useWithShift from './use-with-shift'

const MIN_COLUMN_WIDTHS = {
	Desktop: 100,
	Tablet: 50,
	Mobile: 50,
}

const MIN_COLUMN_WIDTH_PERCENTAGE = {
	Desktop: 5,
	Tablet: 10,
	Mobile: 10,
}

const ResizableColumn = props => {
	const blockContext = useBlockContext( props.blockProps )
	const {
		isFirstBlock, isLastBlock, isOnlyBlock, adjacentBlocks, blockIndex, parentBlock,
	} = blockContext

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
	const [ snapWidths, setSnapWidths ] = useState( null )

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

	// We have a timeout below, this ensures that our timeout only runs while
	// this Component is mounted.
	const [ isMounted, setIsMounted ] = useState( false )
	useEffect( () => {
		setIsMounted( true )
		return () => {
			setIsMounted( false )
		}
	}, [] )

	const isShiftKey = useWithShift()
	useEffect( () => {
		setSnapWidths( null )
	}, [ isShiftKey ] )

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
			snap={ snapWidths }
			snapGap={ 15 }
			onResizeStart={ ( _event, _direction ) => {
				toggleSelection( false )

				// In desktop, get all the column widths.
				if ( isDesktop ) {
					// Get the current pixel width of the columns.
					const parentEl = document.querySelector( `[data-block="${ parentBlock.clientId }"]` )
					const parentWidth = parentEl.clientWidth
					const isFirstResize = adjacentBlocks.every( ( { attributes } ) => ! attributes.columnWidth )
					const columnWidths = adjacentBlocks.map( ( { clientId, attributes } ) => {
						// If columns haven't been resized yet, create default values.
						if ( isFirstResize ) {
							return parentWidth * 1 / adjacentBlocks.length
						}
						// If there's already a column width set, use that value.
						if ( attributes.columnWidth ) {
							return parentWidth * attributes.columnWidth / 100
						}
						const blockEl = document.querySelector( `[data-block="${ clientId }"]` )
						return blockEl?.clientWidth || 0
					} )
					setCurrentWidths( columnWidths )

					// Set the maximum width for the current column. The max
					// width depends on the adjacent block, the adjacent should
					// not go past the minimum.
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
						}
						[data-block="${ adjacentBlocks[ i ].clientId }"] .stk-resizable-column__size-tooltip {
							--width: '${ width.toFixed( 1 ) }%' !important;
						}`
					} ).join( '' )
					setTempStyles( columnStyles )

					// Set snap widths. We need to do this here not on
					// ResizeStart or it won't be used at first drag.
					if ( ! snapWidths ) {
						setSnapWidths( { x: getSnapWidths( columnWidths, blockIndex, totalWidth, _direction, isShiftKey ) } )
					}

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
						}
						[data-block="${ props.blockProps.clientId }"] .stk-resizable-column__size-tooltip {
							--width: '${ columnPercentages.toFixed( 1 ) }%' !important;
						}`
					setTempStyles( columnStyles )

					// Set snap widths. We need to do this here not on
					// ResizeStart or it won't be used at first drag.
					if ( ! snapWidths ) {
						setSnapWidths( { x: getSnapWidths( [ 100 ], 0, maxWidth, _direction, isShiftKey ) } )
					}
				}
			} }
			onResizeStop={ ( _event, _direction, elt, delta ) => {
				// Update the block widths.
				if ( delta.width ) {
					if ( isDesktop ) {
						// For even 3-columns, floats have a tendency of being
						// unequal, e.g. 33.35 or 33.43, assume to be equal.
						if ( isEqual( newWidthsPercent.map( n => n | 0 ), [ 33, 33, 33 ] ) ) { // eslint-disable-line no-bitwise
							props.onChangeDesktop( [ 33.33, 33.33, 33.33 ] )
						} else {
							props.onChangeDesktop( newWidthsPercent )
						}
					} else if ( isTablet ) {
						props.onChangeTablet( newWidthsPercent )
					} else {
						props.onChangeMobile( newWidthsPercent )
					}
				}

				// Wait until all attribute updates have been applied.
				if ( tempStyles ) {
					setTimeout( () => {
						if ( isMounted ) {
							setTempStyles( '' )
						}
					}, 400 )
				}

				setSnapWidths( null )
			} }
		>
			{ <ResizableTooltip
				isVisible={ ! isOnlyBlock }
				blockContext={ blockContext }
				blockProps={ props.blockProps }
				value={ props.blockProps.attributes.columnWidth }
				onChange={ width => {
					if ( width < MIN_COLUMN_WIDTH_PERCENTAGE[ props.previewDeviceType ] ) {
						return
					}

					// For desktop, column adjustments also affect the adjacent column.
					if ( isDesktop ) {
						// Get the current column widths.
						const isFirstResize = adjacentBlocks.every( ( { attributes } ) => ! attributes.columnWidth )
						const columnWidths = adjacentBlocks.map( ( { attributes } ) => {
							if ( isFirstResize ) {
								return 100 / adjacentBlocks.length
							}
							return attributes.columnWidth
						} )

						// Set the maximum width for the current column. The max
						// width depends on the adjacent block, the adjacent
						// should not go past the minimum.
						const adjacentBlockIndex = adjacentBlocks.length - 1 !== blockIndex ? blockIndex + 1 : blockIndex - 1
						const maxWidth = columnWidths[ blockIndex ] + ( columnWidths[ adjacentBlockIndex ] - 5 )

						// Compute for the new widths.
						const finalWidth = clamp( width, MIN_COLUMN_WIDTH_PERCENTAGE.Desktop, maxWidth )
						const delta = finalWidth - columnWidths[ blockIndex ]
						columnWidths[ adjacentBlockIndex ] -= delta
						columnWidths[ blockIndex ] = finalWidth

						props.onChangeDesktop( columnWidths )
					} else {
						// Tablet and Mobile.
						const finalWidth = clamp( width, MIN_COLUMN_WIDTH_PERCENTAGE[ props.previewDeviceType ], 100 )
						if ( isTablet ) {
							props.onChangeTablet( finalWidth )
						} else {
							props.onChangeMobile( finalWidth )
						}
					}
				} }
			/> }
			{ tempStyles && <style>{ tempStyles }</style> }
			{ props.children }
		</ResizableBox>
	)
}

const _ResizableTooltip = props => {
	const {
		adjacentBlocks, isOnlyBlock, blockIndex, isLastBlock, isFirstBlock,
	} = props.blockContext

	const [ isEditWidth, setIsEditWidth ] = useState( false )
	const [ originalInputValue, setOriginalInputValue ] = useState( '' )
	const [ currentInputValue, setCurrentInputValue ] = useState( '' )
	const popupRef = useRef()
	const tooltipRef = useRef()

	// Compute the default column label value if none is available.
	const columnLabel = useMemo( () => {
		if ( ! props.value && ! originalInputValue ) {
			// In mobile, the columns collapse to 100%.
			if ( props.previewDeviceType === 'Mobile' ) {
				return 100.0
			}
			// The columns are evenly distributed by default.
			const value = ( 100 / adjacentBlocks.length ).toFixed( 1 )
			if ( value.toString() === '33.3' ) {
				return 33.33
			}
			return value
		}

		return ``
	}, [ adjacentBlocks.length, props.value, originalInputValue, props.previewDeviceType ] )

	// Create the label of the tooltip.
	const tooltipLabel = useMemo( () => {
		return `'${ ( props.value ? parseFloat( props.value ).toFixed( 1 ) : '' ) || originalInputValue || columnLabel }%'`
	}, [ props.value, originalInputValue, columnLabel ] )

	// Setup the input field when the popup opens.
	useEffect( () => {
		if ( isEditWidth ) {
			setOriginalInputValue( props.value )
			setCurrentInputValue( props.value || columnLabel )

			// When the manual entry opens, select the whole value.
			setTimeout( () => {
				popupRef.current.querySelector( 'input' ).select()
			}, 1 )
		}
	}, [ isEditWidth ] )

	// Opens the manual entry for the next column.
	const openNextColumn = useCallback( ( direction = 'right' ) => {
		if ( direction === 'right' ) {
			// Open the popup of the column on the right.
			const nextIndex = ! isLastBlock ? blockIndex + 1 : 0
			const nextTooltip = tooltipRef.current.closest( '.stk-row' ).querySelectorAll( '.stk-resizable-column__size-tooltip' )[ nextIndex ]
			if ( nextTooltip ) {
				nextTooltip.dispatchEvent( new CustomEvent( 'openColumnInputPopup' ) ) // eslint-disable-line no-undef
				// Close the current popup.
				setIsEditWidth( false )
			}
		} else {
			// Open the popup of the column on the left.
			const prevIndex = ! isFirstBlock ? blockIndex - 1 : adjacentBlocks.length - 1
			const prevTooltip = tooltipRef.current.closest( '.stk-row' ).querySelectorAll( '.stk-resizable-column__size-tooltip' )[ prevIndex ]
			if ( prevTooltip ) {
				prevTooltip.dispatchEvent( new CustomEvent( 'openColumnInputPopup' ) ) // eslint-disable-line no-undef
				// Close the current popup.
				setIsEditWidth( false )
			}
		}
	}, [
		adjacentBlocks.map( ( { clientId } ) => clientId ).join( ',' ), // Dependency is the arrangement of the columns.
	] )

	// Listen for external triggers to open the column input for this column.
	const openColumnInputPopupListener = useCallback( () => {
		setIsEditWidth( true )
	}, [] )
	useEffect( () => {
		tooltipRef.current?.addEventListener( 'openColumnInputPopup', openColumnInputPopupListener )
		return () => {
			tooltipRef.current?.removeEventListener( 'openColumnInputPopup', openColumnInputPopupListener )
		}
	}, [ openColumnInputPopupListener ] )

	return (
		<Fragment>
			{ ! isOnlyBlock && isEditWidth &&
				<Popover
					className="stk-resizable-column__popup"
					anchorRef={ tooltipRef.current }
					position="bottom right"
					onFocusOutside={ () => setIsEditWidth( false ) }
				>
					<div ref={ popupRef }>
						<AdvancedTextControl
							label={ __( 'Column', i18n ) }
							className="stk-resizable-column__input"
							value={ currentInputValue }
							onChange={ value => {
								props.onChange( clamp( value, 0, 100 ) || originalInputValue )
								setCurrentInputValue( value )
							} }
							onKeyDown={ event => {
								// When hitting tab, open the next column popup.
								if ( event.keyCode === 9 ) {
									openNextColumn( event.shiftKey ? 'left' : 'right' )
									event.preventDefault()
								}
							} }
							placeholder={ originalInputValue || columnLabel }
						/>
					</div>
				</Popover>
			}
			{
				! isOnlyBlock && (
					<div
						className="stk-resizable-column__size-tooltip"
						ref={ tooltipRef }
						style={ { '--width': tooltipLabel } }
						onMouseDown={ () => setIsEditWidth( ! isEditWidth ) }
						onKeyDown={ event => {
							if ( event.keyCode === 13 ) {
								setIsEditWidth( ! isEditWidth )
							}
						} }
						role="button"
						tabIndex="0"
					>
					</div>
				)
			}
		</Fragment>
	)
}

_ResizableTooltip.defaultProps = {
	isVisible: true,
	blockContext: {},
	blockProps: {},
	value: '',
	onChange: () => {},
}

const ResizableTooltip = compose( [
	withSelect( select => {
		const {
			__experimentalGetPreviewDeviceType,
		} = select( 'core/edit-post' )

		return {
			previewDeviceType: __experimentalGetPreviewDeviceType(),
		}
	} ),
] )( _ResizableTooltip )

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
