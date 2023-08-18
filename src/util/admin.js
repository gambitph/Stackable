/**
 * Shared functions used in the admin / settings.
 */
import { sortBy } from 'lodash'

/**
 * WordPress dependencies
 */
import { loadPromise, models } from '@wordpress/api'

// Collect all the blocks and their variations for enabling/disabling and sort
// them by type.
export const importBlocks = r => {
	const blocks = {}
	r.keys().forEach( key => {
		const meta = r( key )
		const type = meta[ 'stk-type' ]
		if ( type ) {
			if ( ! blocks[ type ] ) {
				blocks[ type ] = []
			}
			blocks[ type ].push( meta )
		}

		// Add any varations if any.
		( meta[ 'stk-variants' ] || [] ).forEach( variation => {
			const type = variation[ 'stk-type' ]
			if ( type ) {
				if ( ! blocks[ type ] ) {
					blocks[ type ] = []
				}
				blocks[ type ].push( {
					...variation,
					name: `${ meta.name }|${ variation.name }`,
				} )
			}
		} )
	} )
	Object.keys( blocks ).forEach( type => {
		blocks[ type ] = sortBy( blocks[ type ], 'name' )
	} )
	return blocks
}

let fetchingPromise = null

/**
 * Loads settings, this can be called multiple times but it will only fetch
 * once.
 *
 * @return {Promise} Load settings promise
 */
export const fetchSettings = () => {
	if ( ! fetchingPromise ) {
		fetchingPromise = loadPromise.then( () => {
			const settings = new models.Settings()
			return settings.fetch().then( response => {
				fetchingPromise = null
				return response
			} )
		} )
	}

	return fetchingPromise
}
