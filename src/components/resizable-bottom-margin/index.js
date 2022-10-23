/**
 * Internal dependencies
 */
import { getAttributeName } from '~stackable/util'
import {
	useBlockSetAttributesContext,
	useDeviceType,
	useWithShift,
} from '~stackable/hooks'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { range } from 'lodash'

/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element'
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

	const height = props.value || props.value === 0 ? props.value : defaultBottomMargin

	return (
		<ResizableBox
			className={ classNames }
			minHeight="0"
			handleStyles={ HANDLE_STYLES }
			enable={ ENABLE }
			size={ { height } }
			snap={ snapWidths }
			snapGap={ 5 }
			onResizeStart={ () => {
				setCurrentHeight( height )
				setIsResizing( true )
			} }
			onResize={ ( _event, _direction, elt, delta ) => {
				setCurrentHeight( height + delta.height )

				// Set snap widths. We need to do this here not on
				// ResizeStart or it won't be used at first drag.
				if ( ! snapWidths ) {
					setSnapWidths( getSnapWidths( isShiftKey ) )
				}
			} }
			onResizeStop={ () => {
				props.onChange( parseInt( currentHeight, 10 ) === parseInt( defaultBottomMargin, 10 ) ? '' : parseInt( currentHeight, 10 ) )
				setCurrentHeight( null )
				setIsResizing( false )
			} }
		>
			{ props.previewSelector && isResizing &&
				// .editor-styles-wrapper so that our styles will override the currently set margin.
				<style>{ `.editor-styles-wrapper ${ props.previewSelector } { margin-bottom: ${ currentHeight }px !important; }` }</style>
			}
			<span className="stk-resizable-bottom-margin__label">
				{ `${ isResizing ? currentHeight : height }px` }
			</span>
		</ResizableBox>
	)
}

ResizableBottomMarginSingle.defaultProps = {
	previewSelector: '',
	value: '',
	onChange: () => {},
}

const ResizableBottomMargin = props => {
	const setAttributes = useBlockSetAttributesContext()
	const deviceType = useDeviceType()
	const attrName = getAttributeName( props.attribute, deviceType )

	let value = props[ attrName ]?.bottom

	if ( deviceType === 'Mobile' ) {
		if ( typeof value === 'undefined' || value === '' ) {
			const attrNameTablet = getAttributeName( props.attribute, 'Tablet' )
			value = props[ attrNameTablet ]?.bottom
		}
	}

	if ( deviceType === 'Tablet' || deviceType === 'Mobile' ) {
		if ( typeof value === 'undefined' || value === '' ) {
			const attrNameDesktop = getAttributeName( props.attribute, 'Desktop' )
			value = props[ attrNameDesktop ]?.bottom
		}
	}

	const onChange = _value => {
		setAttributes( {
			[ attrName ]: {
				...props[ attrName ],
				bottom: _value,
			},
		} )
	}

	return (
		<ResizableBottomMarginSingle
			previewSelector={ props.previewSelector }
			value={ value }
			onChange={ onChange }
		/>
	)
}

ResizableBottomMargin.defaultProps = {
	previewSelector: '', // Selector of the element where the margin is applied e.g. .stk-card-group
	attribute: '',
	responsive: false,
}

export default ResizableBottomMargin
