/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'

export const Style = memo( props => {
	const TransformStyles = applyFilters( 'stackable.block-component.transform.style', null )
	return TransformStyles && <TransformStyles { ...props } />
} )

Style.Content = props => {
	const TransformStyles = applyFilters( 'stackable.block-component.transform.style.content', null )
	return TransformStyles && <TransformStyles { ...props } />
}
