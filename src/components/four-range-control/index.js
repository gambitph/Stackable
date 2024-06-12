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

	const hasUnits = !! props.units?.length
	const unitAttrName = useAttributeName( `${ props.attribute }Unit`, props.responsive, props.hover )

	const {
		unit,
		desktopValue,
		tabletValue,
		mobileValue,
		desktopUnit,
		tabletUnit,
		mobileUnit,
	} = useBlockAttributesContext( attributes => {
		return {
			unit: attributes[ unitAttrName ],
			desktopValue: {
				normal: attributes[ `${ props.attribute }` ],
				hover: attributes[ `${ props.attribute }Hover` ],
				'parent-hover': attributes[ `${ props.attribute }ParentHover` ],
			},
			tabletValue: {
				normal: attributes[ `${ props.attribute }Tablet` ],
				hover: attributes[ `${ props.attribute }TabletHover` ],
				'parent-hover': attributes[ `${ props.attribute }TabletParentHover` ],
			},
			mobileValue: {
				normal: attributes[ `${ props.attribute }Mobile` ],
				hover: attributes[ `${ props.attribute }MobileHover` ],
				'parent-hover': attributes[ `${ props.attribute }MobileParentHover` ],
			},
			desktopUnit: {
				normal: attributes[ `${ props.attribute }Unit` ],
				hover: attributes[ `${ props.attribute }UnitHover` ],
				'parent-hover': attributes[ `${ props.attribute }UnitParentHover` ],
			},
			tabletUnit: {
				normal: attributes[ `${ props.attribute }UnitTablet` ],
				hover: attributes[ `${ props.attribute }UnitTabletHover` ],
				'parent-hover': attributes[ `${ props.attribute }UnitTabletParentHover` ],
			},
			mobileUnit: {
				normal: attributes[ `${ props.attribute }UnitMobile` ],
				hover: attributes[ `${ props.attribute }UnitMobileHover` ],
				'parent-hover': attributes[ `${ props.attribute }UnitMobileParentHover` ],
			},
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

	const deviceType = useDeviceType()
	// check if the first value exists depending on device type and hover state
	const hasFirstValue = ( type, state ) => {
		const device = {
			Desktop: desktopValue,
			Tablet: tabletValue,
			Mobile: mobileValue,
		}

		return props.enableTop ? ( device[ type ][ state ] && device[ type ][ state ] !== '' && device[ type ][ state ].top && device[ type ][ state ].top !== '' )
			: props.enableRight ? ( device[ type ][ state ] && device[ type ][ state ] !== '' && device[ type ][ state ].right && device[ type ][ state ].right !== '' )
				: props.enableBottom ? ( device[ type ][ state ] && device[ type ][ state ] !== '' && device[ type ][ state ].bottom && device[ type ][ state ].bottom !== '' )
					: ( device[ type ][ state ] && device[ type ][ state ] !== '' && device[ type ][ state ].left && device[ type ][ state ].left !== '' )
	}

	// return first value based on device type and hover state
	const deviceFirstValue = ( type, state ) => {
		const device = {
			Desktop: desktopValue,
			Tablet: tabletValue,
			Mobile: mobileValue,
		}

		return props.enableTop ? device[ type ][ state ].top
			: props.enableRight ? device[ type ][ state ].right
				: props.enableBottom ? device[ type ][ state ].bottom
					: device[ type ][ state ].left
	}

	// fallback values for the first value
	const desktopFirstValueFallback = {
		normal: hasFirstValue( 'Desktop', 'normal' ) ? { value: deviceFirstValue( 'Desktop', 'normal' ), unit: desktopUnit.normal } : { value: '', unit: desktopUnit.normal },
	}
	// display desktop normal state value if desktop hover state is not set
	desktopFirstValueFallback.hover = desktopFirstValueFallback.normal
	desktopFirstValueFallback[ 'parent-hover' ] = desktopFirstValueFallback.normal

	const tabletFirstValueFallback = {
		// display tablet normal state value if set, else display desktop normal state value
		normal: hasFirstValue( 'Tablet', 'normal' ) ? { value: deviceFirstValue( 'Tablet', 'normal' ), unit: tabletUnit.normal } : desktopFirstValueFallback.normal,
	}
	// display desktop hover state value if it exists, else display tablet/desktop normal state value
	tabletFirstValueFallback.hover = hasFirstValue( 'Desktop', 'hover' )
		? { value: deviceFirstValue( 'Desktop', 'hover' ), unit: desktopUnit.hover }
		: tabletFirstValueFallback.normal
	tabletFirstValueFallback[ 'parent-hover' ] = hasFirstValue( 'Desktop', 'parent-hover' )
		? { value: deviceFirstValue( 'Desktop', 'parent-hover' ), unit: desktopUnit[ 'parent-hover' ] }
		: tabletFirstValueFallback.normal

	const mobileFirstValueFallback = {
		// display mobile normal state value if set, else display tablet/desktop normal state value
		normal: hasFirstValue( 'Mobile', 'normal' ) ? { value: deviceFirstValue( 'Mobile', 'normal' ), unit: mobileUnit.normal } : tabletFirstValueFallback.normal,
	}
	// display tablet hover state value if it exists, else display mobile normal state value if it exists
	// else display desktop hover state value or tablet/desktop normal state value
	mobileFirstValueFallback.hover = hasFirstValue( 'Tablet', 'hover' )
		? { value: deviceFirstValue( 'Tablet', 'hover' ), unit: tabletUnit.hover }
		: ( hasFirstValue( 'Mobile', 'normal' )
			? { value: deviceFirstValue( 'Mobile', 'normal' ), unit: mobileUnit.normal }
			: tabletFirstValueFallback.hover )
	mobileFirstValueFallback[ 'parent-hover' ] = hasFirstValue( 'Tablet', 'parent-hover' )
		? { value: deviceFirstValue( 'Tablet', 'parent-hover' ), unit: mobileUnit[ 'parent-hover' ] }
		: ( hasFirstValue( 'Mobile', 'normal' )
			? { value: deviceFirstValue( 'Mobile', 'normal' ), unit: mobileUnit.normal }
			: tabletFirstValueFallback[ 'parent-hover' ] )

	const deviceHasValue = ( type, state ) => {
		const device = {
			Desktop: desktopValue,
			Tablet: tabletValue,
			Mobile: mobileValue,
		}

		return {
			top: device[ type ][ state ] && device[ type ][ state ] !== '' && device[ type ][ state ].top && device[ type ][ state ].top !== '',
			right: device[ type ][ state ] && device[ type ][ state ] !== '' && device[ type ][ state ].right && device[ type ][ state ].right !== '',
			bottom: device[ type ][ state ] && device[ type ][ state ] !== '' && device[ type ][ state ].bottom && device[ type ][ state ].bottom !== '',
			left: device[ type ][ state ] && device[ type ][ state ] !== '' && device[ type ][ state ].left && device[ type ][ state ].left !== '',
		}
	}

	const deviceValue = ( type, state ) => {
		const device = {
			Desktop: desktopValue,
			Tablet: tabletValue,
			Mobile: mobileValue,
		}
		return {
			top: device[ type ][ state ].top,
			right: device[ type ][ state ].right,
			bottom: device[ type ][ state ].bottom,
			left: device[ type ][ state ].left,
		}
	}

	const deviceFallbackValue = position => {
		const desktopFallbackValue = {
			normal: deviceHasValue( 'Desktop', 'normal' )[ position ]
				? { value: deviceValue( 'Desktop', 'normal' )[ position ], unit: desktopUnit.normal }
				: { value: '', unit: desktopUnit.normal },
		}
		// display normal state value if desktop hover state is not set
		desktopFallbackValue.hover = desktopFallbackValue.normal
		desktopFallbackValue[ 'parent-hover' ] = desktopFallbackValue.normal

		const tabletFallbackValue = {
			normal: deviceHasValue( 'Tablet', 'normal' )[ position ]
				? { value: deviceValue( 'Tablet', 'normal' )[ position ], unit: tabletUnit.normal }
				: desktopFallbackValue.normal,
		}
		// tablet placeholder will display desktop hover state value, or tablet/desktop normal state value
		tabletFallbackValue.hover = deviceHasValue( 'Desktop', 'hover' )[ position ]
			? { value: deviceValue( 'Desktop', 'hover' )[ position ], unit: desktopUnit.hover }
			: tabletFallbackValue.normal
		tabletFallbackValue[ 'parent-hover' ] = deviceHasValue( 'Desktop', 'parent-hover' )[ position ]
			? {
				value: deviceValue( 'Desktop', 'parent-hover' )[ position ],
				unit: desktopUnit[ 'parent-hover' ],
			} : tabletFallbackValue.normal

		const mobileFallbackValue = {
			normal: deviceHasValue( 'Mobile', 'normal' )[ position ]
				? { value: deviceValue( 'Mobile', 'normal' )[ position ], unit: mobileUnit.normal }
				: tabletFallbackValue.normal,
		}

		// mobile placeholder will display tablet hover state value, or mobile normal state value,
		// or desktop hover state value or tablet/desktop normal state value
		mobileFallbackValue.hover = deviceHasValue( 'Tablet', 'hover' )[ position ]
			? { value: deviceValue( 'Tablet', 'hover' )[ position ], unit: tabletUnit.hover }
			: ( deviceHasValue( 'Mobile', 'normal' )[ position ]
				? { value: deviceValue( 'Mobile', 'normal' )[ position ], unit: mobileUnit.normal }
				: tabletFallbackValue.hover )
		mobileFallbackValue[ 'parent-hover' ] = deviceHasValue( 'Tablet', 'parent-hover' )[ position ]
			? {
				value: deviceValue( 'Tablet', 'parent-hover' )[ position ],
				unit: mobileUnit[ 'parent-hover' ],
			} : ( deviceHasValue( 'Mobile', 'normal' )[ position ]
				? { value: deviceValue( 'Mobile', 'normal' )[ position ], unit: mobileUnit.normal }
				: tabletFallbackValue[ 'parent-hover' ] )

		return {
			desktopFallbackValue,
			tabletFallbackValue,
			mobileFallbackValue,
		}
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
						initialPosition={ ( () => {
							if ( deviceType === 'Mobile' ) {
								return unit === mobileFirstValueFallback[ currentHoverState ].unit ? mobileFirstValueFallback[ currentHoverState ].value : ''
							} else if ( deviceType === 'Tablet' ) {
								return unit === tabletFirstValueFallback[ currentHoverState ].unit ? tabletFirstValueFallback[ currentHoverState ].value : ''
							} else if ( deviceType === 'Desktop' && currentHoverState !== 'normal' ) {
								return unit === desktopFirstValueFallback[ currentHoverState ].unit ? desktopFirstValueFallback[ currentHoverState ].value : ''
							}
							return propsToPass.initialPosition
						} )() }
						placeholder={ ( () => {
							if ( deviceType === 'Mobile' ) {
								return unit === mobileFirstValueFallback[ currentHoverState ].unit ? mobileFirstValueFallback[ currentHoverState ].value : ''
							} else if ( deviceType === 'Tablet' ) {
								return unit === tabletFirstValueFallback[ currentHoverState ].unit ? tabletFirstValueFallback[ currentHoverState ].value : ''
							} else if ( deviceType === 'Desktop' && currentHoverState !== 'normal' ) {
								return unit === desktopFirstValueFallback[ currentHoverState ].unit ? desktopFirstValueFallback[ currentHoverState ].value : ''
							}
							return propsToPass.placeholder
						} )() }
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
							initialPosition={ ( () => {
								const {
									desktopFallbackValue,
									tabletFallbackValue,
									mobileFallbackValue,
								} = deviceFallbackValue( 'top' )

								if ( deviceType === 'Mobile' ) {
									return unit === mobileFallbackValue[ currentHoverState ].unit ? mobileFallbackValue[ currentHoverState ].value : ''
								} else if ( deviceType === 'Tablet' ) {
									return unit === tabletFallbackValue[ currentHoverState ].unit ? tabletFallbackValue[ currentHoverState ].value : ''
								} else if ( deviceType === 'Desktop' && currentHoverState !== 'normal' ) {
									return unit === desktopFallbackValue[ currentHoverState ].unit ? desktopFallbackValue[ currentHoverState ].value : ''
								}

								return propsToPass.initialPosition
							} )() }
							placeholder={ ( () => {
								const {
									desktopFallbackValue,
									tabletFallbackValue,
									mobileFallbackValue,
								} = deviceFallbackValue( 'top' )

								if ( deviceType === 'Mobile' ) {
									return unit === mobileFallbackValue[ currentHoverState ].unit ? mobileFallbackValue[ currentHoverState ].value : ''
								} else if ( deviceType === 'Tablet' ) {
									return unit === tabletFallbackValue[ currentHoverState ].unit ? tabletFallbackValue[ currentHoverState ].value : ''
								} else if ( deviceType === 'Desktop' && currentHoverState !== 'normal' ) {
									return unit === desktopFallbackValue[ currentHoverState ].unit ? desktopFallbackValue[ currentHoverState ].value : ''
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
								const {
									desktopFallbackValue,
									tabletFallbackValue,
									mobileFallbackValue,
								} = deviceFallbackValue( 'left' )

								if ( deviceType === 'Mobile' ) {
									return unit === mobileFallbackValue[ currentHoverState ].unit ? mobileFallbackValue[ currentHoverState ].value : ''
								} else if ( deviceType === 'Tablet' ) {
									return unit === tabletFallbackValue[ currentHoverState ].unit ? tabletFallbackValue[ currentHoverState ].value : ''
								} else if ( deviceType === 'Desktop' && currentHoverState !== 'normal' ) {
									return unit === desktopFallbackValue[ currentHoverState ].unit ? desktopFallbackValue[ currentHoverState ].value : ''
								}

								return propsToPass.initialPosition
							} )() }
							placeholder={ ( () => {
								const {
									desktopFallbackValue,
									tabletFallbackValue,
									mobileFallbackValue,
								} = deviceFallbackValue( 'left' )

								if ( deviceType === 'Mobile' ) {
									return unit === mobileFallbackValue[ currentHoverState ].unit ? mobileFallbackValue[ currentHoverState ].value : ''
								} else if ( deviceType === 'Tablet' ) {
									return unit === tabletFallbackValue[ currentHoverState ].unit ? tabletFallbackValue[ currentHoverState ].value : ''
								} else if ( deviceType === 'Desktop' && currentHoverState !== 'normal' ) {
									return unit === desktopFallbackValue[ currentHoverState ].unit ? desktopFallbackValue[ currentHoverState ].value : ''
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
								{ ...propsToPass }
								value={ value.top }
								onChange={ onChangeTop }
								allowReset={ false }
								initialPosition={ ( () => {
									const {
										desktopFallbackValue,
										tabletFallbackValue,
										mobileFallbackValue,
									} = deviceFallbackValue( 'top' )

									if ( deviceType === 'Mobile' ) {
										return unit === mobileFallbackValue[ currentHoverState ].unit ? mobileFallbackValue[ currentHoverState ].value : ''
									} else if ( deviceType === 'Tablet' ) {
										return unit === tabletFallbackValue[ currentHoverState ].unit ? tabletFallbackValue[ currentHoverState ].value : ''
									} else if ( deviceType === 'Desktop' && currentHoverState !== 'normal' ) {
										return unit === desktopFallbackValue[ currentHoverState ].unit ? desktopFallbackValue[ currentHoverState ].value : ''
									}

									return propsToPass.initialPosition
								} )() }
								placeholder={ ( () => {
									const {
										desktopFallbackValue,
										tabletFallbackValue,
										mobileFallbackValue,
									} = deviceFallbackValue( 'top' )

									if ( deviceType === 'Mobile' ) {
										return unit === mobileFallbackValue[ currentHoverState ].unit ? mobileFallbackValue[ currentHoverState ].value : ''
									} else if ( deviceType === 'Tablet' ) {
										return unit === tabletFallbackValue[ currentHoverState ].unit ? tabletFallbackValue[ currentHoverState ].value : ''
									} else if ( deviceType === 'Desktop' && currentHoverState !== 'normal' ) {
										return unit === desktopFallbackValue[ currentHoverState ].unit ? desktopFallbackValue[ currentHoverState ].value : ''
									}

									return typeof props.placeholderTop === 'undefined' ? propsToPass.placeholder : props.placeholderTop
								} )() }
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
							<Tooltip text={ props.isCorner ? __( 'Top Right', i18n ) : __( 'Right', i18n ) }>
								<span className="ugb-four-range-control__icon">{ props.isCorner ? <SVGUpperRightImage /> : <SVGRightImage /> }</span>
							</Tooltip>
							<RangeControl
								{ ...propsToPass }
								value={ value.right }
								onChange={ onChangeRight }
								allowReset={ false }
								initialPosition={ ( () => {
									const {
										desktopFallbackValue,
										tabletFallbackValue,
										mobileFallbackValue,
									} = deviceFallbackValue( 'right' )

									if ( deviceType === 'Mobile' ) {
										return unit === mobileFallbackValue[ currentHoverState ].unit ? mobileFallbackValue[ currentHoverState ].value : ''
									} else if ( deviceType === 'Tablet' ) {
										return unit === tabletFallbackValue[ currentHoverState ].unit ? tabletFallbackValue[ currentHoverState ].value : ''
									} else if ( deviceType === 'Desktop' && currentHoverState !== 'normal' ) {
										return unit === desktopFallbackValue[ currentHoverState ].unit ? desktopFallbackValue[ currentHoverState ].value : ''
									}

									return propsToPass.initialPosition
								} )() }
								placeholder={ ( () => {
									const {
										desktopFallbackValue,
										tabletFallbackValue,
										mobileFallbackValue,
									} = deviceFallbackValue( 'right' )

									if ( deviceType === 'Mobile' ) {
										return unit === mobileFallbackValue[ currentHoverState ].unit ? mobileFallbackValue[ currentHoverState ].value : ''
									} else if ( deviceType === 'Tablet' ) {
										return unit === tabletFallbackValue[ currentHoverState ].unit ? tabletFallbackValue[ currentHoverState ].value : ''
									} else if ( deviceType === 'Desktop' && currentHoverState !== 'normal' ) {
										return unit === desktopFallbackValue[ currentHoverState ].unit ? desktopFallbackValue[ currentHoverState ].value : ''
									}

									return typeof props.placeholderRight === 'undefined' ? propsToPass.placeholder : props.placeholderRight
								} )() }
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
							<Tooltip text={ props.isCorner ? __( 'Bottom Left', i18n ) : __( 'Bottom', i18n ) }>
								<span className="ugb-four-range-control__icon">{ props.isCorner ? <SVGLowerLeftImage /> : <SVGBottomImage /> }</span>
							</Tooltip>
							<RangeControl
								{ ...propsToPass }
								value={ value.bottom }
								onChange={ onChangeBottom }
								allowReset={ false }
								initialPosition={ ( () => {
									const {
										desktopFallbackValue,
										tabletFallbackValue,
										mobileFallbackValue,
									} = deviceFallbackValue( 'bottom' )

									if ( deviceType === 'Mobile' ) {
										return unit === mobileFallbackValue[ currentHoverState ].unit ? mobileFallbackValue[ currentHoverState ].value : ''
									} else if ( deviceType === 'Tablet' ) {
										return unit === tabletFallbackValue[ currentHoverState ].unit ? tabletFallbackValue[ currentHoverState ].value : ''
									} else if ( deviceType === 'Desktop' && currentHoverState !== 'normal' ) {
										return unit === desktopFallbackValue[ currentHoverState ].unit ? desktopFallbackValue[ currentHoverState ].value : ''
									}

									return propsToPass.initialPosition
								} )() }
								placeholder={ ( () => {
									const {
										desktopFallbackValue,
										tabletFallbackValue,
										mobileFallbackValue,
									} = deviceFallbackValue( 'bottom' )

									if ( deviceType === 'Mobile' ) {
										return unit === mobileFallbackValue[ currentHoverState ].unit ? mobileFallbackValue[ currentHoverState ].value : ''
									} else if ( deviceType === 'Tablet' ) {
										return unit === tabletFallbackValue[ currentHoverState ].unit ? tabletFallbackValue[ currentHoverState ].value : ''
									} else if ( deviceType === 'Desktop' && currentHoverState !== 'normal' ) {
										return unit === desktopFallbackValue[ currentHoverState ].unit ? desktopFallbackValue[ currentHoverState ].value : ''
									}

									return typeof props.placeholderBottom === 'undefined' ? propsToPass.placeholder : props.placeholderBottom
								} )() }
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
							<Tooltip text={ props.isCorner ? __( 'Bottom Right', i18n ) : __( 'Left', i18n ) }>
								<span className="ugb-four-range-control__icon">{ props.isCorner ? <SVGLowerRightImage /> : <SVGLeftImage /> }</span>
							</Tooltip>
							<RangeControl
								{ ...propsToPass }
								value={ value.left }
								onChange={ onChangeLeft }
								allowReset={ false }
								initialPosition={ ( () => {
									const {
										desktopFallbackValue,
										tabletFallbackValue,
										mobileFallbackValue,
									} = deviceFallbackValue( 'left' )

									if ( deviceType === 'Mobile' ) {
										return unit === mobileFallbackValue[ currentHoverState ].unit ? mobileFallbackValue[ currentHoverState ].value : ''
									} else if ( deviceType === 'Tablet' ) {
										return unit === tabletFallbackValue[ currentHoverState ].unit ? tabletFallbackValue[ currentHoverState ].value : ''
									} else if ( deviceType === 'Desktop' && currentHoverState !== 'normal' ) {
										return unit === desktopFallbackValue[ currentHoverState ].unit ? desktopFallbackValue[ currentHoverState ].value : ''
									}

									return propsToPass.initialPosition
								} )() }
								placeholder={ ( () => {
									const {
										desktopFallbackValue,
										tabletFallbackValue,
										mobileFallbackValue,
									} = deviceFallbackValue( 'left' )

									if ( deviceType === 'Mobile' ) {
										return unit === mobileFallbackValue[ currentHoverState ].unit ? mobileFallbackValue[ currentHoverState ].value : ''
									} else if ( deviceType === 'Tablet' ) {
										return unit === tabletFallbackValue[ currentHoverState ].unit ? tabletFallbackValue[ currentHoverState ].value : ''
									} else if ( deviceType === 'Desktop' && currentHoverState !== 'normal' ) {
										return unit === desktopFallbackValue[ currentHoverState ].unit ? desktopFallbackValue[ currentHoverState ].value : ''
									}

									return typeof props.placeholderLeft === 'undefined' ? propsToPass.placeholder : props.placeholderLeft
								} )() }
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

	isCorner: false,
}

export default memo( FourRangeControl )
