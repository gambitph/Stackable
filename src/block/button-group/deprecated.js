/**
 * Internal Dependencies
 */
import { Save } from './save'
import { attributes } from './schema'

/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import compareVersions from 'compare-versions'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Version 3.4.3 Deprecations
addFilter( 'stackable.buttonGroup.save.blockClassNames', 'stackable/3.4.3', ( output, props ) => {
	 if ( compareVersions( props.version, '3.4.2' ) === 0 ) {
		 return output.filter( value => value !== 'stk-block-button-group--flex-wrap' )
	 }

	 return output
} )

const deprecated = [
	 {
		 attributes: attributes(),
		 save: withVersion( '3.4.2' )( Save ),
	 },
]

export default deprecated

