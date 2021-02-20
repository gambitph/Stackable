/**
 * External dependencies
 */
import classnames from 'classnames'
import { range } from 'lodash'
import { useWithShift } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import { ResizableBox } from '@wordpress/components'

const DEFAULT_BOTTOM_MARGIN = 24

const SNAP_HEIGHTS = range( 50, 1001, 50 )
const SNAP_HEIGHTS_TENS = range( 5, 1001, 5 )

const getSnapWidths = ( isShiftKey = false ) => {
	return { y: ! isShiftKey ? SNAP_HEIGHTS : SNAP_HEIGHTS_TENS }
}

const ResizableBottomMargin = props => {
	const [ initialHeight, setInitialHeight ] = useState( 0 )
	const [ currentHeight, setCurrentHeight ] = useState( null )
	const [ isResizing, setIsResizing ] = useState( false )

	const [ snapWidths, setSnapWidths ] = useState( SNAP_HEIGHTS )
	const isShiftKey = useWithShift()
	useEffect( () => {
		setSnapWidths( null )
	}, [ isShiftKey ] )

	// Allow other developers to override the default bottom margin value.
	const defaultBottomMargin = applyFilters( 'stackable.resizable-bottom-margin.default', DEFAULT_BOTTOM_MARGIN )

	const classNames = classnames( [
		'stk-resizable-bottom-margin',
	], {
		'stk--is-resizing': currentHeight !== null,
	} )

	return (
		<ResizableBox
			className={ classNames }
			minHeight="0"
			handleStyles={ {
				bottom: {
					height: '100%', // Ensure the bottom handle occupies the entire area.
				},
			} }
			enable={ {
				top: false,
				right: false,
				bottom: true,
				left: false,
			} }
			size={ {
				height: props.value || props.value === 0 ? props.value : defaultBottomMargin,
			} }
			snap={ snapWidths }
			snapGap={ 5 }
			onResizeStart={ () => {
				let currentMargin = props.value ? parseFloat( props.value ) : 0
				if ( ! props.value ) {
					const el = document.querySelector( props.previewSelector )
					if ( el ) {
						currentMargin = parseFloat( window.getComputedStyle( el ).marginBottom )
					}
				}
				setInitialHeight( currentMargin || 0 )
				setIsResizing( true )
				setCurrentHeight( currentMargin || 0 )
			} }
			// showHandle={ false }
			onResize={ ( _event, _direction, elt, delta ) => {
				setCurrentHeight( initialHeight + delta.height )

				// Set snap widths. We need to do this here not on
				// ResizeStart or it won't be used at first drag.
				if ( ! snapWidths ) {
					setSnapWidths( getSnapWidths( isShiftKey ) )
				}
			} }
			onResizeStop={ () => {
				props.onChange( currentHeight )
				setCurrentHeight( null )
				setIsResizing( false )
			} }
		>
			{ props.previewSelector && isResizing &&
				<style>{ `${ props.previewSelector } { margin-bottom: ${ currentHeight }px !important; }` }</style>
			}
			<span className="stk-resizable-bottom-margin__label">{ `${ isResizing ? currentHeight : ( props.value || defaultBottomMargin ) }px` }</span>
		</ResizableBox>
	)
}

ResizableBottomMargin.defaultProps = {
	previewSelector: '',
	value: '',
	onChange: () => {},
}

export default ResizableBottomMargin
