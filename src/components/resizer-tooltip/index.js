/**
 * Internal dependencies
 */
import { AdvancedTextControl, Popover } from '~stackable/components'
import ArrowDownSvg from './images/arrow-down.svg'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { clamp } from 'lodash'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { BaseControl } from '@wordpress/components'
import {
	Fragment, useState, useEffect, useRef,
} from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'

const clampSize = ( value, unit = '%' ) => {
	let ret
	if ( unit === '%' ) {
		ret = clamp( value, 5, 100 )
	}
	ret = Math.max( value, 5 )
	return isNaN( ret ) ? '' : ret
}

// This is in charge of converting px <-> % sizes when switching units.
const convertSizeByUnit = ( value, toUnit = '%', side = 'height', imgEl ) => {
	// Convert to px, just get the current measurement.
	if ( toUnit === 'px' ) {
		return side === 'height' ? imgEl?.clientHeight : imgEl?.clientWidth
	}
	// Convert to %
	const imgResizerEl = imgEl?.closest( '.stk-img-resizer' )
	const parentRect = imgResizerEl?.parentElement
	if ( ! parentRect ) {
		return value
	}
	const parentSize = side === 'height' ? parentRect.clientHeight : parentRect.clientWidth
	return clamp( Math.round( value / parentSize * 10 ) * 10, 10, 100 ) // Round nearest 10%
}

const ResizerTooltip = props => {
	const [ isEditing, setIsEditing ] = useState( false )
	const [ currentWidth, setCurrentWidth ] = useState( '' )
	const [ currentHeight, setCurrentHeight ] = useState( '' )

	const [ prevSwitchedWidth, setPrevSwitchedWidth ] = useState( null )
	const [ prevSwitchedHeight, setPrevSwitchedHeight ] = useState( null )

	const tooltipRef = useRef()
	const popupRef = useRef()

	const focusInput = () => {
		// When the manual entry opens, select the whole value.
		setTimeout( () => {
			popupRef.current?.querySelector( 'input' ).select()
		}, 1 )
	}

	useEffect( () => {
		setPrevSwitchedWidth( null )
		setPrevSwitchedHeight( null )
		if ( isEditing ) {
			setCurrentWidth( props.width )
			setCurrentHeight( props.height )
			focusInput()
		} else {
			setCurrentWidth( '' )
			setCurrentHeight( '' )
		}
	}, [ isEditing ] )

	const className = classnames( [
		'stk-resizer-tooltip',
	], {
		'stk--is-editing': isEditing,
	} )

	const popupClassName = classnames( [
		'stk-resizer-popup',
	], {
		'stk--is-wide': props.enableWidth && props.enableHeight,
	} )

	const widthControl = <AdvancedTextControl
		placeholder={ props.widthPlaceholder }
		default={ props.defaultWidth === 'auto' ? '' : props.defaultWidth }
		type="number"
		label={ props.enableWidth && props.enableHeight ? __( 'Width', i18n ) : sprintf( __( '%s Width', i18n ), props.label ) }
		className="stk-resizer-popup__size"
		units={ props.widthUnits }
		unit={ props.widthUnit }
		value={ currentWidth === 'auto' ? '' : currentWidth }
		allowReset={ props.allowReset }
		onChangeUnit={ unit => {
			if ( unit === props.widthUnit ) {
				return
			}

			// When switching units, prevent the image from abruptly changing widths
			let width = null
			if ( prevSwitchedWidth === null ) {
				setPrevSwitchedWidth( props.width )
				// At first switch, remember the width
				// Calculate new width based on the current one
				const imgEl = tooltipRef.current?.parentElement.querySelector( '.stk-img' )
				const newSize = convertSizeByUnit( props.width, unit, 'width', imgEl )
				setCurrentWidth( newSize )
				width = clampSize( newSize, unit )
			} else {
				// when already came from a switch, set the previous width back
				setCurrentWidth( prevSwitchedWidth )
				width = prevSwitchedWidth
				setPrevSwitchedWidth( null )
			}
			props.onChangeWidth( { value: width, unit } )
			focusInput()
		} }
		onChange={ _value => {
			const value = _value === 'auto' ? '' : _value
			setPrevSwitchedWidth( null )
			setCurrentWidth( value )
			if ( value >= 5 ) {
				props.onChangeWidth( {
					value: clampSize( value, props.widthUnit ),
					unit: props.widthUnit,
				} )
			} else if ( value === '' ) { // Reset.
				setPrevSwitchedWidth( null )
				setCurrentWidth( '' )
				if ( props.enableWidth ) {
					props.onChangeWidth( { value: '', unit: '' } )
				}
			}
		} }
	/>

	const heightControl = <AdvancedTextControl
		placeholder={ props.heightPlaceholder }
		default={ props.defaultHeight === 'auto' ? '' : props.defaultHeight }
		type="number"
		label={ props.enableWidth && props.enableHeight ? __( 'Height', i18n ) : sprintf( __( '%s Height', i18n ), props.label ) }
		className="stk-resizer-popup__size"
		units={ props.heightUnits }
		unit={ props.heightUnit }
		value={ currentHeight === 'auto' ? '' : currentHeight }
		allowReset={ props.allowReset }
		onChangeUnit={ unit => {
			if ( unit === props.heightUnit ) {
				return
			}

			// When switching units, prevent the image from abruptly changing heights
			let height = null
			if ( prevSwitchedHeight === null ) {
				setPrevSwitchedHeight( props.height )
				// At first switch, remember the height
				// Calculate new height based on the current one
				const imgEl = tooltipRef.current?.parentElement.querySelector( '.stk-img' )
				const newSize = convertSizeByUnit( props.height, unit, 'height', imgEl )
				setCurrentHeight( newSize )
				height = clampSize( newSize, unit )
			} else {
				// when already came from a switch, set the previous height back
				setCurrentHeight( prevSwitchedHeight )
				height = prevSwitchedHeight
				setPrevSwitchedHeight( null )
			}

			props.onChangeHeight( { value: height, unit } )
			focusInput()
		} }
		onChange={ _value => {
			const value = _value === 'auto' ? '' : _value
			setPrevSwitchedHeight( null )
			setCurrentHeight( value )
			if ( value >= 5 ) {
				props.onChangeHeight( {
					value: clampSize( value, props.heightUnit ),
					unit: props.heightUnit,
				} )
			} else if ( value === '' ) { // Reset.
				setPrevSwitchedHeight( null )
				setCurrentHeight( '' )
				if ( props.enableHeight ) {
					props.onChangeHeight( { value: '', unit: '' } )
				}
			}
		} }
	/>

	let labelWidth = currentWidth || currentWidth === 0 ? currentWidth
		: ( props.width || props.width === 0 ? props.width : props.widthPlaceholder )
	labelWidth = labelWidth === 'auto' ? 'auto' : `${ labelWidth }${ props.widthUnit }`

	let labelHeight = currentHeight || currentHeight === 0 ? currentHeight
		: ( props.height || props.height === 0 ? props.height : props.heightPlaceholder )
	labelHeight = labelHeight === 'auto' ? 'auto' : `${ labelHeight }${ props.heightUnit }`

	return (
		<Fragment>
			{ isEditing && (
				<Popover
					className={ popupClassName }
					anchorRef={ tooltipRef.current }
					position="bottom right"
					onFocusOutside={ event => {
						if ( event.relatedTarget !== tooltipRef.current ) {
							setIsEditing( false )
						}
					} }
					onEscape={ () => setIsEditing( false ) }
				>
					<div ref={ popupRef }>
						{ props.enableWidth && props.enableHeight &&
							<BaseControl
								help={ props.help }
								className={ classnames( 'stk-control stk--no-padding', props.className ) }
							>
								<div className="stk-control-label">
									<div className="components-base-control__label"><h3>{ sprintf( __( '%s Size', i18n ), props.label ) }</h3></div>
								</div>
								<div className="stk-resizer-popup__control-wrapper">
									{ widthControl }
									<span className="stk-resizer-popup__x">×</span>
									{ heightControl }
								</div>
							</BaseControl>
						}
						{ ! ( props.enableWidth && props.enableHeight ) &&
							<div className="stk-resizer-popup__control-wrapper">
								{ props.enableWidth && ! props.enableHeight && widthControl }
								{ ! props.enableWidth && props.enableHeight && heightControl }
							</div>
						}
					</div>
				</Popover>
			) }
			<div
				className={ className }
				role="button"
				tabIndex="0"
				onMouseDown={ () => {
					setIsEditing( ! isEditing )
				} }
				onKeyDown={ event => {
					if ( event.keyCode === 13 ) {
						setIsEditing( ! isEditing )
					}
				} }
				ref={ tooltipRef }
			>
				{ props.enableWidth ? labelWidth : null }
				{ props.enableWidth && props.enableHeight ? ' × ' : null }
				{ props.enableHeight ? labelHeight : null }
				<ArrowDownSvg fill="currentColor" width="10" />
			</div>
		</Fragment>
	)
}

ResizerTooltip.defaultProps = {
	width: '',
	height: '',
	widthUnit: '%',
	heightUnit: 'px',
	widthUnits: [ 'px', '%' ],
	heightUnits: [ 'px', '%' ],
	enableWidth: true,
	enableHeight: true,
	allowReset: true,
	onChangeWidth: () => {},
	onChangeHeight: () => {},
	label: __( 'Image', i18n ),

	defaultWidth: '',
	defaultHeight: '',
}

export default ResizerTooltip
