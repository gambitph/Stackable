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
import {
	useState, useEffect, useRef,
} from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'
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
	const { deviceType } = props
	const { name } = useBlockEditContext()
	const [ currentHeight, setCurrentHeight ] = useState( null )
	const [ currentTop, setCurrentTop ] = useState( null )
	const [ isResizing, setIsResizing ] = useState( false )
	const resizableBoxRef = useRef( null )

	const [ snapWidths, setSnapWidths ] = useState( SNAP_HEIGHTS )
	const isShiftKey = useWithShift()
	useEffect( () => {
		setSnapWidths( null )
	}, [ isShiftKey ] )

	// Allow other developers to override the default bottom margin value.
	const defaultBottomMargin = applyFilters( 'stackable.resizable-bottom-margin.default', DEFAULT_BOTTOM_MARGINS[ deviceType ], name )

	const classNames = classnames( [
		'stk-resizable-bottom-margin',
	], {
		'stk--is-resizing': currentHeight !== null,
		'stk--is-tiny': ( props.value !== '' ? props.value : defaultBottomMargin ) < 5,
	} )

	const unit = props.value || props.value === 0 ? props.unit : 'px'
	const height = props.value || props.value === 0 ? props.value : defaultBottomMargin

	// Get resizable box initial height in pixels
	const getSize = delta => {
		if ( unit === '%' && resizableBoxRef.current ) {
			// use parent width because the margin in percentage is calculated by the parent's width
			// reference: https://medium.com/coding-blocks/css-padding-a-magic-wand-2b8a66b84ebe#:~:text=Margin%20and%20Padding%20in%20percentages,height%20of%20the%20parent%20element.
			const parentWidth = resizableBoxRef.current.getParentSize().width
			return {
				height: ( ( height / 100 ) * parentWidth ) + delta, // delta is already in px
				delta: ( ( delta / parentWidth ) * 100 ), // convert delta to percent
			}
		}
		return { height, delta }
	}

	return (
		<ResizableBox
			ref={ resizableBoxRef }
			className={ classNames }
			minHeight="0"
			handleStyles={ HANDLE_STYLES }
			enable={ ENABLE }
			size={ { height: getSize( 0 ).height } }
			snap={ snapWidths }
			snapGap={ 5 }
			onResizeStart={ () => {
				// Get the current top position of the resizable box because resizing gets choppy
				if ( resizableBoxRef.current && resizableBoxRef.current.resizable && resizableBoxRef.current.resizable.closest( '.wp-block' ) ) {
					setCurrentTop( resizableBoxRef.current.resizable.getBoundingClientRect().top - resizableBoxRef.current.resizable.closest( '.wp-block' ).getBoundingClientRect().top )
				} else {
					setCurrentTop( null )
				}

				setCurrentHeight( height )
				setIsResizing( true )
			} }
			onResize={ ( _event, _direction, elt, delta ) => {
				let _delta = delta.height
				if ( unit === '%' ) {
					// height and delta.height is in %, so we need to convert them to pixels
					const { height: heightInPixels, delta: deltaPercent } = getSize( _delta )
					_delta = deltaPercent
					elt.style.height = `${ heightInPixels }px`
				}

				// Fix the top of the margin top so that it doesn't look jittery when resizing.
				if ( currentTop !== null ) {
					elt.style.top = `${ currentTop }px`
				}

				setCurrentHeight( height + _delta )

				// Set snap widths. We need to do this here not on
				// ResizeStart or it won't be used at first drag.
				if ( ! snapWidths ) {
					setSnapWidths( getSnapWidths( isShiftKey ) )
				}
			} }
			onResizeStop={ ( _event, _direction, elt ) => {
				elt.style.top = ''
				props.onChange( parseInt( currentHeight, 10 ) === parseInt( defaultBottomMargin, 10 ) && unit === 'px' ? '' : parseInt( currentHeight, 10 ) )

				setCurrentHeight( null )
				setIsResizing( false )
			} }
		>
			{ props.previewSelector && isResizing &&
				// .editor-styles-wrapper so that our styles will override the currently set margin.
				<style>{ `.editor-styles-wrapper ${ props.previewSelector } { margin-bottom: ${ currentHeight }${ unit } !important; }` }</style>
			}
			<span className="stk-resizable-bottom-margin__label">
				{ `${ isResizing ? parseInt( currentHeight, 10 ) : height }${ unit }` }
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
	const unitAttrName = getAttributeName( `${ props.attribute }Unit`, deviceType )

	let value = props[ attrName ]?.bottom
	let unit = props[ unitAttrName ]

	if ( deviceType === 'Mobile' ) {
		if ( typeof value === 'undefined' || value === '' ) {
			const attrNameTablet = getAttributeName( props.attribute, 'Tablet' )
			const unitAttrNameTablet = getAttributeName( `${ props.attribute }Unit`, 'Tablet' )
			value = props[ attrNameTablet ]?.bottom
			unit = props[ unitAttrNameTablet ]
		}
	}

	if ( deviceType === 'Tablet' || deviceType === 'Mobile' ) {
		if ( typeof value === 'undefined' || value === '' ) {
			const attrNameDesktop = getAttributeName( props.attribute, 'Desktop' )
			const unitAttrNameDesktop = getAttributeName( `${ props.attribute }Unit`, 'Desktop' )
			value = props[ attrNameDesktop ]?.bottom
			unit = props[ unitAttrNameDesktop ]
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
			deviceType={ deviceType }
			previewSelector={ props.previewSelector }
			value={ value }
			unit={ unit }
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
