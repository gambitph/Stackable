/**
 * Wordpress dependencies
 */
import { addFilter, doAction } from '@wordpress/hooks'

addFilter( 'stackable.global-settings.inspector', 'global-colors', ( ) => {
	return <div>
		<button onClick={ () => doAction( 'stackable.global-settings.inspector' ) }>Click</button>
	</div>
} )
