import { __ } from '@wordpress/i18n'
import { AdvancedRangeControl } from '@stackable/components'

const FontSizeControl = props => {
	return (
		<AdvancedRangeControl
			min={ [ 5, 0.1 ] }
			max={ [ 100, 3 ] }
			step={ [ 1, 0.05 ] }
			units={ [ 'px', 'em' ] }
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
	label: __( 'Font Size' ),
	value: '',
	onChange: () => {},
	unit: 'px',
	onChangeUnit: () => {},
}

export default FontSizeControl
