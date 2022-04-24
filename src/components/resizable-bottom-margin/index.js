/**
 * Internal dependencies
 */
import { useControlHandlers } from '../base-control2/hooks'
import { getAttributeName } from '~stackable/util'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { range } from 'lodash'
import {
	useBlockAttributes, useDeviceType, useUpdateEvent, useWithShift,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import {
	useState, useEffect, useCallback, memo, useMemo,
} from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import { ResizableBox } from '@wordpress/components'
import { useBlockEditContext } from '@wordpress/block-editor'
import { getBlockVariations } from '@wordpress/blocks'

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

const HANDLE_STYLES = {
	bottom: {
		height: '100%', // Ensure the bottom handle occupies the entire area.
	},
}
const ENABLE = {
	top: false,
	right: false,
	bottom: true,
	left: false,
}

const ResizableBottomMarginSingle = props => {
	const [ preResizeHeight, setPreResizeHeight ] = useState( 0 )
	const [ resizingHeight, setResizingHeight ] = useState( null )
	const [ isResizing, setIsResizing ] = useState( false )

	const [ snapWidths, setSnapWidths ] = useState( SNAP_HEIGHTS )
	const isShiftKey = useWithShift()
	useEffect( () => {
		setSnapWidths( null )
	}, [ isShiftKey ] )

	// Allow other developers to override the default bottom margin value.
	const deviceType = useDeviceType()
	const defaultBottomMargin = applyFilters( 'stackable.resizable-bottom-margin.default', DEFAULT_BOTTOM_MARGINS[ deviceType ] )
	// Allow this component to be rerendered externalls (e.g. by setting the bottom margin in the design system)
	useUpdateEvent( 'stackable.resizable-bottom-margin' )

	const classNames = classnames( [
		'stk-resizable-bottom-margin',
	], {
		'stk--is-resizing': isResizing,
		'stk--is-tiny': ( props.value !== '' ? props.value : defaultBottomMargin ) < 5,
	} )

	const currentHeight = props.value || props.value === 0 ? props.value : defaultBottomMargin

	const size = useMemo( () => {
		return { height: currentHeight }
	}, [ currentHeight ] )

	return (
		<ResizableBox
			className={ classNames }
			minHeight="0"
			handleStyles={ HANDLE_STYLES }
			enable={ ENABLE }
			size={ size }
			snap={ snapWidths }
			snapGap={ 5 }
			onResizeStart={ () => {
				setPreResizeHeight( currentHeight )
				setResizingHeight( currentHeight )
				setIsResizing( true )
			} }
			onResize={ ( _event, _direction, elt, delta ) => {
				setResizingHeight( preResizeHeight + delta.height )

				// Set snap widths. We need to do this here not on
				// ResizeStart or it won't be used at first drag.
				if ( ! snapWidths ) {
					setSnapWidths( getSnapWidths( isShiftKey ) )
				}
			} }
			onResizeStop={ () => {
				props.onChange( resizingHeight === defaultBottomMargin ? '' : resizingHeight )
				setIsResizing( false )
			} }
		>
			{ props.previewSelector && isResizing &&
				// .editor-styles-wrapper so that our styles will override the currently set margin.
				<style>{ `.editor-styles-wrapper ${ props.previewSelector } { margin-bottom: ${ resizingHeight }px !important; }` }</style>
			}
			<span className="stk-resizable-bottom-margin__label">
				{ `${ isResizing ? resizingHeight : currentHeight }px` }
			</span>
		</ResizableBox>
	)
}

ResizableBottomMarginSingle.defaultProps = {
	previewSelector: '',
	value: '',
	onChange: () => {},
}

const changeCallback = ( value, originalValue ) => {
	return {
		...( originalValue || {} ),
		bottom: value,
	}
}

const ResizableBottomMargin = memo( props => {
	const { clientId, name } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )
	const device = useDeviceType()

	const valueCallback = useCallback( _value => {
		let value = _value?.bottom || _value?.bottom === 0 ? _value?.bottom : ''

		// If there's a value already, use that. Or check the other inherited values.
		if ( value || value === 0 ) {
			return value
		}

		// Try and get an inherited value (e.g. if no tablet is supplied, get the desktop value)
		const deviceSteps = device === 'Mobile' ? [ 'mobile', 'tablet', 'desktop' ]
			: device === 'Tablet' ? [ 'tablet', 'desktop' ]
				: [ 'desktop' ]

		deviceSteps.some( device => {
			const _value = attributes[ getAttributeName( props.attribute, device ) ]
			if ( _value !== '' && typeof _value !== 'undefined' ) {
				value = value = _value?.bottom || _value?.bottom === 0 ? _value?.bottom : ''
				if ( value || value === 0 ) {
					return true
				}
			}
			return false
		} )

		return value
	}, [ props.attribute, attributes, device ] )

	const [ value, onChange ] = useControlHandlers( props.attribute, props.responsive, false, valueCallback, changeCallback )

	// Don't show margin bottom handler if the user is picking a layout.
	const hasVariations = getBlockVariations( name ).length > 0
	if ( ! attributes.uniqueId && hasVariations ) {
		return null
	}

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
	attribute: '',
	responsive: false,
}

export default ResizableBottomMargin
