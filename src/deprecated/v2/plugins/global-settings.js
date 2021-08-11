import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.global-settings.typography-selectors', 'stackable/v2', ( selectors, selector ) => {
	selectors.push( `[data-type^="ugb/"] ${ selector }` )
	if ( selector.startsWith( '.' ) ) {
		selectors.push( `[data-type^="ugb/"] ${ selector } p` )
	}
	return selectors
} )

addFilter( 'stackable.global-settings.typography.selector-is-stackable', 'stackable/v2', ( isStackable, selector ) => {
	if ( ! isStackable ) {
		return selector.includes( 'ugb/' )
	}
	return isStackable
} )
