/**
 * Internal dependencies
 */
import { useDeviceEditorClasses } from './use-device-editor-classes'
import { fixFractionWidths, getSnapWidths } from './get-snap-widths'
import { AdvancedTextControl } from '..'
import { ColumnShowTooltipContext } from '../column-inner-blocks'

/**
 * External dependencies
 */
import {
	useBlockContext,
	useDeviceType,
	useEditorDom,
	useWithShift,
} from '~stackable/hooks'
import { clamp, isEqual } from 'lodash'
import classnames from 'classnames'
import { i18n } from 'stackable'
import { getRowsFromColumns } from '~stackable/block-components/column/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { ResizableBox, Popover } from '@wordpress/components'
import {
	Fragment, useState, useEffect, useRef, useCallback, useMemo, memo, useContext,
} from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const MIN_COLUMN_WIDTH = 30

const MIN_COLUMN_WIDTH_PERCENTAGE = {
	Desktop: 5,
	Tablet: 10,
	Mobile: 10,
}

const ResizableColumn = props => {
	const { clientId } = useBlockEditContext()
	const blockContext = useBlockContext()
	const editorDom = useEditorDom()

	const {
		isFirstBlock, isLastBlock, isOnlyBlock, adjacentBlocks, blockIndex, parentBlock,
	} = blockContext

	// Block context is provided from the parent Columns block.
	const allowResize = ! props.context[ 'stackable/columnFit' ]

	// This is used to add editor classes based on the preview device type.
	// Mainly for generating editor styles.
	const deviceType = useDeviceType()
	useDeviceEditorClasses()

	const [ currentWidths, setCurrentWidths ] = useState( [] )
	const [ currentWidth, setCurrentWidth ] = useState( '' )
	const [ newWidthsPercent, setNewWidthsPercent ] = useState( [] )
	const [ maxWidth, setMaxWidth ] = useState( 2000 )
	const [ tempStyles, setTempStyles ] = useState( '' )
	const [ snapWidths, setSnapWidths ] = useState( null )

	const isDesktop = deviceType === 'Desktop'
	const isTablet = deviceType === 'Tablet'

	// Reset the column widths in desktop if a column was added / removed.
	const [ prevAdjacentBlocks, setPrevAdjacentBlocks ] = useState( adjacentBlocks?.length )
	useEffect( () => {
		// This will be zero when editor/content initializes, ignore this since
		// it might trigger a reset on all column widths when you first load the
		// editor.
		if ( ! prevAdjacentBlocks || ! adjacentBlocks?.length ) {
			// Remember the previous block length.
			setPrevAdjacentBlocks( adjacentBlocks?.length )
			return
		}

		if ( prevAdjacentBlocks !== adjacentBlocks?.length ) {
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
		props.className,
	] )
	const {
		columnGap, columnGapTablet, columnGapMobile,
	} = ( parentBlock?.attributes || {} )

	const enable = useMemo( () => ( {
		top: false,
		right: deviceType === 'Desktop' ? ! isOnlyBlock && ! isLastBlock : ! isOnlyBlock,
		bottom: false,
		left: deviceType === 'Desktop' ? ! isOnlyBlock && ! isFirstBlock : false,
		topRight: false,
		bottomRight: false,
		bottomLeft: false,
		topLeft: false,
	} ), [ deviceType, isOnlyBlock, isLastBlock, isFirstBlock ] )

	const onResizeStart = useCallback( ( _event, _direction ) => {
		// toggleSelection( false )

		// Get the column gap amounts, we need these to calculate percentages when resizing columns.
		const parentColumnGaps = {
			desktop: columnGap || 0,
			tablet: columnGapTablet || columnGap || 0,
			mobile: columnGapMobile || columnGapTablet || columnGap || 0,
		}

		// In desktop, get all the column widths.
		if ( isDesktop ) {
			// In desktop, the column gaps will affect the width of the parent column, take it into account.
			const totalColumnGap = parentColumnGaps.desktop * ( adjacentBlocks.length - 1 )

			// Get the current pixel width of the columns.
			const parentEl = editorDom.querySelector( `[data-block="${ parentBlock.clientId }"]` )
			const parentWidth = parentEl.clientWidth - totalColumnGap
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
				const blockEl = editorDom.querySelector( `[data-block="${ clientId }"]` )
				return blockEl?.clientWidth || 0
			} )
			setCurrentWidths( columnWidths )

			// Set the maximum width for the current column. The max
			// width depends on the adjacent block, the adjacent should
			// not go past the minimum.
			const adjacentBlockIndex = _direction === 'right' ? blockIndex + 1 : blockIndex - 1
			const maxWidth = columnWidths[ blockIndex ] + ( columnWidths[ adjacentBlockIndex ] - MIN_COLUMN_WIDTH )
			setMaxWidth( maxWidth )

		// Tablet and mobile.
		} else {
			// Get the current pixel width of the columns.
			const columnWidths = adjacentBlocks.map( ( { attributes } ) => {
				return attributes.columnWidthTablet || attributes.columnWidth || 100 / adjacentBlocks.length
			} )
			setCurrentWidths( columnWidths )

			// Get the current pixel width of the columns.
			const blockEl = editorDom.querySelector( `[data-block="${ clientId }"]` )
			const columnWidth = blockEl?.clientWidth || 0
			setCurrentWidth( columnWidth )

			// The maximum width is the total width of the row.
			const parentEl = editorDom.querySelector( `[data-block="${ parentBlock.clientId }"]` )
			const maxWidth = parentEl?.clientWidth || 0
			setMaxWidth( maxWidth )
		}

		setIsTooltipOver( true )
	}, [ isDesktop, parentBlock?.clientId, adjacentBlocks, blockIndex, clientId, columnGap, columnGapTablet, columnGapMobile, editorDom ] )

	const onResize = useCallback( ( _event, _direction, elt, delta ) => {
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
			// Fix the widths, ensure that we don't end up with off numbers 49.9% and 50.1%.
			columnPercentages = fixFractionWidths( columnPercentages, isShiftKey )

			const totalCurrentWidth = columnPercentages.reduce( ( a, b ) => a + b, 0 )
			if ( totalCurrentWidth !== 100 ) {
				columnPercentages[ adjacentBlockIndex ] = parseFloat( ( columnPercentages[ adjacentBlockIndex ] + 100 - totalCurrentWidth ).toFixed( 1 ) )
			}

			setNewWidthsPercent( columnPercentages )

			// Add the temporary styles for our column widths.
			const columnStyles = columnPercentages.map( ( width, i ) => {
				return `.editor-styles-wrapper [data-block][data-block="${ adjacentBlocks[ i ].clientId }"] {
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
			const newWidth = currentWidth + delta.width
			columnPercentages = clamp( parseFloat( ( newWidth / maxWidth * 100 ).toFixed( 1 ) ), 0, 100 )

			setNewWidthsPercent( columnPercentages )

			// Take into account the number of adjacent columns per row
			const widths = [ ...currentWidths ]
			widths[ blockIndex ] = columnPercentages
			const columnRows = getRowsFromColumns( widths )
			const adjacentColumnCount = columnRows.filter( n => n === columnRows[ blockIndex ] ).length

			// Add the temporary styles for our column widths.
			const columnStyles = `.editor-styles-wrapper [data-block][data-block="${ clientId }"] {
					flex: 1 1 calc(${ columnPercentages }% - var(--stk-column-gap, 0px) * ${ adjacentColumnCount - 1 } / ${ adjacentColumnCount } ) !important;
					max-width: calc(${ columnPercentages }% - var(--stk-column-gap, 0px) * ${ adjacentColumnCount - 1 } / ${ adjacentColumnCount } ) !important;
				}
				[data-block="${ clientId }"] .stk-resizable-column__size-tooltip {
					--width: '${ columnPercentages.toFixed( 1 ) }%' !important;
				}`
			setTempStyles( columnStyles )

			// Set snap widths. We need to do this here not on
			// ResizeStart or it won't be used at first drag.
			if ( ! snapWidths ) {
				setSnapWidths( { x: getSnapWidths( [ 100 ], 0, maxWidth, _direction, isShiftKey ) } )
			}
		}
	}, [ isDesktop, currentWidths, currentWidth, blockIndex, adjacentBlocks, isShiftKey, maxWidth, clientId, snapWidths ] )

	const onResizeStop = useCallback( ( _event, _direction, elt, delta ) => {
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
				// Get the current column widths for tablet.
				const columnWidths = adjacentBlocks.map( ( { attributes } ) => {
					return attributes.columnWidthTablet || attributes.columnWidth || 100 / adjacentBlocks.length
				} )
				columnWidths[ blockIndex ] = newWidthsPercent

				props.onChangeTablet( newWidthsPercent, columnWidths, blockIndex )
			} else {
				// Get the current column widths for mobile.
				const columnWidths = adjacentBlocks.map( ( { attributes } ) => {
					return attributes.columnWidthMobile || 100
				} )
				columnWidths[ blockIndex ] = newWidthsPercent
				props.onChangeMobile( newWidthsPercent, columnWidths, blockIndex )
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
		setIsTooltipOver( false )
	}, [ isDesktop, isTablet, newWidthsPercent, props.onChangeDesktop, props.onChangeTablet, props.onChangeMobile, tempStyles, adjacentBlocks, blockIndex, isMounted ] )

	const onTooltipChange = useCallback( width => {
		if ( width !== '' && width < MIN_COLUMN_WIDTH_PERCENTAGE[ deviceType ] ) {
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
		} else if ( isTablet ) {
			// Get the current column widths.
			const columnWidths = adjacentBlocks.map( ( { attributes } ) => {
				return attributes.columnWidthTablet || attributes.columnWidth || 100 / adjacentBlocks.length
			} )

			// Tablet and Mobile.
			const finalWidth = width ? clamp( width, MIN_COLUMN_WIDTH_PERCENTAGE[ deviceType ], 100 ) : ''

			columnWidths[ blockIndex ] = finalWidth

			props.onChangeTablet( finalWidth, columnWidths, blockIndex )
		} else {
			// Get the current column widths.
			const columnWidths = adjacentBlocks.map( ( { attributes } ) => {
				return attributes.columnWidthMobile || 100
			} )

			// Tablet and Mobile.
			const finalWidth = width ? clamp( width, MIN_COLUMN_WIDTH_PERCENTAGE[ deviceType ], 100 ) : ''

			columnWidths[ blockIndex ] = finalWidth

			props.onChangeMobile( finalWidth, columnWidths, blockIndex )
		}
	}, [ deviceType, isDesktop, isTablet, adjacentBlocks, blockIndex ] )

	/**
	 * Tooltip context stuff to display all tooltip widths across all sibling columns.
	 */
	const [ isTooltipPopupOpen, setIsTooltipPopupOpen ] = useState( false )
	const [ isTooltipOver, setIsTooltipOver ] = useState( false )
	const onTooltipMouseEnter = useCallback( () => setIsTooltipOver( true ), [] )
	const onTooltipMouseLeave = useCallback( () => setIsTooltipOver( false ), [] )
	const { showColumnTooltip, setShowColumnTooltip } = useContext( ColumnShowTooltipContext )

	// IF the width popup was opened, let the parent columns block know to
	// display all the tooltip widths.
	const onTooltipTogglePopup = useCallback( isOpen => {
		setIsTooltipPopupOpen( isOpen )
		if ( isOpen ) {
			setShowColumnTooltip( clientId )
		} else if ( ! isTooltipOver && showColumnTooltip === clientId ) {
			setShowColumnTooltip( false )
		}
	}, [ showColumnTooltip, setShowColumnTooltip, setIsTooltipPopupOpen, isTooltipOver, clientId ] )

	// If the invisible tooltip was hovered, let the parent columns block know
	// to display all the tooltip widths.
	useEffect( () => {
		if ( ! isTooltipPopupOpen ) {
			if ( isTooltipOver && ! showColumnTooltip ) {
				setShowColumnTooltip( clientId )
			} else if ( ! isTooltipOver && showColumnTooltip === clientId ) {
				setShowColumnTooltip( false )
			}
		}
	}, [ showColumnTooltip, setShowColumnTooltip, isTooltipOver, isTooltipPopupOpen, clientId ] )

	return (
		<ResizableBox
			enable={ enable }
			minWidth="30" // Need to use String here or else ResizableBox will not snap properly when coming from the minimum width.
			minHeight="30"
			maxWidth={ maxWidth }
			className={ className }
			showHandle={ allowResize ? props.showHandle : false }
			snap={ snapWidths }
			snapGap={ 20 }
			onResizeStart={ onResizeStart }
			onResize={ onResize }
			onResizeStop={ onResizeStop }
		>
			{ allowResize && <ResizableTooltip
				isVisible={ ! isOnlyBlock }
				blockContext={ blockContext }
				value={ isDesktop ? props.columnWidth
					: isTablet ? ( props.columnWidthTablet || props.columnWidth )
						: props.columnWidthMobile }
				onChange={ onTooltipChange }
				onTogglePopup={ onTooltipTogglePopup }
				tooltipProps={ {
					onMouseEnter: onTooltipMouseEnter,
					onMouseLeave: onTooltipMouseLeave,
				} }
			/> }
			{ tempStyles && <style>{ tempStyles }</style> }
			{ props.children }
		</ResizableBox>
	)
}

const ResizableTooltip = memo( props => {
	const {
		adjacentBlocks, isOnlyBlock, blockIndex, isLastBlock, isFirstBlock,
	} = props.blockContext

	const deviceType = useDeviceType()
	const [ isEditWidth, setIsEditWidth ] = useState( false )
	const [ originalInputValue, setOriginalInputValue ] = useState( '' )
	const [ currentInputValue, setCurrentInputValue ] = useState( '' )
	const popupRef = useRef()
	const tooltipRef = useRef()

	// Compute the default column label value if none is available.
	const columnLabel = useMemo( () => {
		if ( typeof adjacentBlocks !== 'undefined' && ! props.value && ! originalInputValue ) {
			// The columns are evenly distributed by default.
			if ( deviceType === 'Desktop' ) {
				const value = ( 100 / adjacentBlocks.length ).toFixed( 1 )
				if ( value.toString() === '33.3' ) {
					return 33.33
				}
				return value
			}
			// In mobile, the columns are  "auto" so that we don't display
			// inaccurate percentage widths.
			if ( deviceType === 'Tablet' ) {
				return __( 'Auto', i18n )
			}
			// In mobile, the columns collapse to 100%.
			return 100.0
		}

		return ``
	}, [ adjacentBlocks?.length, props.value, originalInputValue, deviceType ] )

	// Create the label of the tooltip.
	const tooltipLabel = useMemo( () => {
		const label = ( props.value ? parseFloat( props.value ).toFixed( 1 ) : '' ) || originalInputValue || columnLabel
		return label !== __( 'Auto', i18n ) ? `'${ label }%'` : `'${ label }'`
	}, [ props.value, originalInputValue, columnLabel ] )

	// Setup the input field when the popup opens.
	useEffect( () => {
		if ( props.onTogglePopup ) {
			props.onTogglePopup( isEditWidth )
		}
		if ( isEditWidth ) {
			setOriginalInputValue( props.value )
			setCurrentInputValue( props.value || ( columnLabel !== __( 'Auto', i18n ) ? columnLabel : '' ) )

			// When the manual entry opens, select the whole value.
			setTimeout( () => {
				popupRef.current?.querySelector( 'input' ).select()
			}, 1 )
		}
	}, [ isEditWidth ] )

	// Opens the manual entry for the next column.
	const openNextColumn = useCallback( ( direction = 'right' ) => {
		if ( ! window.CustomEvent ) {
			return
		}
		if ( direction === 'right' ) {
			// Open the popup of the column on the right.
			const nextIndex = ! isLastBlock ? blockIndex + 1 : 0
			const nextTooltip = tooltipRef.current.closest( '.stk-row' ).querySelectorAll( '.stk-resizable-column__size-tooltip' )[ nextIndex ]
			nextTooltip?.dispatchEvent( new window.CustomEvent( 'openColumnInputPopup' ) )
		} else {
			// Open the popup of the column on the left.
			const prevIndex = ! isFirstBlock ? blockIndex - 1 : adjacentBlocks.length - 1
			const prevTooltip = tooltipRef.current.closest( '.stk-row' ).querySelectorAll( '.stk-resizable-column__size-tooltip' )[ prevIndex ]
			prevTooltip?.dispatchEvent( new window.CustomEvent( 'openColumnInputPopup' ) )
		}
	}, [
		tooltipRef.current,
		adjacentBlocks?.map( ( { clientId } ) => clientId ).join( ',' ), // Dependency is the arrangement of the columns.
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
	}, [ tooltipRef.current, openColumnInputPopupListener ] )

	return (
		<Fragment>
			{ ! isOnlyBlock && isEditWidth &&
				<Popover
					className="stk-resizable-column__popup"
					anchorRef={ tooltipRef.current }
					position="bottom right"
					onFocusOutside={ event => {
						if ( event.relatedTarget !== tooltipRef.current ) {
							setIsEditWidth( false )
						}
					} }
				>
					<div ref={ popupRef }>
						<AdvancedTextControl
							label={ __( 'Column', i18n ) }
							className="stk-resizable-column__input"
							value={ currentInputValue }
							allowReset={ false }
							onChange={ value => {
								const resetValue = deviceType === 'Desktop' ? originalInputValue : ''
								const newValue = clamp( value, 0, 100 ) || resetValue
								if ( newValue === '' ) {
									setOriginalInputValue( '' )
								}
								props.onChange( newValue )
								setCurrentInputValue( value )
							} }
							onKeyDown={ event => {
								// When hitting tab, open the next column popup.
								if ( event.keyCode === 9 ) {
									openNextColumn( event.shiftKey ? 'left' : 'right' )
									event.stopPropagation()
									event.preventDefault()
								}
							} }
							placeholder={ originalInputValue || columnLabel || props.value }
						/>
					</div>
				</Popover>
			}
			{
				! isOnlyBlock && (
					<div
						{ ...props.tooltipProps }
						className="stk-resizable-column__size-tooltip"
						ref={ tooltipRef }
						style={ { '--width': tooltipLabel } }
						onMouseDown={ ev => {
							setIsEditWidth( ! isEditWidth )
							ev.preventDefault()
						} }
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
} )

ResizableTooltip.defaultProps = {
	isVisible: true,
	blockContext: {},
	value: '',
	onChange: () => {},
	tooltipProps: {},
	onTogglePopup: null,
}

ResizableColumn.defaultProps = {
	className: '',
	context: null,
	showHandle: true,
	columnWidth: '',
	columnWidthTablet: '',
	columnWidthMobile: '',
	onChangeDesktop: () => {},
	onChangeTablet: () => {},
	onChangeMobile: () => {},
	onResetDesktop: () => {},
}

export default memo( ResizableColumn )
