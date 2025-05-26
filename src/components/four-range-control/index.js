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
	Fragment, useState, memo, useEffect,
} from '@wordpress/element'
import { settings } from '@wordpress/icons'
import { dispatch } from '@wordpress/data'

/**
 * External dependencies
 */
import { isEqual } from 'lodash'
import classnames from 'classnames'
import { i18n, settings as stackableSettings } from 'stackable'
import { Button } from '~stackable/components'
import {
	useAttributeName,
	useBlockAttributesContext,
	useDeviceType,
	useBlockHoverState,
	useBlockSetAttributesContext,
} from '~stackable/hooks'
import {
	extractNumbersAndUnits, getCSSVarName, convertToPxIfUnsupported,
} from '~stackable/util'

const isEqualInitial = ( props, value, firstValue ) => {
	let isEqual = true
	isEqual = props.enableTop && value.top !== firstValue ? false : isEqual
	isEqual = props.enableRight && value.right !== firstValue ? false : isEqual
	isEqual = props.enableBottom && value.bottom !== firstValue ? false : isEqual
	isEqual = props.enableLeft && value.left !== firstValue ? false : isEqual
	return isEqual
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

	let firstValue = props.enableTop ? value.top
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

	const isMarkModeDefault = !! ( stackableSettings?.stackable_use_size_presets_by_default ?? true )

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

	const [ isFourMarkMode, setIsFourMarkMode ] = useState( false )

	// Set the markMode when at first render and when device type changes
	useEffect( () => {
		// Is value at first render the same as a step value? If so, do mark mode
		// at the start, or show custom
		// If no initial value, use the given default from the settings
		const isMarkValue = {
			first: !! props.marks && isMarkModeDefault,
			top: !! props.marks && isMarkModeDefault,
			right: !! props.marks && isMarkModeDefault,
			bottom: !! props.marks && isMarkModeDefault,
			left: !! props.marks && isMarkModeDefault,
		}

		if ( props.marks && firstValue ) {
			// Check if the current value exists in the marks only by their CSS variable name
			// to match in case the fallback size changes.
			const firstValueCssVarName = getCSSVarName( firstValue )
			const firstMatchedMark = props.marks.find( mark => getCSSVarName( mark.value ) === firstValueCssVarName )
			isMarkValue.first = !! firstMatchedMark
			if ( firstMatchedMark ) {
				firstValue = firstMatchedMark.value
			}

			[ 'top', 'right', 'bottom', 'left' ].forEach( side => {
				const sideCssVarName = getCSSVarName( value[ side ] )
				const matchedMark = props.marks.find( mark => getCSSVarName( mark.value ) === sideCssVarName )
				isMarkValue[ side ] = !! matchedMark
				if ( matchedMark ) {
					value[ side ] = matchedMark.value
				}
			} )
			setIsFourMarkMode( isMarkValue )
		}
	}, [ deviceType ] )

	const onChangeAll = _newValue => {
		const newValue = props.marks ? String( _newValue ) : _newValue
		onChange( {
			top: props.enableTop ? newValue : value.top,
			right: props.enableRight ? newValue : value.right,
			bottom: props.enableBottom ? newValue : value.bottom,
			left: props.enableLeft ? newValue : value.left,
		} )
		setIsFourMarkMode( prev => ( {
			...prev,
			top: prev.first,
			right: prev.first,
			bottom: prev.first,
			left: prev.first,
		} ) )
	}

	const onChangeTop = _newValue => {
		const newValue = props.marks ? String( _newValue ) : _newValue
		onChange( {
			top: newValue,
			right: value.right,
			bottom: value.bottom,
			left: value.left,
		} )
		setIsFourMarkMode( prev => ( { ...prev, first: prev.top } ) )
	}

	const onChangeRight = _newValue => {
		const newValue = props.marks ? String( _newValue ) : _newValue
		onChange( {
			top: value.top,
			right: newValue,
			bottom: value.bottom,
			left: value.left,
		} )
		setIsFourMarkMode( prev => ( { ...prev, first: prev.right } ) )
	}

	const onChangeBottom = _newValue => {
		const newValue = props.marks ? String( _newValue ) : _newValue
		onChange( {
			top: value.top,
			right: value.right,
			bottom: newValue,
			left: value.left,
		} )
		setIsFourMarkMode( prev => ( { ...prev, first: prev.bottom } ) )
	}

	const onChangeLeft = _newValue => {
		const newValue = props.marks ? String( _newValue ) : _newValue
		onChange( {
			top: value.top,
			right: value.right,
			bottom: value.bottom,
			left: newValue,
		} )
		setIsFourMarkMode( prev => ( { ...prev, first: prev.left } ) )
	}

	const onChangeVertical = _newValue => {
		const newValue = props.marks ? String( _newValue ) : _newValue
		onChange( {
			top: newValue,
			right: value.right,
			bottom: newValue,
			left: value.left,
		} )
		setIsFourMarkMode( prev => ( {
			...prev,
			top: prev.top,
			bottom: prev.top,
		} ) )
	}

	const onChangeHorizontal = _newValue => {
		const newValue = props.marks ? String( _newValue ) : _newValue
		onChange( {
			top: value.top,
			right: newValue,
			bottom: value.bottom,
			left: newValue,
		} )
		setIsFourMarkMode( prev => ( {
			...prev,
			right: prev.left,
			left: prev.left,
		} ) )
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
		} else {
			newProps.marks = undefined
		}

		if ( props.marks ) {
			controlProps.className = controlProps.className || ''
			controlProps.className += 'stk-range-control--with-marks'
			controlProps.className += isMarkMode ? ' stk-range-control--mark-mode' : ''
		}

		// We need to change the way we handle the value and onChange if we're doing marks
		let rangeValue = props.marks ? parseFloat( initialValue ) : initialValue
		let rangeOnChange = initialOnChange
		if ( props.marks && isMarkMode ) {
			rangeValue = props.marks.findIndex( mark => {
				let _unit, _value
				// If the initialValue is a CSS variable, compare with mark's CSS variable.
				// Otherwise, the initialValue is custom, so compare with raw size and units
				if ( typeof initialValue === 'string' && initialValue.startsWith( 'var' ) ) {
					[ _value, _unit ] = extractNumbersAndUnits( mark.value )[ 0 ]
				} else {
					[ _value, _unit ] = extractNumbersAndUnits( mark.size )[ 0 ]
					const converted = convertToPxIfUnsupported( props.units, _unit, _value )
					_value = converted.value
					_unit = converted.unit
				}
				return _value === initialValue && ( _unit === '' || _unit === unit )
			} )
			rangeOnChange = ( value, property = 'value' ) => {
				if ( value === '' ) {
					return initialOnChange( value )
				}

				// Extract the unit and value.
				const markValue = props.marks[ value ]?.[ property ] || '0'
				let [ newValue, unit ] = extractNumbersAndUnits( markValue )[ 0 ]

				// If the attribute has no support for rem or em, and the
				// preset units is rem or em, convert to px
				const converted = convertToPxIfUnsupported( props.units, unit, newValue )
				newValue = converted.value
				unit = converted.unit

				// Update the unit.
				if ( unit ) {
					dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
					setAttributes( { [ unitAttrName ]: unit } )
					if ( props.onChangeUnit ) {
						props.onChangeUnit( unit )
					}
				}

				initialOnChange( newValue )
			}
		}

		return [
			newProps, rangeValue, rangeOnChange,
		]
	}

	// Remove the unit picker if not in mark mode for every four range mode
	if ( isLocked && ! props.vhMode ) {
		controlProps.units = isFourMarkMode.first
			? false : controlProps.units
	} else if ( isLocked && props.vhMode ) {
		controlProps.units = isFourMarkMode.top && isFourMarkMode.right
			? false : controlProps.units
	} else {
		controlProps.units = isFourMarkMode.top && isFourMarkMode.right && isFourMarkMode.bottom && isFourMarkMode.left
			? false : controlProps.units
	}

	// Create step supports for each side
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

	const [ propsToPassVertical, rangeValueVertical, rangeOnChangeVertical ] = stepSupport(
		isFourMarkMode.top,
		value.top,
		onChangeVertical,
	)

	const [ propsToPassHorizontal, rangeValueHorizontal, rangeOnChangeHorizontal ] = stepSupport(
		isFourMarkMode.left,
		value.left,
		onChangeHorizontal,
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
								onClick={ () => {
									// Set the value when changing from mark mode to custom
									if ( isFourMarkMode.first && rangeValueFirst !== -1 ) {
										rangeOnChangeFirst( rangeValueFirst, 'size' )
									}
									setIsFourMarkMode( prev => ( { ...prev, first: ! prev.first } ) )
								} }
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
							{ ...propsToPassVertical }
							value={ rangeValueVertical }
							onChange={ rangeOnChangeVertical }
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
									onClick={ () => {
										if ( isFourMarkMode.top && rangeValueTop !== -1 ) {
											rangeOnChangeTop( rangeValueTop, 'size' )
										}
										setIsFourMarkMode( prev => ( { ...prev, top: ! prev.top } ) )
									} }
									icon={ settings }
								>
								</Button>
							) }
						</RangeControl>
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
							{ ...propsToPassHorizontal }
							value={ rangeValueHorizontal }
							onChange={ rangeOnChangeHorizontal }
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
									onClick={ () => {
										if ( isFourMarkMode.left && rangeValueLeft !== -1 ) {
											rangeOnChangeLeft( rangeValueLeft, 'size' )
										}
										setIsFourMarkMode( prev => ( { ...prev, left: ! prev.left } ) )
									} }
									icon={ settings }
								>
								</Button>
							) }
						</RangeControl>
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
										onClick={ () => {
											if ( isFourMarkMode.top && rangeValueTop !== -1 ) {
												rangeOnChangeTop( rangeValueTop, 'size' )
											}
											setIsFourMarkMode( prev => ( { ...prev, top: ! prev.top } ) )
										} }
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
										onClick={ () => {
											if ( isFourMarkMode.right && rangeValueRight !== -1 ) {
												rangeOnChangeRight( rangeValueRight, 'size' )
											}
											setIsFourMarkMode( prev => ( { ...prev, right: ! prev.right } ) )
										} }
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
										onClick={ () => {
											if ( isFourMarkMode.bottom && rangeValueBottom !== -1 ) {
												rangeOnChangeBottom( rangeValueBottom, 'size' )
											}
											setIsFourMarkMode( prev => ( { ...prev, bottom: ! prev.bottom } ) )
										} }
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
										onClick={ () => {
											if ( isFourMarkMode.left && rangeValueLeft !== -1 ) {
												rangeOnChangeLeft( rangeValueLeft, 'size' )
											}
											setIsFourMarkMode( prev => ( { ...prev, left: ! prev.left } ) )
										} }
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
}

export default memo( FourRangeControl )
