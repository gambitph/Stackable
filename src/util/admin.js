/**
 * Shared functions used in the admin / settings.
 */
import { sortBy } from 'lodash'

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch'

// Collect all the blocks and their variations for enabling/disabling and sort
// them by type.
export const importBlocks = r => {
	const blocks = {}
	const blockDependencies = {}
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

		if ( meta[ 'stk-block-dependency' ] ) {
			blockDependencies[ meta.name ] = meta[ 'stk-block-dependency' ]
		}
	} )

	Object.keys( blocks ).forEach( type => {
		blocks[ type ] = sortBy( blocks[ type ], 'name' )
	} )
	return [ blocks, blockDependencies ]
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
		// apiFetch can call a known REST path directly, so it does not need
		// @wordpress/api's loadPromise.
		fetchingPromise = apiFetch( {
			path: '/stackable/v3/settings/',
			method: 'GET',
		} ).then( response => {
			fetchingPromise = null
			return response
		} )
	}

	return fetchingPromise
}

/**
 * Saves settings.
 *
 * @param {Object} data Settings to save.
 *
 * @return {Promise} Save settings promise.
 */
export const saveSettings = data => apiFetch( {
	path: '/wp/v2/settings',
	method: 'POST',
	data,
} )
