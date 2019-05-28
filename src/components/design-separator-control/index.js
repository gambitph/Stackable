import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { BaseControl } from '@wordpress/components'
import { DesignControl } from '@stackable/components'
import ImageDesignCurve1 from './images/curve-1.png'
import ImageDesignCurve2 from './images/curve-2.png'
import ImageDesignCurve3 from './images/curve-3.png'
import ImageDesignRounded1 from './images/rounded-1.png'
import ImageDesignRounded2 from './images/rounded-2.png'
import ImageDesignSlant1 from './images/slant-1.png'
import ImageDesignSlant2 from './images/slant-2.png'
import ImageDesignStraight1 from './images/straight-1.png'
import ImageDesignWave1 from './images/wave-1.png'
import ImageDesignWave2 from './images/wave-2.png'
import ImageDesignWave3 from './images/wave-3.png'
import { omit } from 'lodash'

const designs = {
	'wave-1': {
		image: ImageDesignWave1, label: __( 'Wave 1' ), value: 'wave-1',
	},
	'straight-1': {
		image: ImageDesignStraight1, label: __( 'Straight' ), value: 'straight-1',
	},
	'wave-2': {
		image: ImageDesignWave2, label: __( 'Wave 2' ), value: 'wave-2',
	},
	'wave-3': {
		image: ImageDesignWave3, label: __( 'Wave 3' ), value: 'wave-3',
	},
	'slant-1': {
		image: ImageDesignSlant1, label: __( 'Slant 1' ), value: 'slant-1',
	},
	'slant-2': {
		image: ImageDesignSlant2, label: __( 'Slant 2' ), value: 'slant-2',
	},
	'curve-1': {
		image: ImageDesignCurve1, label: __( 'Curve 1' ), value: 'curve-1',
	},
	'curve-2': {
		image: ImageDesignCurve2, label: __( 'Curve 2' ), value: 'curve-2',
	},
	'curve-3': {
		image: ImageDesignCurve3, label: __( 'Curve 3' ), value: 'curve-3',
	},
	'rounded-1': {
		image: ImageDesignRounded1, label: __( 'Rounded 1' ), value: 'rounded-1',
	},
	'rounded-2': {
		image: ImageDesignRounded2, label: __( 'Rounded 2' ), value: 'rounded-2',
	},
}

const DesignSeparatorControl = props => {
	const options = Object.keys( designs )
		.filter( design => ! props.excludeDesigns.includes( design ) )
		.map( design => designs[ design ] )

	return (
		<BaseControl
			className="ugb-design-separator-control"
			label={ props.label }
			help={ props.help }
		>
			<DesignControl
				options={ applyFilters( 'stackable.separator.edit.designs', options, props ) }
				{ ...omit( props, [ 'label', 'help' ] ) }
			/>
		</BaseControl>
	)
}

DesignSeparatorControl.defaultProps = {
	label: '',
	help: '',
	excludeDesigns: [],
}

export default DesignSeparatorControl
