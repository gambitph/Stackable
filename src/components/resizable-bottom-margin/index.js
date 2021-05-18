/**
 * External dependencies
 */
import classnames from 'classnames'
import { range } from 'lodash'
import { useDeviceType, useWithShift } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import {
	useState, useEffect, useCallback, memo,
} from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import { ResizableBox } from '@wordpress/components'

const DEFAULT_BOTTOM_MARGINS = {
	Desktop: 24,
	Tablet: 24,
	Mobile: 16,
}

const SNAP_HEIGHTS = range( 50, 1001, 50 )
const SNAP_HEIGHTS_TENS = range( 8, 1001, 8 )

const getSnapWidths = ( isShiftKey = false ) => {
	return { y: ! isShiftKey ? SNAP_HEIGHTS : SNAP_HEIGHTS_TENS }
}

const ResizableBottomMarginSingle = props => {
	const [ initialHeight, setInitialHeight ] = useState( 0 )
	const [ currentHeight, setCurrentHeight ] = useState( null )
	const [ isResizing, setIsResizing ] = useState( false )

	const [ snapWidths, setSnapWidths ] = useState( SNAP_HEIGHTS )
	const isShiftKey = useWithShift()
	useEffect( () => {
		setSnapWidths( null )
	}, [ isShiftKey ] )

	// Allow other developers to override the default bottom margin value.
	const deviceType = useDeviceType()
	const defaultBottomMargin = applyFilters( 'stackable.resizable-bottom-margin.default', DEFAULT_BOTTOM_MARGINS[ deviceType ] )

	const classNames = classnames( [
		'stk-resizable-bottom-margin',
	], {
		'stk--is-resizing': currentHeight !== null,
		'stk--is-tiny': ( props.value !== '' ? props.value : defaultBottomMargin ) < 5,
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
			onResize={ ( _event, _direction, elt, delta ) => {
				setCurrentHeight( initialHeight + delta.height )

				// Set snap widths. We need to do this here not on
				// ResizeStart or it won't be used at first drag.
				if ( ! snapWidths ) {
					setSnapWidths( getSnapWidths( isShiftKey ) )
				}
			} }
			onResizeStop={ () => {
				props.onChange( currentHeight === defaultBottomMargin ? '' : currentHeight )
				setCurrentHeight( null )
				setIsResizing( false )
			} }
		>
			{ props.previewSelector && isResizing &&
				// #editor so that our styles will override the currently set margin.
				<style>{ `#editor ${ props.previewSelector } { margin-bottom: ${ currentHeight }px !important; }` }</style>
			}
			<span className="stk-resizable-bottom-margin__label">
				{ `${ isResizing ? currentHeight : ( props.value !== '' ? props.value : defaultBottomMargin ) }px` }
			</span>
		</ResizableBox>
	)
}

ResizableBottomMarginSingle.defaultProps = {
	previewSelector: '',
	value: '',
	onChange: () => {},
}

const ResizableBottomMargin = memo( props => {
	const deviceType = useDeviceType()
	const isDesktop = deviceType === 'Desktop'
	const isMobile = deviceType === 'Mobile'

	let value = props.valueDesktop // props[ `value${ deviceType }` ]
	if ( ! isDesktop && props.valueTablet !== '' ) {
		value = props.valueTablet
	}
	if ( isMobile && props.valueMobile !== '' ) {
		value = props.valueMobile
	}

	const onChange = useCallback( value => {
		const callback = props[ `onChange${ deviceType }` ]
		if ( callback ) {
			callback( value )
		}
	}, [ deviceType, props.onChangeDesktop, props.onChangeTablet, props.onChangeMobile ] )

	return (
		<ResizableBottomMarginSingle
			previewSelector={ props.previewSelector }
			value={ value }
			onChange={ onChange }
		/>
	)
} )

ResizableBottomMargin.defaultProps = {
	previewSelector: '', // Selector of the element where the margin is applied e.g. .stk-card-group
	valueDesktop: '',
	valueTablet: '',
	valueMobile: '',
	onChangeDesktop: null,
	onChangeTablet: null,
	onChangeMobile: null,
}

export default ResizableBottomMargin
