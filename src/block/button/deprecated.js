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
addFilter( 'stackable.button.save.blockClassNames', 'stackable/3.4.3', ( output, props ) => {
	if ( compareVersions( props.version, '3.4.3' ) === 1 ) {
		return output
	}

	const fullWidthClass = props.attributes.buttonFullWidth ? 'stk-block-button-full-width' : ''

	return [ ...output, fullWidthClass ]
} )

const deprecated = [
	{
		attributes: attributes(),
		save: withVersion( '3.4.2' )( Save ),
	},
]

export default deprecated
