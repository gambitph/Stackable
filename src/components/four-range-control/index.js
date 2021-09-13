/**
 * Internal dependencies
 */
import SVGAllImage from './images/all.svg'
import SVGBottomImage from './images/bottom.svg'
import SVGLeftImage from './images/left.svg'
import SVGRightImage from './images/right.svg'
import SVGTopImage from './images/top.svg'
import SVGFullImage from './images/full.svg'
import RangeControl from '../advanced-range-control/range-control'
import { ResetButton } from '../base-control2/reset-button'
import AdvancedControl, { extractControlProps } from '../base-control2'
import { useControlHandlers } from '../base-control2/hooks'

/**
 * WordPress dependencies
 */
import {
	Tooltip,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useBlockEditContext } from '@wordpress/block-editor'
import {
	Fragment, useMemo, useState, useCallback, memo,
} from '@wordpress/element'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n } from 'stackable'
import { Button } from '~stackable/components'
import {
	useAttributeName, useBlockAttributes, useDeviceType,
} from '~stackable/hooks'

const FourRangeControl = props => {
	const [ _value, _onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover, props.valueCallback, props.onChangeCallback )
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

	const isEqualInitial = useMemo( () => {
		let isEqual = true
		isEqual = props.enableTop && value.top !== firstValue ? false : isEqual
		isEqual = props.enableRight && value.right !== firstValue ? false : isEqual
		isEqual = props.enableBottom && value.bottom !== firstValue ? false : isEqual
		isEqual = props.enableLeft && value.left !== firstValue ? false : isEqual
		return isEqual
	}, [] )

	const [ isLocked, setIsLocked ] = useState( isDefaults ? props.defaultLocked : isEqualInitial )

	const lockClassNames = classnames( [
		'ugb-four-range-control__lock',
	], {
		'ugb--is-locked': props.hasLock && isLocked,
	} )

	controlProps.after = props.hasLock && <Button
		className={ lockClassNames }
		onClick={ () => setIsLocked( ! isLocked ) }
		isSecondary
		icon={ isLocked ? <SVGAllImage /> : <SVGFullImage /> }
		label={ isLocked ? __( 'Individual sides', i18n ) : __( 'All sides', i18n ) }
	/>

	const hasUnits = !! props.units?.length
	const unitAttrName = useAttributeName( `${ props.attribute }Unit`, props.responsive, props.hover )

	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )
	const unit = attributes[ unitAttrName ]

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

	const onChangeAll = useCallback( newValue => {
		onChange( {
			top: props.enableTop ? newValue : value.top,
			right: props.enableRight ? newValue : value.right,
			bottom: props.enableBottom ? newValue : value.bottom,
			left: props.enableLeft ? newValue : value.left,
		} )
	} )

	const onChangeTop = useCallback( newValue => {
		onChange( {
			top: newValue,
			right: value.right,
			bottom: value.bottom,
			left: value.left,
		} )
	} )

	const onChangeRight = useCallback( newValue => {
		onChange( {
			top: value.top,
			right: newValue,
			bottom: value.bottom,
			left: value.left,
		} )
	} )

	const onChangeBottom = useCallback( newValue => {
		onChange( {
			top: value.top,
			right: value.right,
			bottom: newValue,
			left: value.left,
		} )
	} )

	const onChangeLeft = useCallback( newValue => {
		onChange( {
			top: value.top,
			right: value.right,
			bottom: value.bottom,
			left: newValue,
		} )
	} )

	return (
		<AdvancedControl { ...controlProps }>
			{ isLocked && (
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
								placeholder={ typeof props.placeholderTop === 'undefined' ? propsToPass.placeholder : props.placeholderTop }
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
								placeholder={ typeof props.placeholderRight === 'undefined' ? propsToPass.placeholder : props.placeholderRight }
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
								placeholder={ typeof props.placeholderBottom === 'undefined' ? propsToPass.placeholder : props.placeholderBottom }
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
								placeholder={ typeof props.placeholderLeft === 'undefined' ? propsToPass.placeholder : props.placeholderLeft }
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
}

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
