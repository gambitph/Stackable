/**
 * Internal dependencies
 */
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
} from '~stackable/hooks'

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
		icon={ isLocked ? <SVGAllImage /> : <SVGFullImage /> }
		label={ isLocked ? __( 'Individual sides', i18n ) : __( 'All sides', i18n ) }
	/>

	const hasUnits = !! props.units?.length
	const unitAttrName = useAttributeName( `${ props.attribute }Unit`, props.responsive, props.hover )

	// const unit = useBlockAttributesContext( attributes => attributes[ unitAttrName ] )
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
	}

	// Remove the placeholder.
	const deviceType = useDeviceType()
	if ( deviceType !== 'Desktop' ) {
		propsToPass.initialPosition = ''
		propsToPass.placeholder = props.placeholder
	}

	const setInitPositionPlaceholder = ( _unit, _value, setAll ) => {
		propsToPass.initialPositionTop = unit === _unit ? _value?.top : ''
		propsToPass.placeholderTop = unit === _unit ? _value?.top : ''
		propsToPass.initialPositionLeft = unit === _unit ? _value?.left : ''
		propsToPass.placeholderLeft = unit === _unit ? _value?.left : ''
		if ( setAll ) {
			propsToPass.initialPositionRight = unit === _unit ? _value?.right : ''
			propsToPass.placeholderRight = unit === _unit ? _value?.right : ''
			propsToPass.initialPositionBottom = unit === _unit ? _value?.bottom : ''
			propsToPass.placeholderBottom = unit === _unit ? _value?.bottom : ''
		}
	}

	const hasNoValueTablet = _valueTablet === '' ? true
		: ( _valueTablet.top === '' && _valueTablet.left === '' && _valueTablet.right === '' && _valueTablet.bottom === '' )

	const { firstValueDesktop, firstValueTablet } =
	props.enableTop ? { firstValueDesktop: _valueDesktop?.top, firstValueTablet: _valueTablet?.top }
		: props.enableRight ? { firstValueDesktop: _valueDesktop?.right, firstValueTablet: _valueTablet?.right }
			: props.enableBottom ? { firstValueDesktop: _valueDesktop?.bottom, firstValueTablet: _valueTablet?.bottom }
				: { firstValueDesktop: _valueDesktop?.left, firstValueTablet: _valueTablet?.left }

	// Change placeholder based on inherited value
	if ( deviceType === 'Mobile' && ! hasNoValueTablet && isLocked && ! props.vhMode ) {
		propsToPass.initialPosition = unit === _unitTablet ? firstValueTablet : ''
		propsToPass.placeholder = unit === _unitTablet ? firstValueTablet : ''
	} else if ( deviceType === 'Mobile' && ! hasNoValueTablet && isLocked ) {
		setInitPositionPlaceholder( _unitTablet, _valueTablet, false )
	} else if ( deviceType === 'Mobile' && ! hasNoValueTablet ) {
		setInitPositionPlaceholder( _unitTablet, _valueTablet, true )
	} else if ( ( deviceType === 'Mobile' || deviceType === 'Tablet' ) && isLocked && ! props.vhMode ) {
		propsToPass.initialPosition = unit === _unitDesktop ? firstValueDesktop : ''
		propsToPass.placeholder = unit === _unitDesktop ? firstValueDesktop : ''
	} else if ( ( deviceType === 'Mobile' || deviceType === 'Tablet' ) && isLocked ) {
		setInitPositionPlaceholder( _unitDesktop, _valueDesktop, false )
	} else if ( deviceType === 'Mobile' || deviceType === 'Tablet' ) {
		setInitPositionPlaceholder( _unitDesktop, _valueDesktop, true )
	}

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

	return (
		<AdvancedControl { ...controlProps }>
			{ isLocked && ! props.vhMode && (
				<Fragment>
					<RangeControl
						{ ...propsToPass }
						value={ firstValue }
						onChange={ onChangeAll }
						allowReset={ false }
					/>
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
							initialPosition={ typeof propsToPass.initialPositionTop === 'undefined' ? propsToPass.initialPosition : propsToPass.initialPositionTop }
							placeholder={ typeof propsToPass.placeholderTop === 'undefined'
								? ( typeof props.placeholderTop === 'undefined' ? propsToPass.placeholder : props.placeholderTop )
								: propsToPass.placeholderTop }
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
							initialPosition={ typeof propsToPass.initialPositionLeft === 'undefined' ? propsToPass.initialPosition : propsToPass.initialPositionLeft }
							placeholder={ typeof propsToPass.placeholderLeft === 'undefined'
								? ( typeof props.placeholderLeft === 'undefined' ? propsToPass.placeholder : props.placeholderLeft )
								: propsToPass.placeholderLeft }
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
							<Tooltip text={ __( 'Top', i18n ) }>
								<span className="ugb-four-range-control__icon"><SVGTopImage /></span>
							</Tooltip>
							<RangeControl
								{ ...propsToPass }
								value={ value.top }
								onChange={ onChangeTop }
								allowReset={ false }
								initialPosition={ typeof propsToPass.initialPositionTop === 'undefined' ? propsToPass.initialPosition : propsToPass.initialPositionTop }
								placeholder={ typeof propsToPass.placeholderTop === 'undefined'
									? ( typeof props.placeholderTop === 'undefined' ? propsToPass.placeholder : props.placeholderTop )
									: propsToPass.placeholderTop }
							/>
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
							<Tooltip text={ __( 'Right', i18n ) }>
								<span className="ugb-four-range-control__icon"><SVGRightImage /></span>
							</Tooltip>
							<RangeControl
								{ ...propsToPass }
								value={ value.right }
								onChange={ onChangeRight }
								allowReset={ false }
								initialPosition={ typeof propsToPass.initialPositionRight === 'undefined' ? propsToPass.initialPosition : propsToPass.initialPositionRight }
								placeholder={ typeof propsToPass.placeholderRight === 'undefined'
									? ( typeof props.placeholderRight === 'undefined' ? propsToPass.placeholder : props.placeholderRight )
									: propsToPass.placeholderRight }
							/>
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
							<Tooltip text={ __( 'Bottom', i18n ) }>
								<span className="ugb-four-range-control__icon"><SVGBottomImage /></span>
							</Tooltip>
							<RangeControl
								{ ...propsToPass }
								value={ value.bottom }
								onChange={ onChangeBottom }
								allowReset={ false }
								initialPosition={ typeof propsToPass.initialPositionBottom === 'undefined' ? propsToPass.initialPosition : propsToPass.initialPositionBottom }
								placeholder={ typeof propsToPass.placeholderBottom === 'undefined'
									? ( typeof props.placeholderBottom === 'undefined' ? propsToPass.placeholder : props.placeholderBottom )
									: propsToPass.placeholderBottom }
							/>
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
							<Tooltip text={ __( 'Left', i18n ) }>
								<span className="ugb-four-range-control__icon"><SVGLeftImage /></span>
							</Tooltip>
							<RangeControl
								{ ...propsToPass }
								value={ value.left }
								onChange={ onChangeLeft }
								allowReset={ false }
								initialPosition={ typeof propsToPass.initialPositionLeft === 'undefined' ? propsToPass.initialPosition : propsToPass.initialPositionLeft }
								placeholder={ typeof propsToPass.placeholderLeft === 'undefined'
									? ( typeof props.placeholderLeft === 'undefined' ? propsToPass.placeholder : props.placeholderLeft )
									: propsToPass.placeholderLeft }
							/>
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
}

export default memo( FourRangeControl )
