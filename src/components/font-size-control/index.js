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
	return (
		<AdvancedRangeControl
			min={ [ 10, 0.1 ] }
			max={ [ 100, 3 ] }
			step={ [ 1, 0.05 ] }
			units={ [ 'px', 'em' ] }
			initialPosition="21" // Some typical value of a font so that changing it will not jump the font size.
			{ ...props }
			onChangeUnit={ value => {
				// Change font-size so as not to surprise the user.
				if ( props.value ) {
					if ( value === 'em' || value === 'rem' ) {
						props.onChange( 1.0 )
					} else if ( value === 'px' ) {
						props.onChange( 20 )
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
}

export default FontSizeControl
