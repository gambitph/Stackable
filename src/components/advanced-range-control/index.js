/**
 * Internal dependencies
 */
import RangeControl from './range-control'
import { useControlHandlers } from '../base-control2/hooks'
import AdvancedControl, { extractControlProps } from '../base-control2'
import { ResetButton } from '../base-control2/reset-button'
import {
	useAttributeName,
	useBlockAttributes,
	useBlockHoverState,
	useDeviceType,
} from '~stackable/hooks'

/**
 * External dependencies
 */
import { memo } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const AdvancedRangeControl = props => {
	const [ value, onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover, props.valueCallback, props.onChangeCallback )
	const [ propsToPass, controlProps ] = extractControlProps( props )

	const deviceType = useDeviceType()
	const [ currentHoverState ] = useBlockHoverState()
	const hasUnits = !! props.units?.length
	const unitAttrName = useAttributeName( `${ props.attribute }Unit`, props.responsive, props.hover )

	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	const unit = typeof props.unit === 'string'
		? ( props.unit || props.units?.[ 0 ] || 'px' )
		: attributes
			? attributes[ unitAttrName ]
			: ''

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
	if ( deviceType !== 'Desktop' || currentHoverState !== 'normal' ) {
		propsToPass.initialPosition = ''
		propsToPass.placeholder = ''
	}

	let placeholderRender = props.placeholderRender
	if ( deviceType !== 'Desktop' || currentHoverState !== 'normal' || ( hasUnits && unit !== props.units[ 0 ] ) ) {
		placeholderRender = null
	}

	return (
		<AdvancedControl { ...controlProps }>
			<RangeControl
				{ ...propsToPass }
				value={ typeof props.value === 'undefined' ? value : props.value }
				onChange={ typeof props.onChange === 'undefined' ? onChange : props.onChange }
				allowReset={ false }
				placeholderRender={ placeholderRender }
			/>
			<ResetButton
				allowReset={ props.allowReset }
				value={ typeof props.value === 'undefined' ? value : props.value }
				default={ props.default }
				onChange={ typeof props.onChange === 'undefined' ? onChange : props.onChange }
			/>
		</AdvancedControl>
	)
}

AdvancedRangeControl.defaultProps = {
	allowReset: true,
	default: '',

	attribute: '',
	responsive: false,
	hover: false,

	value: undefined,
	onChange: undefined,
}

export default memo( AdvancedRangeControl )
