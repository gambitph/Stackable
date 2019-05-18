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
