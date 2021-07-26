import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.global-settings.typography-selectors', 'stackable/v2', ( selectors, tag ) => {
	selectors.push( `[data-type^="ugb/"] ${ tag }` )
	return selectors
} )

addFilter( 'stackable.global-settings.typography.selector-is-stackable', 'stackable/v2', ( isStackable, selector ) => {
	if ( ! isStackable ) {
		return selector.includes( 'ugb/' )
	}
	return isStackable
} )
