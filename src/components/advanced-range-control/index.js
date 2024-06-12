/**
 * Internal dependencies
 */
import RangeControl from './range-control'
import { useControlHandlers } from '../base-control2/hooks'
import AdvancedControl, { extractControlProps } from '../base-control2'
import DynamicContentControl, { useDynamicContentControlProps } from '../dynamic-content-control'
import { ResetButton } from '../base-control2/reset-button'
import {
	useAttributeName,
	useBlockAttributesContext,
	useBlockHoverState,
	useDeviceType,
} from '~stackable/hooks'

/**
 * External dependencies
 */
import { isEqual } from 'lodash'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const AdvancedRangeControl = props => {
	const [ value, onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover, props.valueCallback, props.changeCallback )
	const [ propsToPass, controlProps ] = extractControlProps( props )

	const deviceType = useDeviceType()
	const [ currentHoverState ] = useBlockHoverState()
	const hasUnits = !! props.units?.length
	const unitAttrName = useAttributeName( `${ props.attribute }Unit`, props.responsive, props.hover )
	const {
		unitAttribute,
		desktopValue,
		tabletValue,
		mobileValue,
		desktopUnit,
		tabletUnit,
		mobileUnit,
	} = useBlockAttributesContext( attributes => {
		return {
			unitAttribute: attributes[ unitAttrName ],
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

	const desktopHasValue = {
		normal: desktopValue.normal && desktopValue.normal !== '',
		hover: desktopValue.hover && desktopValue.hover !== '',
		'parent-hover': desktopValue[ 'parent-hover' ] && desktopValue[ 'parent-hover' ] !== '',
	}

	const tabletHasValue = {
		normal: tabletValue.normal && tabletValue.normal !== '',
		hover: tabletValue.hover && tabletValue.hover !== '',
		'parent-hover': tabletValue[ 'parent-hover' ] && tabletValue[ 'parent-hover' ] !== '',
	}

	const mobileHasValue = {
		normal: mobileValue.normal && mobileValue.normal !== '',
	}

	const desktopFallbackValue = {
		normal: desktopHasValue.normal ? { value: desktopValue.normal, unit: desktopUnit.normal }
			: { value: '', unit: desktopUnit.normal },
	}
	desktopFallbackValue.hover = desktopFallbackValue.normal
	desktopFallbackValue[ 'parent-hover' ] = desktopFallbackValue.normal

	const tabletFallbackValue = {
		normal: tabletHasValue.normal ? { value: tabletValue.normal, unit: tabletUnit.normal }
			: desktopFallbackValue.normal,
	}
	// if desktop has hover state, display desktop hover state value else display tablet normal state value
	tabletFallbackValue.hover = desktopHasValue.hover ? { value: desktopValue.hover, unit: desktopUnit.hover }
		: tabletFallbackValue.normal
	tabletFallbackValue[ 'parent-hover' ] = desktopHasValue[ 'parent-hover' ]
		? { value: desktopValue[ 'parent-hover' ], unit: desktopUnit[ 'parent-hover' ] }
		: tabletFallbackValue.normal

	const mobileFallbackValue = {
		normal: mobileHasValue.normal ? { value: mobileValue.normal, unit: mobileUnit.normal } : tabletFallbackValue.normal,
	}
	// if tablet has hover state, display tablet hover state value
	// else if mobile has normal state value display mobile normal state value
	// else display desktop hover state value or tablet normal state value
	mobileFallbackValue.hover = tabletHasValue.hover ? { value: tabletValue.hover, unit: tabletUnit.hover }
		: ( mobileHasValue.normal ? { value: mobileValue.normal, unit: mobileUnit.normal }
			: tabletFallbackValue.hover )
	mobileFallbackValue[ 'parent-hover' ] = tabletHasValue[ 'parent-hover' ]
		? { value: tabletValue[ 'parent-hover' ], unit: tabletUnit[ 'parent-hover' ] }
		: ( mobileHasValue.normal ? { value: mobileValue.normal, unit: mobileUnit.normal }
			: tabletFallbackValue[ 'parent-hover' ] )

	const unit = typeof props.unit === 'string'
		? ( props.unit || props.units?.[ 0 ] || 'px' )
		: ( unitAttribute || '' )

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
		propsToPass.initialPosition = props.initialPosition !== '' ? props.initialPosition : props.placeholder

		// If the unit was not the default, remove the placeholder.
		if ( i !== 0 ) {
			propsToPass.initialPosition = ''
			propsToPass.placeholder = ''
		}
	}

	// Remove the placeholder.
	if ( ! props.forcePlaceholder ) {
		propsToPass.initialPosition = ''
		propsToPass.placeholder = ''
	}

	if ( deviceType === 'Mobile' ) {
		propsToPass.initialPosition = unitAttribute === mobileFallbackValue[ currentHoverState ].unit ? mobileFallbackValue[ currentHoverState ].value : ''
		propsToPass.placeholder = unitAttribute === mobileFallbackValue[ currentHoverState ].unit ? mobileFallbackValue[ currentHoverState ].value : ''
	} else if ( deviceType === 'Tablet' ) {
		propsToPass.initialPosition = unitAttribute === tabletFallbackValue[ currentHoverState ].unit ? tabletFallbackValue[ currentHoverState ].value : ''
		propsToPass.placeholder = unitAttribute === tabletFallbackValue[ currentHoverState ].unit ? tabletFallbackValue[ currentHoverState ].value : ''
	} else {
		propsToPass.initialPosition = unitAttribute === desktopFallbackValue[ currentHoverState ].unit ? desktopFallbackValue[ currentHoverState ].value : ''
		propsToPass.placeholder = unitAttribute === desktopFallbackValue[ currentHoverState ].unit ? desktopFallbackValue[ currentHoverState ].value : ''
	}

	let placeholderRender = props.placeholderRender
	if ( hasUnits && unit !== props.units[ 0 ] ) {
		placeholderRender = null
	}

	// If this supports dynamic content, then the value should be saved as a String.
	// Important, the attribute type for this option should be a string.
	const _onChange = value => {
		const onChangeFunc = typeof props.onChange === 'undefined' ? onChange : props.onChange
		onChangeFunc( props.isDynamic ? value.toString() : value )
	}

	const derivedValue = typeof props.value === 'undefined' ? value : props.value

	const dynamicContentProps = useDynamicContentControlProps( {
		value: derivedValue,
		onChange: _onChange,
	} )

	return (
		<AdvancedControl { ...controlProps }>
			<DynamicContentControl
				enable={ propsToPass.isDynamic }
				controlHasTooltip
				{ ...dynamicContentProps }
			>
				<RangeControl
					{ ...propsToPass }
					value={ propsToPass.isDynamic ? parseFloat( derivedValue ) : derivedValue }
					onChange={ _onChange }
					allowReset={ false }
					placeholderRender={ placeholderRender }
				/>
			</DynamicContentControl>
			<ResetButton
				allowReset={ props.allowReset }
				value={ derivedValue }
				default={ props.default }
				onChange={ _onChange }
			/>
		</AdvancedControl>
	)
}

AdvancedRangeControl.defaultProps = {
	allowReset: true,
	isDynamic: false,
	default: '',

	attribute: '',
	responsive: false,
	hover: false,

	value: undefined,
	onChange: undefined,
	forcePlaceholder: false,
}

export default memo( AdvancedRangeControl, isEqual )
