/**
 * External dependencies
 */
import { AdvancedRangeControl } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'

const FontSizeControl = props => {
	let passedPlaceholder = props.placeholder

	const pxToEm = ( value = '', baseValue = 21 ) => {
		if ( value === '' ) {
			return 1
		}

		return Math.round( ( parseFloat( value ) / parseFloat( baseValue ) ) * 10 ) / 10
	}

	const emToPx = ( value = '', baseValue = 21 ) => {
		if ( value === '' ) {
			return 21
		}

		return Math.round( parseFloat( value ) * baseValue )
	}

	if ( typeof passedPlaceholder === 'string' ) {
		// Add a converted EM unit whenever the user changes the unit.
		passedPlaceholder = [ passedPlaceholder, pxToEm( passedPlaceholder ) ]
	}

	return (
		<AdvancedRangeControl
			{ ...props }
			placeholder={ passedPlaceholder }
			onChangeUnit={ value => {
				// Change font-size so as not to surprise the user.
				if ( props.value !== '' ) {
					if ( value === 'em' || value === 'rem' ) {
						props.onChange( pxToEm( props.value ) )
					} else if ( value === 'px' ) {
						props.onChange( emToPx( props.value ) )
					}
				}

				props.onChangeUnit( value )
			} }
		/>
	)
}

FontSizeControl.defaultProps = {
	label: __( 'Font Size', i18n ),
	value: '',
	onChange: () => {},
	unit: 'px',
	onChangeUnit: () => {},
	min: [ 0, 0 ],
	max: [ 150, 7 ],
	step: [ 1, 0.05 ],
	units: [ 'px', 'em' ],
	placeholder: '',
}

export default FontSizeControl
