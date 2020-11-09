/**
 * Internal dependencies
 */
import BaseControlMultiLabel from '../base-control-multi-label'

/**
 * WordPress dependencies
 */
import { BaseControl, RangeControl } from '@wordpress/components'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { omit } from 'lodash'
import { getSelectedScreen } from '~stackable/util'

export const convertToNumber = value => {
	if ( typeof value === 'string' && value !== '' && value.match( /^[\d.]+$/ ) ) {
		return value.includes( '.' ) ? parseFloat( value ) : parseInt( value, 10 )
	}
	return value
}

const AdvancedRangeControl = props => {
	const propsToPass = { ...omit( props, [ 'className', 'help', 'label', 'units', 'unit', 'onChangeUnit', 'screens', 'placeholder', 'initialPosition' ] ) }

	// Change the min, max & step values depending on the unit used.
	const i = props.units.indexOf( props.unit ) < 0 ? 0 : props.units.indexOf( props.unit )
	if ( Array.isArray( props.min ) ) {
		propsToPass.min = props.min[ i ]
	}
	if ( Array.isArray( props.max ) ) {
		propsToPass.max = props.max[ i ]
	}
	if ( Array.isArray( props.step ) ) {
		propsToPass.step = props.step[ i ]
	}
	propsToPass.initialPosition = props.initialPosition !== '' ? props.initialPosition : props.placeholder

	propsToPass.placeholder = '20'
	let placeholder = props.placeholder

	// Different placeholders can be used for different screens.
	// Placeholders can be an object like:
	// { desktop: 20, tablet: 30, mobile: 40 }
	// or for different units
	// { desktop: [ 21, 22 ], tablet: [ 31, 32 ], mobile: [ 41, 42 ] }
	if ( ! Array.isArray( placeholder ) && typeof placeholder === 'object' ) {
		// If the passed placeholder is an object
		const screenSize = getSelectedScreen() || 'desktop'
		if ( typeof placeholder[ screenSize ] !== 'undefined' ) {
			placeholder = placeholder[ screenSize ]
		} else {
			placeholder = placeholder[ Object.keys( placeholder )[ 0 ] ]
		}
		// Placeholder can be an array for different units.
		if ( Array.isArray( placeholder ) ) {
			propsToPass.placeholder = placeholder[ i ] || ''
			propsToPass.initialPosition = placeholder[ i ] || ''
		} else {
			propsToPass.placeholder = placeholder || ''
			propsToPass.initialPosition = placeholder || ''
		}
		if ( Array.isArray( props.initialPosition ) ) {
			propsToPass.initialPosition = props.initialPosition[ i ] || ''
		}

		// Initial position needs to be an actual number.
		propsToPass.initialPosition = convertToNumber( propsToPass.initialPosition )
	} else if ( Array.isArray( placeholder ) && props.screen === 'desktop' ) {
		// If the passed placeholder is an array
		propsToPass.placeholder = placeholder[ i ] || ''
		propsToPass.initialPosition = placeholder[ i ] || ''

		if ( Array.isArray( props.initialPosition ) ) {
			propsToPass.initialPosition = props.initialPosition[ i ] || ''
		}
	} else if ( props.screen && props.screen !== 'desktop' ) {
		// If the passed placeholder is a not an object or an array, and the current screen is not desktop.
		propsToPass.placeholder = ''
		propsToPass.initialPosition = ''
	}

	// Sets the default value to the value of the initlaPosition if value is an empty string
	propsToPass.value = props.value === '' ? propsToPass.initialPosition : props.value
	propsToPass.resetFallbackValue = propsToPass.placeholder

	return (
		<BaseControl
			help={ props.help }
			className={ classnames( 'ugb-advanced-range-control', props.className ) }
		>
			<BaseControlMultiLabel
				label={ props.label }
				units={ props.units }
				unit={ props.unit }
				onChangeUnit={ props.onChangeUnit }
				screens={ props.screens }
			/>
			<RangeControl
				{ ...propsToPass }
			/>
		</BaseControl>
	)
}

AdvancedRangeControl.defaultProps = {
	onChange: () => {},
	onChangeUnit: () => {},
	help: '',
	className: '',
	units: [ 'px' ],
	unit: 'px',
	screens: [ 'desktop' ],
	placeholder: '',
	initialPosition: '',
}

export default AdvancedRangeControl
