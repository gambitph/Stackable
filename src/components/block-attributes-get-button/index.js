/**
 * Based on: https://github.com/WordPress/gutenberg/blob/master/packages/editor/src/components/convert-to-group-buttons/index.js
 */

/**
 * Internal dependencies
 */
import GetBlockAttributesButton from './button'

/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data'

const Buttons = withSelect( select => {
	const { getSelectedBlockClientId } = select( 'core/block-editor' )

	// Only supported by WP >= 5.3.
	if ( ! getSelectedBlockClientId ) {
		return {}
	}

	return {
		clientId: getSelectedBlockClientId(),
	}
} )( GetBlockAttributesButton )

export default Buttons
