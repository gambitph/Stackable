/**
 * External dependencies
 */
import { DesignControl } from '~stackable/components'
import {
	findIndex,
} from 'lodash'
import AdvancedControl, { extractControlProps } from '~stackable/components/base-control2'
import { useControlHandlers } from '~stackable/components/base-control2/hooks'

/**
 * Internal dependencies
 */
import { designs } from './designs'

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n'
import {
	applyFilters, addFilter, hasFilter,
} from '@wordpress/hooks'
import { useMemo } from '@wordpress/element'

/**
 * Add the default free layouts.
 */
if ( ! hasFilter( 'stackable.block-component.separator.layouts', 'default' ) ) {
	addFilter( 'stackable.block-component.separator.layouts', 'default', layouts => {
		return [ ...layouts, ...designs ]
	} )
}

const SeparatorControl = props => {
	const {
		excludeDesigns,
		attribute,
		responsive,
		hover,
		valueCallback,
		changeCallback,
		onChange: _onChange,
		value: _value,
	} = props

	const options = useMemo( () =>
		( applyFilters( 'stackable.block-component.separator.layouts', [] ) || [] )
			.filter( layouts =>
				findIndex(
					excludeDesigns,
					excludeDesign => excludeDesign === layouts?.value
				) === -1
			)
	, [ ...excludeDesigns ] )

	const [ value, onChange ] = useControlHandlers( attribute, responsive, hover, valueCallback, changeCallback )
	const [ propsToPass, controlProps ] = extractControlProps( props )

	return (
		<AdvancedControl { ...controlProps }>
			<DesignControl
				{ ...propsToPass }
				options={ options }
				selected={ _value === undefined ? value : _value }
				onChange={ _onChange === undefined ? onChange : _onChange }
			/>
		</AdvancedControl>
	)
}

SeparatorControl.defaultProps = {
	excludeDesigns: [],
	attribute: '',
}

export default SeparatorControl
