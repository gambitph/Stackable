/**
 * Internal dependencies
 */
import ShadowControl from './'

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'

const getShadows = () => {
	return applyFilters( 'stackable.separator.shadows', [
		'none',
		'0 0 1px rgba(120, 120, 120, 0.1)',
		'0 0 2px rgba(120, 120, 120, 0.1)',
		'5px 5px 0 rgba(18, 63, 82, 0.035), 0 0 0 1px rgba(176, 181, 193, 0.2)',
		'0px 2px 20px rgba(153, 153, 153, 0.2)',
		'5px 30px -10px rgba(18, 63, 82, 0.3)',
		'0px 10px 30px rgba(0, 0, 0, 0.05)',
		'7px 5px 30px rgba(72, 73, 121, 0.15)',
		'0px 10px 60px rgba(0, 0, 0, 0.1)',
		'70px 130px -60px rgba(72, 73, 121, 0.38) ',
	] )
}

const valueCallback = value => {
	const shadows = getShadows()
	return value ? shadows.indexOf( value ) : ''
}

const changeCallback = index => {
	const shadows = getShadows()
	return index !== '' ? shadows[ index ] : index
}

export const SeparatorShadowControl = props => {
	const shadows = useMemo( () => getShadows(), [] )

	return (
		<ShadowControl
			{ ...props }
			valueCallback={ valueCallback }
			changeCallback={ changeCallback }
			max={ shadows.length - 1 }
		/>
	)
}
