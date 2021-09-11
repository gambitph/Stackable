/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const Style = props => {
	return (
		<>
			{ applyFilters( 'stackable.block-component.transform.style', null, props ) }
		</>
	)
}

Style.Content = props => {
	return (
		<>
			{ applyFilters( 'stackable.block-component.transform.style.content', null, props ) }
		</>
	)
}
