/**
 * WordPress dependencies
 */
import { applyFilters, doAction } from '@wordpress/hooks'

export const Style = props => {
	const TransformStyles = applyFilters( 'stackable.block-component.transform.style', null )
	return TransformStyles && <TransformStyles { ...props } />
}

Style.Content = props => {
	const TransformStyles = applyFilters( 'stackable.block-component.transform.style.content', null )
	return TransformStyles && <TransformStyles { ...props } />
}

Style.addStyles = ( blockStyleGenerator, props = {} ) => {
	doAction( 'stackable.block-component.transform.style.addStyles', blockStyleGenerator, props )
}
