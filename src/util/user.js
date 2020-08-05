import { select } from '@wordpress/data'
import apiFetch from '@wordpress/api-fetch'
import { addQueryArgs } from '@wordpress/url'

/**
 * Checks whether the current user has a certain capability.
 *
 * @param {string} cap The capability to check e.g. 'manage_options'
 */
export const currentUserHasCapability = async cap => {
	const id = select( 'core' ).getCurrentUser().id

	if ( ! id ) {
		return false
	}

	const results = await apiFetch( {
		path: addQueryArgs( `/wp/v2/users/${ id }`, {
			context: 'edit',
		} ),
	} )

	return results.capabilities[ cap ] || false
}
