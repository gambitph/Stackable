import { settings as stackableSettings } from 'stackable'

// Conditionally import scripts
if ( stackableSettings.stackable_enable_block_defaults ) {
	// Use require instead of dynamic import to avoid code splitting
	require( './save-block' )
	require( './global-settings' )
}
