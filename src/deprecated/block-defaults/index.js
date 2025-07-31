import { settings as stackableSettings } from 'stackable'

// Conditionally import scripts
if ( stackableSettings.stackable_enable_block_defaults ) {
	import( './save-block' )
	import( './global-settings' )
}
