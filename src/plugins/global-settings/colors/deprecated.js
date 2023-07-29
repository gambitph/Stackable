import { addFilter } from '@wordpress/hooks'
import { compact } from 'lodash'

// Add the global colors that are used by native blocks, we don't provide global
// colors for native blocks anymore since 3.10.1, but we still need to support
// it.
addFilter( 'stackable.editor-render-global-styles.css', 'stackable/native-global-color-support', ( css, newColors ) => {
	const styleDeprecatedRules = newColors.map( color => (
		`.has-${ color.slug || '' }-color { color: ${ color.color || '' } !important; }` +
		`.has-${ color.slug || '' }-background-color { background-color: ${ color.color || '' } !important; }`
	) )

	return css + compact( styleDeprecatedRules ).join( '' )
} )
