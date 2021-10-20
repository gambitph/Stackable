/**
 * Internal dependencies
 */
import detectV2Blocks from './detect-v2-blocks'
import MigrationModal from './migration-popover'

/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins'
import { loadPromise, models } from '@wordpress/api'

loadPromise.then( () => {
	const settings = new models.Settings()
	settings.fetch().then( response => {
		// If the detector is already dismissed, don't show it any more.
		if ( response.stackable_v2_block_detector_disabled ) {
			return
		}

		// Only do this when the v2 compatibility is not enabled at all.
		if ( ! response.stackable_v2_editor_compatibility && ! response.stackable_v2_editor_compatibility_usage ) {
			detectV2Blocks().then( hasV2Blocks => {
				if ( hasV2Blocks ) {
					registerPlugin( 'stackable-v2-migration-popup', { render: MigrationModal } )
				}
			} )
		}
	} )
} )
