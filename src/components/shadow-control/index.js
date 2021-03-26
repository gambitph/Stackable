import { i18n } from 'stackable'
import { AdvancedRangeControl } from '~stackable/components'

import {
	__,
} from '@wordpress/i18n'
import { useMemo } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'

const getShadows = () => {
	return applyFilters( 'stackable.shadows', [
		'',
		'0 0 0 1px rgba(120, 120, 120, 0.1)',
		'0 0 0 2px rgba(120, 120, 120, 0.1)',
		'0 5px 5px 0 rgba(18, 63, 82, 0.035), 0 0 0 1px rgba(176, 181, 193, 0.2)',
		'0px 2px 20px rgba(153, 153, 153, 0.2)',
		'0 5px 30px -10px rgba(18, 63, 82, 0.3)',
		'0px 10px 30px rgba(0, 0, 0, 0.05)',
		'7px 5px 30px rgba(72, 73, 121, 0.15)',
		'0px 10px 60px rgba(0, 0, 0, 0.1)',
		'0px 70px 130px -60px rgba(72, 73, 121, 0.38) ',
	] )
}

// TODO: Turn this into an advanced shadow control
const ShadowControl = props => {
	const shadows = useMemo( () => getShadows(), [] )

	return (
		<AdvancedRangeControl
			{ ...props }
			value={ shadows.indexOf( props.value ) }
			onChange={ index => props.onChange( shadows[ index ] ) }
			min={ 0 }
			max={ shadows.length - 1 }
			allowReset={ true }
			placeholder="0"
			className="ugb--help-tip-general-shadow"
		/>
	)
}

ShadowControl.defaultProps = {
	label: __( 'Shadow / Outline', i18n ),
	value: '',
	onChange: () => {},
}

export default ShadowControl
