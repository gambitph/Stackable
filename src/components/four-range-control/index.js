/**
 * Internal dependencies
 */
import SVGAllCornersImage from './images/all-corners.svg'
import SVGLowerRightImage from './images/lower-right-corner.svg'
import SVGLowerLeftImage from './images/lower-left-corner.svg'
import SVGUpperRightImage from './images/upper-right-corner.svg'
import SVGUpperLeftImage from './images/upper-left-corner.svg'
import SVGAllImage from './images/all.svg'
import SVGBottomImage from './images/bottom.svg'
import SVGLeftImage from './images/left.svg'
import SVGRightImage from './images/right.svg'
import SVGTopImage from './images/top.svg'
import SVGFullImage from './images/full.svg'
import SVGVerticalImage from './images/vertical.svg'
import SVGHorizontalImage from './images/horizontal.svg'
import RangeControl from '../advanced-range-control/range-control'
import { ResetButton } from '../base-control2/reset-button'
import AdvancedControl, { extractControlProps } from '../base-control2'
import { useControlHandlers } from '../base-control2/hooks'

/**
 * WordPress dependencies
 */
import { Tooltip } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import {
	Fragment, useState, memo,
} from '@wordpress/element'
import { settings } from '@wordpress/icons'
import { dispatch } from '@wordpress/data'

/**
 * External dependencies
 */
import { isEqual } from 'lodash'
import classnames from 'classnames'
import { i18n } from 'stackable'
import { Button } from '~stackable/components'
import {
	useAttributeName,
	useBlockAttributesContext,
	useDeviceType,
	useBlockHoverState,
	useBlockSetAttributesContext,
} from '~stackable/hooks'

const isEqualInitial = ( props, value, firstValue ) => {
	let isEqual = true
	isEqual = props.enableTop && value.top !== firstValue ? false : isEqual
	isEqual = props.enableRight && value.right !== firstValue ? false : isEqual
	isEqual = props.enableBottom && value.bottom !== firstValue ? false : isEqual
	isEqual = props.enableLeft && value.left !== firstValue ? false : isEqual
	return isEqual
}

// The value can be in the format '10px' or '10.0em' or '10rem'.
// Return an array with the number and the unit.
const extractNumberAndUnit = value => {
	// Match the last characters that are not numbers.
	const matches = value.match( /([\d.]+)(\D*)$/ )
	if ( ! matches || value.startsWith( 'var(--stk' ) ) {
		return [ value, '' ]
	}
	return [ matches[ 1 ], matches[ 2 ] ]
}

const FourRangeControl = memo( props => {
	const [ _value, _onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover, props.valueCallback, props.changeCallback )
	const [ propsToPass, controlProps ] = extractControlProps( props )
	const [ currentHoverState ] = useBlockHoverState()

	let value = _value || {
		top: props.defaultTop, right: props.defaultRight, bottom: props.defaultBottom, left: props.defaultLeft,
	}

	// You can specify the values in this way. This is how this is done in v2
	const hasOldValues = typeof props.top !== 'undefined' || typeof props.right !== 'undefined' || typeof props.bottom !== 'undefined' || typeof props.left !== 'undefined'
	if ( hasOldValues ) {
		value = {
			top: typeof props.top !== 'undefined' ? props.top : props.enableTop ? props.defaultTop : undefined,
			right: typeof props.right !== 'undefined' ? props.right : props.enableRight ? props.defaultRight : undefined,
			bottom: typeof props.bottom !== 'undefined' ? props.bottom : props.enableBottom ? props.defaultBottom : undefined,
			left: typeof props.left !== 'undefined' ? props.left : props.enableLeft ? props.defaultLeft : undefined,
		}
	}
	const onChange = typeof props.onChange === 'undefined' ? _onChange : props.onChange

	const isDefaults = ( props.enableTop && value.top === '' ) &&
		( props.enableRight && value.right === '' ) &&
		( props.enableBottom && value.bottom === '' ) &&
		( props.enableLeft && value.left === '' )

	const firstValue = props.enableTop ? value.top
		: props.enableRight ? value.right
			: props.enableBottom ? value.bottom
				: value.left

	const [ isLocked, setIsLocked ] = useState( isDefaults ? props.defaultLocked : isEqualInitial( props, value, firstValue ) )

	const lockClassNames = classnames( [
		'ugb-four-range-control__lock',
	], {
		'ugb--is-locked': props.hasLock && isLocked,
	} )

	controlProps.after = props.hasLock && <Button
		className={ lockClassNames }
		onClick={ () => setIsLocked( ! isLocked ) }
		variation="tertiary"
		icon={ isLocked ? ( props.isCorner ? <SVGAllCornersImage /> : <SVGAllImage /> ) : <SVGFullImage /> }
		label={ isLocked ? __( 'Individual sides', i18n ) : __( 'All sides', i18n ) }
	/>

	const setAttributes = useBlockSetAttributesContext()
	const hasUnits = !! props.units?.length
	const unitAttrName = useAttributeName( `${ props.attribute }Unit`, props.responsive, props.hover )

	const {
		unit,
		_valueDesktop,
		_valueTablet,
		_unitDesktop,
		_unitTablet,
	} = useBlockAttributesContext( attributes => {
		return {
			unit: attributes[ unitAttrName ],
			_valueDesktop: attributes[ `${ props.attribute }` ],
			_valueTablet: attributes[ `${ props.attribute }Tablet` ],
			_unitDesktop: attributes[ `${ props.attribute }Unit` ],
			_unitTablet: attributes[ `${ props.attribute }UnitTablet` ],
		}
	} )

	// Change the min, max & step values depending on the unit used.
	if ( hasUnits ) {
		const i = props.units.indexOf( unit ) < 0 ? 0 : props.units.indexOf( unit )
		if ( Array.isArray( props.min ) ) {
			propsToPass.min = props.min[ i ]
		}
		if ( Array.isArray( props.max ) ) {
			propsToPass.max = props.max[ i ]
		}
		if ( Array.isArray( props.sliderMin ) ) {
			propsToPass.sliderMin = props.sliderMin[ i ]
		}
		if ( Array.isArray( props.sliderMax ) ) {
			propsToPass.sliderMax = props.sliderMax[ i ]
		}
		if ( Array.isArray( props.step ) ) {
			propsToPass.step = props.step[ i ]
		}
		if ( Array.isArray( props.placeholder ) ) {
			propsToPass.placeholder = props.placeholder[ i ]
		}
		propsToPass.initialPosition = props.initialPosition !== '' ? props.initialPosition : props.placeholder

		// If the unit was not the default, remove the placeholder.
		if ( i !== 0 ) {
			propsToPass.initialPosition = ''
			propsToPass.placeholder = props.placeholder
		}
	} else {
		propsToPass.initialPosition = props.initialPosition !== '' ? props.initialPosition : props.placeholder
	}

	const deviceType = useDeviceType()
	const tabletHasValue = {
		top: _valueTablet && _valueTablet !== '' && _valueTablet.top && _valueTablet.top !== '',
		right: _valueTablet && _valueTablet !== '' && _valueTablet.right && _valueTablet.right !== '',
		bottom: _valueTablet && _valueTablet !== '' && _valueTablet.bottom && _valueTablet.bottom !== '',
		left: _valueTablet && _valueTablet !== '' && _valueTablet.left && _valueTablet.left !== '',
		firstValue:
			props.enableTop ? ( _valueTablet && _valueTablet !== '' && _valueTablet.top && _valueTablet.top !== '' )
				: props.enableRight ? ( _valueTablet && _valueTablet !== '' && _valueTablet.right && _valueTablet.right !== '' )
					: props.enableBottom ? ( _valueTablet && _valueTablet !== '' && _valueTablet.bottom && _valueTablet.bottom !== '' )
						: ( _valueTablet && _valueTablet !== '' && _valueTablet.left && _valueTablet.left !== '' ),
	}

	const desktopHasValue = {
		top: _valueDesktop && _valueDesktop !== '' && _valueDesktop.top && _valueDesktop.top !== '',
		right: _valueDesktop && _valueDesktop !== '' && _valueDesktop.right && _valueDesktop.right !== '',
		bottom: _valueDesktop && _valueDesktop !== '' && _valueDesktop.bottom && _valueDesktop.bottom !== '',
		left: _valueDesktop && _valueDesktop !== '' && _valueDesktop.left && _valueDesktop.left !== '',
		firstValue:
			props.enableTop ? ( _valueDesktop && _valueDesktop !== '' && _valueDesktop.top && _valueDesktop.top !== '' )
				: props.enableRight ? ( _valueDesktop && _valueDesktop !== '' && _valueDesktop.right && _valueDesktop.right !== '' )
					: props.enableBottom ? ( _valueDesktop && _valueDesktop !== '' && _valueDesktop.bottom && _valueDesktop.bottom !== '' )
						: ( _valueDesktop && _valueDesktop !== '' && _valueDesktop.left && _valueDesktop.left !== '' ),
	}

	const { desktop: firstValueDesktop, tablet: firstValueTablet } =
		props.enableTop ? { desktop: _valueDesktop?.top, tablet: _valueTablet?.top }
			: props.enableRight ? { desktop: _valueDesktop?.right, tablet: _valueTablet?.right }
				: props.enableBottom ? { desktop: _valueDesktop?.bottom, tablet: _valueTablet?.bottom }
					: { desktop: _valueDesktop?.left, tablet: _valueTablet?.left }

	// Is value at first render the same as a step value? If so, do mark mode
	// at the start, or show custom
	const isMarkValue = {
		first: !! props.marks,
		top: !! props.marks,
		right: !! props.marks,
		bottom: !! props.marks,
		left: !! props.marks,
	}
	if ( props.marks && value ) {
		// Check if the current value exsits in the marks
		const marksUnit = ( props.hasCSSVariableValue ? '' : unit )
		isMarkValue.first = isMarkValue.first && props.marks.some( mark => mark.value === firstValue + marksUnit )
		isMarkValue.top = isMarkValue.top && props.marks.some( mark => mark.value === value.top + marksUnit )
		isMarkValue.right = isMarkValue.right && props.marks.some( mark => mark.value === value.right + marksUnit )
		isMarkValue.bottom = isMarkValue.bottom && props.marks.some( mark => mark.value === value.bottom + marksUnit )
		isMarkValue.left = isMarkValue.left && props.marks.some( mark => mark.value === value.left + marksUnit )
	}
	const [ isFourMarkMode, setIsFourMarkMode ] = useState( isMarkValue )

	const onChangeAll = newValue => {
		onChange( {
			top: props.enableTop ? newValue : value.top,
			right: props.enableRight ? newValue : value.right,
			bottom: props.enableBottom ? newValue : value.bottom,
			left: props.enableLeft ? newValue : value.left,
		} )
	}

	const onChangeTop = newValue => {
		onChange( {
			top: newValue,
			right: value.right,
			bottom: value.bottom,
			left: value.left,
		} )
	}

	const onChangeRight = newValue => {
		onChange( {
			top: value.top,
			right: newValue,
			bottom: value.bottom,
			left: value.left,
		} )
	}

	const onChangeBottom = newValue => {
		onChange( {
			top: value.top,
			right: value.right,
			bottom: newValue,
			left: value.left,
		} )
	}

	const onChangeLeft = newValue => {
		onChange( {
			top: value.top,
			right: value.right,
			bottom: value.bottom,
			left: newValue,
		} )
	}

	const onChangeVertical = newValue => {
		onChange( {
			top: newValue,
			right: value.right,
			bottom: newValue,
			left: value.left,
		} )
	}

	const onChangeHorizontal = newValue => {
		onChange( {
			top: value.top,
			right: newValue,
			bottom: value.bottom,
			left: newValue,
		} )
	}
	// Support for steps. Modify the props to make the range control show steps.
	const stepSupport = ( isMarkMode, initialValue, initialOnChange ) => {
		const newProps = { ...propsToPass }

		if ( props.marks && isMarkMode ) {
		// Steps only have 1 increment values
			newProps.min = 0
			newProps.max = props.marks.length - 1
			newProps.sliderMin = 0
			newProps.sliderMax = props.marks.length - 1
			newProps.step = 1

			// Show the marks and names
			newProps.marks = props.marks.reduce( ( acc, mark, index ) => {
				return [
					{
						value: index,
						name: undefined,
					},
					...acc,
				]
			}, [] )
			newProps.renderTooltipContent = value => {
				return props.marks[ value ]?.name || ''
			}

			// Other necessary props for steps.
			newProps.withInputField = false
			controlProps.units = false
		} else {
			newProps.marks = undefined
		}

		if ( props.marks ) {
			controlProps.className = controlProps.className || ''
			controlProps.className += 'stk-range-control--with-marks'
			controlProps.className += isMarkMode ? ' stk-range-control--mark-mode' : ''
		}

		// We need to change the way we handle the value and onChange if we're doing marks
		let rangeValue = initialValue
		let rangeOnChange = initialOnChange
		if ( props.marks && isMarkMode ) {
			rangeValue = props.marks.findIndex( mark => {
				const [ _value, _unit ] = extractNumberAndUnit( mark.value )
				return _value === initialValue
			} )
			rangeOnChange = value => {
				if ( value === '' ) {
					return initialOnChange( value )
				}

				// Extract the unit and value.
				const markValue = props.marks[ value ]?.value || '0'
				const [ _newValue, unit ] = extractNumberAndUnit( markValue )
				const newValue = _newValue

				// Update the unit.
				dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
				setAttributes( { [ unitAttrName ]: unit } )

				initialOnChange( newValue )
			}
		}

		return [
			newProps, rangeValue, rangeOnChange,
		]
	}

	const [ propsToPassFirst, rangeValueFirst, rangeOnChangeFirst ] = stepSupport(
		isFourMarkMode.first,
		firstValue,
		onChangeAll,
	)

	const [ propsToPassTop, rangeValueTop, rangeOnChangeTop ] = stepSupport(
		isFourMarkMode.top,
		value.top,
		onChangeTop,
	)

	const [ propsToPassRight, rangeValueRight, rangeOnChangeRight ] = stepSupport(
		isFourMarkMode.right,
		value.right,
		onChangeRight,
	)

	const [ propsToPassBottom, rangeValueBottom, rangeOnChangeBottom ] = stepSupport(
		isFourMarkMode.bottom,
		value.bottom,
		onChangeBottom,
	)

	const [ propsToPassLeft, rangeValueLeft, rangeOnChangeLeft ] = stepSupport(
		isFourMarkMode.left,
		value.left,
		onChangeLeft,
	)

	return (
		<AdvancedControl { ...controlProps }>
			{ isLocked && ! props.vhMode && (
				<Fragment>
					<RangeControl
						{ ...propsToPassFirst }
						value={ rangeValueFirst }
						onChange={ rangeOnChangeFirst }
						allowReset={ false }
						initialPosition={ ( () => {
							if ( currentHoverState !== 'normal' ) {
								return ''
							}

							if ( deviceType === 'Mobile' && tabletHasValue.firstValue ) {
								return unit === _unitTablet ? firstValueTablet : ''
							} else if ( ( deviceType === 'Mobile' || deviceType === 'Tablet' ) && desktopHasValue.firstValue ) {
								return unit === _unitDesktop ? firstValueDesktop : ''
							}

							return propsToPass.initialPosition
						} )() }
						placeholder={ ( () => {
							if ( currentHoverState !== 'normal' ) {
								return ''
							}

							if ( deviceType === 'Mobile' && tabletHasValue.firstValue ) {
								return unit === _unitTablet ? firstValueTablet : ''
							} else if ( ( deviceType === 'Mobile' || deviceType === 'Tablet' ) && desktopHasValue.firstValue ) {
								return unit === _unitDesktop ? firstValueDesktop : ''
							}

							return propsToPass.placeholder
						} )() }
						__nextHasNoMarginBottom
					>
						{ props.allowCustom && props.marks && (
							<Button
								className="stk-range-control__custom-button"
								size="small"
								variant="tertiary"
								onClick={ () => setIsFourMarkMode( prev => {
									return { ...prev, first: ! prev.first }
								} ) }
								icon={ settings }
							>
							</Button>
						) }
					</RangeControl>
					<ResetButton
						allowReset={ props.allowReset }
						value={ firstValue }
						default={ props.defaultTop }
						onChange={ onChangeAll }
					/>
				</Fragment>
			) }
			{ isLocked && props.vhMode && (
				<Fragment>
					<div className="ugb-four-range-control__range">
						<Tooltip text={ __( 'Top and Bottom', i18n ) }>
							<span className="ugb-four-range-control__icon"><SVGVerticalImage /></span>
						</Tooltip>
						<RangeControl
							{ ...propsToPass }
							value={ value.top }
							onChange={ onChangeVertical }
							allowReset={ false }
							initialPosition={ ( () => {
								if ( currentHoverState !== 'normal' ) {
									return ''
								}

								if ( deviceType === 'Mobile' && tabletHasValue.top ) {
									return unit === _unitTablet ? _valueTablet.top : ''
								} else if ( ( deviceType === 'Mobile' || deviceType === 'Tablet' ) && desktopHasValue.top ) {
									return unit === _unitDesktop ? _valueDesktop.top : ''
								}

								return propsToPass.initialPosition
							} )() }
							placeholder={ ( () => {
								if ( currentHoverState !== 'normal' ) {
									return ''
								}

								if ( deviceType === 'Mobile' && tabletHasValue.top ) {
									return unit === _unitTablet ? _valueTablet.top : ''
								} else if ( ( deviceType === 'Mobile' || deviceType === 'Tablet' ) && desktopHasValue.top ) {
									return unit === _unitDesktop ? _valueDesktop.top : ''
								}

								return typeof props.placeholderTop === 'undefined' ? propsToPass.placeholder : props.placeholderTop
							} )() }
						/>
						<ResetButton
							allowReset={ props.allowReset }
							value={ value.top }
							default={ props.defaultTop }
							onChange={ onChangeVertical }
						/>
					</div>
					<div className="ugb-four-range-control__range">
						<Tooltip text={ __( 'Left and Right', i18n ) }>
							<span className="ugb-four-range-control__icon"><SVGHorizontalImage /></span>
						</Tooltip>
						<RangeControl
							{ ...propsToPass }
							value={ value.left }
							onChange={ onChangeHorizontal }
							allowReset={ false }
							initialPosition={ ( () => {
								if ( currentHoverState !== 'normal' ) {
									return ''
								}

								if ( deviceType === 'Mobile' && tabletHasValue.left ) {
									return unit === _unitTablet ? _valueTablet.left : ''
								} else if ( ( deviceType === 'Mobile' || deviceType === 'Tablet' ) && desktopHasValue.left ) {
									return unit === _unitDesktop ? _valueDesktop.left : ''
								}

								return propsToPass.initialPosition
							} )() }
							placeholder={ ( () => {
								if ( currentHoverState !== 'normal' ) {
									return ''
								}

								if ( deviceType === 'Mobile' && tabletHasValue.left ) {
									return unit === _unitTablet ? _valueTablet.left : ''
								} else if ( ( deviceType === 'Mobile' || deviceType === 'Tablet' ) && desktopHasValue.left ) {
									return unit === _unitDesktop ? _valueDesktop.left : ''
								}
								return typeof props.placeholderLeft === 'undefined' ? propsToPass.placeholder : props.placeholderLeft
							} )() }
						/>
						<ResetButton
							allowReset={ props.allowReset }
							value={ value.left }
							default={ props.defaultLeft }
							onChange={ onChangeHorizontal }
						/>
					</div>
				</Fragment>
			) }
			{ ! isLocked &&
				<Fragment>
					{ props.enableTop &&
						<div className="ugb-four-range-control__range">
							<Tooltip text={ props.isCorner ? __( 'Top Left', i18n ) : __( 'Top', i18n ) }>
								<span className="ugb-four-range-control__icon">{ props.isCorner ? <SVGUpperLeftImage /> : <SVGTopImage /> }</span>
							</Tooltip>
							<RangeControl
								{ ...propsToPassTop }
								value={ rangeValueTop }
								onChange={ rangeOnChangeTop }
								allowReset={ false }
								initialPosition={ ( () => {
									if ( currentHoverState !== 'normal' ) {
										return ''
									}

									if ( deviceType === 'Mobile' && tabletHasValue.top ) {
										return unit === _unitTablet ? _valueTablet.top : ''
									} else if ( ( deviceType === 'Mobile' || deviceType === 'Tablet' ) && desktopHasValue.top ) {
										return unit === _unitDesktop ? _valueDesktop.top : ''
									}

									return propsToPass.initialPosition
								} )() }
								placeholder={ ( () => {
									if ( currentHoverState !== 'normal' ) {
										return ''
									}

									if ( deviceType === 'Mobile' && tabletHasValue.top ) {
										return unit === _unitTablet ? _valueTablet.top : ''
									} else if ( ( deviceType === 'Mobile' || deviceType === 'Tablet' ) && desktopHasValue.top ) {
										return unit === _unitDesktop ? _valueDesktop.top : ''
									}

									return typeof props.placeholderTop === 'undefined' ? propsToPass.placeholder : props.placeholderTop
								} )() }
								__nextHasNoMarginBottom
							>
								{ props.allowCustom && props.marks && (
									<Button
										className="stk-range-control__custom-button"
										size="small"
										variant="tertiary"
										onClick={ () => setIsFourMarkMode( prev => {
											return { ...prev, top: ! prev.top }
										} ) }
										icon={ settings }
									>
									</Button>
								) }
							</RangeControl>
							<ResetButton
								allowReset={ props.allowReset }
								value={ value.top }
								default={ props.defaultTop }
								onChange={ onChangeTop }
							/>
						</div>
					}
					{ props.enableRight &&
						<div className="ugb-four-range-control__range">
							<Tooltip text={ props.isCorner ? __( 'Top Right', i18n ) : __( 'Right', i18n ) }>
								<span className="ugb-four-range-control__icon">{ props.isCorner ? <SVGUpperRightImage /> : <SVGRightImage /> }</span>
							</Tooltip>
							<RangeControl
								{ ...propsToPassRight }
								value={ rangeValueRight }
								onChange={ rangeOnChangeRight }
								allowReset={ false }
								initialPosition={ ( () => {
									if ( currentHoverState !== 'normal' ) {
										return ''
									}

									if ( deviceType === 'Mobile' && tabletHasValue.right ) {
										return unit === _unitTablet ? _valueTablet.right : ''
									} else if ( ( deviceType === 'Mobile' || deviceType === 'Tablet' ) && desktopHasValue.right ) {
										return unit === _unitDesktop ? _valueDesktop.right : ''
									}

									return propsToPass.initialPosition
								} )() }
								placeholder={ ( () => {
									if ( currentHoverState !== 'normal' ) {
										return ''
									}

									if ( deviceType === 'Mobile' && tabletHasValue.right ) {
										return unit === _unitTablet ? _valueTablet.right : ''
									} else if ( ( deviceType === 'Mobile' || deviceType === 'Tablet' ) && desktopHasValue.right ) {
										return unit === _unitDesktop ? _valueDesktop.right : ''
									}

									return typeof props.placeholderRight === 'undefined' ? propsToPass.placeholder : props.placeholderRight
								} )() }
								__nextHasNoMarginBottom
							>
								{ props.allowCustom && props.marks && (
									<Button
										className="stk-range-control__custom-button"
										size="small"
										variant="tertiary"
										onClick={ () => setIsFourMarkMode( prev => {
											return { ...prev, right: ! prev.right }
										} ) }
										icon={ settings }
									>
									</Button>
								) }
							</RangeControl>
							<ResetButton
								allowReset={ props.allowReset }
								value={ value.right }
								default={ props.defaultRight }
								onChange={ onChangeRight }
							/>
						</div>
					}
					{ props.enableBottom &&
						<div className="ugb-four-range-control__range">
							<Tooltip text={ props.isCorner ? __( 'Bottom Left', i18n ) : __( 'Bottom', i18n ) }>
								<span className="ugb-four-range-control__icon">{ props.isCorner ? <SVGLowerLeftImage /> : <SVGBottomImage /> }</span>
							</Tooltip>
							<RangeControl
								{ ...propsToPassBottom }
								value={ rangeValueBottom }
								onChange={ rangeOnChangeBottom }
								allowReset={ false }
								initialPosition={ ( () => {
									if ( currentHoverState !== 'normal' ) {
										return ''
									}

									if ( deviceType === 'Mobile' && tabletHasValue.bottom ) {
										return unit === _unitTablet ? _valueTablet.bottom : ''
									} else if ( ( deviceType === 'Mobile' || deviceType === 'Tablet' ) && desktopHasValue.bottom ) {
										return unit === _unitDesktop ? _valueDesktop.bottom : ''
									}

									return propsToPass.initialPosition
								} )() }
								placeholder={ ( () => {
									if ( currentHoverState !== 'normal' ) {
										return ''
									}

									if ( deviceType === 'Mobile' && tabletHasValue.bottom ) {
										return unit === _unitTablet ? _valueTablet.bottom : ''
									} else if ( ( deviceType === 'Mobile' || deviceType === 'Tablet' ) && desktopHasValue.bottom ) {
										return unit === _unitDesktop ? _valueDesktop.bottom : ''
									}

									return typeof props.placeholderBottom === 'undefined' ? propsToPass.placeholder : props.placeholderBottom
								} )() }
								__nextHasNoMarginBottom
							>
								{ props.allowCustom && props.marks && (
									<Button
										className="stk-range-control__custom-button"
										size="small"
										variant="tertiary"
										onClick={ () => setIsFourMarkMode( prev => {
											return { ...prev, bottom: ! prev.bottom }
										} ) }
										icon={ settings }
									>
									</Button>
								) }
							</RangeControl>
							<ResetButton
								allowReset={ props.allowReset }
								value={ value.bottom }
								default={ props.defaultBottom }
								onChange={ onChangeBottom }
							/>
						</div>
					}
					{ props.enableLeft &&
						<div className="ugb-four-range-control__range">
							<Tooltip text={ props.isCorner ? __( 'Bottom Right', i18n ) : __( 'Left', i18n ) }>
								<span className="ugb-four-range-control__icon">{ props.isCorner ? <SVGLowerRightImage /> : <SVGLeftImage /> }</span>
							</Tooltip>
							<RangeControl
								{ ...propsToPassLeft }
								value={ rangeValueLeft }
								onChange={ rangeOnChangeLeft }
								allowReset={ false }
								initialPosition={ ( () => {
									if ( currentHoverState !== 'normal' ) {
										return ''
									}

									if ( deviceType === 'Mobile' && tabletHasValue.left ) {
										return unit === _unitTablet ? _valueTablet.left : ''
									} else if ( ( deviceType === 'Mobile' || deviceType === 'Tablet' ) && desktopHasValue.left ) {
										return unit === _unitDesktop ? _valueDesktop.left : ''
									}

									return propsToPass.initialPosition
								} )() }
								placeholder={ ( () => {
									if ( currentHoverState !== 'normal' ) {
										return ''
									}

									if ( deviceType === 'Mobile' && tabletHasValue.left ) {
										return unit === _unitTablet ? _valueTablet.left : ''
									} else if ( ( deviceType === 'Mobile' || deviceType === 'Tablet' ) && desktopHasValue.left ) {
										return unit === _unitDesktop ? _valueDesktop.left : ''
									}

									return typeof props.placeholderLeft === 'undefined' ? propsToPass.placeholder : props.placeholderLeft
								} )() }
								__nextHasNoMarginBottom
							>
								{ props.allowCustom && props.marks && (
									<Button
										className="stk-range-control__custom-button"
										size="small"
										variant="tertiary"
										onClick={ () => setIsFourMarkMode( prev => {
											return { ...prev, left: ! prev.left }
										} ) }
										icon={ settings }
									>
									</Button>
								) }
							</RangeControl>
							<ResetButton
								allowReset={ props.allowReset }
								value={ value.left }
								default={ props.defaultLeft }
								onChange={ onChangeLeft }
							/>
						</div>
					}
				</Fragment>
			}
		</AdvancedControl>
	)
}, isEqual )

FourRangeControl.defaultProps = {
	defaultLocked: true,
	hasLock: true,
	enableTop: true,
	enableRight: true,
	enableBottom: true,
	enableLeft: true,
	defaultTop: '',
	defaultRight: '',
	defaultBottom: '',
	defaultLeft: '',
	placeholder: '',
	placeholderTop: '',
	placeholderRight: '',
	placeholderBottom: '',
	placeholderLeft: '',
	initialPosition: '',

	vhMode: false,

	allowReset: true,
	default: '',

	attribute: '',
	responsive: false,
	hover: false,

	top: undefined,
	right: undefined,
	bottom: undefined,
	left: undefined,
	onChange: undefined,

	isCorner: false,

	marks: undefined,
	allowCustom: true,
	hasCSSVariableValue: false,
}

export default memo( FourRangeControl )
