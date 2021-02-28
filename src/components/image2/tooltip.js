/**
 * Internal dependencies
 */
import { AdvancedTextControl } from '..'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { clamp } from 'lodash'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	BaseControl, Button, Popover,
} from '@wordpress/components'
import {
	Fragment, useState, useEffect, useRef, useCallback,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'

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

const Tooltip = props => {
	const [ isEditing, setIsEditing ] = useState( false )
	const [ currentWidth, setCurrentWidth ] = useState( '' )
	const [ currentHeight, setCurrentHeight ] = useState( '' )

	const [ prevSwitchedWidth, setPrevSwitchedWidth ] = useState( null )
	const [ prevSwitchedHeight, setPrevSwitchedHeight ] = useState( null )

	const tooltipRef = useRef()
	const popupRef = useRef()

	const focusInput = useCallback( () => {
		// When the manual entry opens, select the whole value.
		setTimeout( () => {
			popupRef.current.querySelector( 'input' ).select()
		}, 1 )
	}, [ popupRef.current ] )

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
		'stk-img-resizer-tooltip',
	], {
		'stk--is-editing': isEditing,
	} )

	const popupClassName = classnames( [
		'stk-image-size-popup',
	], {
		'stk--is-wide': props.enableWidth && props.enableHeight,
	} )

	const widthControl = <AdvancedTextControl
		label={ props.enableWidth && props.enableHeight ? __( 'Width', i18n ) : __( 'Image Width', i18n ) }
		className="stk-image-size-popup__size"
		units={ props.widthUnits }
		unit={ props.widthUnit }
		value={ currentWidth }
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
		onChange={ value => {
			setPrevSwitchedWidth( null )
			setCurrentWidth( value )
			if ( value >= 5 ) {
				props.onChangeWidth( {
					value: clampSize( value, props.widthUnit ),
					unit: props.widthUnit,
				} )
			}
		} }
	/>

	const heightControl = <AdvancedTextControl
		label={ props.enableWidth && props.enableHeight ? __( 'Height', i18n ) : __( 'Image Height', i18n ) }
		className="stk-image-size-popup__size"
		units={ props.heightUnits }
		unit={ props.heightUnit }
		value={ currentHeight }
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
		onChange={ value => {
			setPrevSwitchedHeight( null )
			setCurrentHeight( value )
			if ( value >= 5 ) {
				props.onChangeHeight( {
					value: clampSize( value, props.heightUnit ),
					unit: props.heightUnit,
				} )
			}
		} }
	/>

	const resetButton = <Button
		className="stk-image-size-popup__reset"
		isSecondary
		isSmall
		onClick={ () => {
			setPrevSwitchedHeight( null )
			setPrevSwitchedWidth( null )
			setCurrentHeight( '' )
			setCurrentWidth( '' )
			if ( props.enableWidth ) {
				props.onChangeWidth( { value: '', unit: '' } )
			}
			if ( props.enableHeight ) {
				props.onChangeHeight( { value: '', unit: '' } )
			}
		} }
	>
		{ __( 'Reset', i18n ) }
	</Button>

	return (
		<Fragment>
			{ isEditing && (
				<Popover
					className={ popupClassName }
					anchorRef={ tooltipRef.current }
					position="bottom right"
					onFocusOutside={ () => setIsEditing( false ) }
				>
					<div ref={ popupRef }>
						{ props.enableWidth && props.enableHeight &&
							<BaseControl
								help={ props.help }
								className={ classnames( 'ugb-advanced-text-control', props.className ) }
							>
								<div className="components-base-control__label">{ __( 'Image Size', i18n ) }</div>
								<div className="stk-image-size-popup__control-wrapper">
									{ widthControl }
									<span className="stk-image-size-popup__x">×</span>
									{ heightControl }
									{ props.allowReset && resetButton }
								</div>
							</BaseControl>
						}
						{ ! ( props.enableWidth && props.enableHeight ) &&
							<div className="stk-image-size-popup__control-wrapper">
								{ props.enableWidth && ! props.enableHeight && widthControl }
								{ ! props.enableWidth && props.enableHeight && heightControl }
								{ props.allowReset && resetButton }
							</div>
						}
					</div>
				</Popover>
			) }
			<div
				className={ className }
				role="button"
				tabIndex="0"
				onMouseDown={ event => {
					event.preventDefault()
					event.stopPropagation()
					setIsEditing( ! isEditing )
				} }
				onKeyDown={ event => {
					if ( event.keyCode === 13 ) {
						setIsEditing( ! isEditing )
					}
				} }
				ref={ tooltipRef }
			>
				{ props.enableWidth ? `${ currentWidth || props.width }${ props.widthUnit }` : null }
				{ props.enableWidth && props.enableHeight ? ' × ' : null }
				{ props.enableHeight ? `${ currentHeight || props.height }${ props.heightUnit }` : null }
			</div>
		</Fragment>
	)
}

Tooltip.defaultProps = {
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
}

export default Tooltip
