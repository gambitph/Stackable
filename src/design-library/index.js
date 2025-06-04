import apiFetch from '@wordpress/api-fetch'
import { doAction, applyFilters } from '@wordpress/hooks'

const LATEST_API_VERSION = 'v4'

let designLibrary = null
let designs = []

export const getBlockName = block => block.replace( /^[\w-]+\//, '' )

export const fetchDesignLibrary = async ( forceReset = false, version = '' ) => {
	if ( ! designLibrary || forceReset ) {
		const results = await apiFetch( {
			path: `/stackable/v2/design_library${ forceReset ? '/reset' : '' }`,
			method: 'GET',
		} )
		designLibrary = await results

		// Reset all designs that we already have cached.
		if ( forceReset ) {
			doAction( 'stackable.design-library.reset-cache' )
			designs = []
		}
	}

	return designLibrary[ version || LATEST_API_VERSION ]
}

// TODO: to remove
export const fetchDesign = async ( designId, version = '' ) => {
	if ( ! designs[ designId ] ) {
		const results = await apiFetch( {
			path: `/stackable/v2/design/${ version || LATEST_API_VERSION }/${ designId }`,
			method: 'GET',
		} )
		designs[ designId ] = await results
	}
	return designs[ designId ]
}

// TODO: to remove
export const setDevModeDesignLibrary = async ( devMode = false ) => {
	const results = await apiFetch( {
		path: `/stackable/v2/design_library_dev_mode/`,
		method: 'POST',
		data: {
			devmode: devMode,
		},
	} )
	return await results
}

export const getDesigns = async ( {
	reset = false,
} ) => {
	const library = Object.values( await fetchDesignLibrary( reset ) )
	return library
}

export const filterDesigns = async ( {
	library = [],
	plan: isPlan = '',
	category: isCategory = '',
} ) => {
	if ( isPlan ) {
		library = library.filter( ( { plan } ) => plan === isPlan )
	}

	if ( isCategory ) {
		library = library.filter( ( { category } ) => category === isCategory )
	}

	return library
}

/**
 *
 * @param {string} designId The name of the design
 * @param {string} version The version of the design library API to use.
 *
 * @return {Object} The design object.
 */
export const getDesign = async ( designId, version = '' ) => {
	const library = await fetchDesignLibrary( false, version )

	const meta = library[ designId ]

	let design = await applyFilters( 'stackable.design-library.get-design', null, designId, meta, version )

	// Every design has their own template file which contains the entire design, get that.
	if ( ! design && meta.template ) {
		design = await fetchDesign( designId, version )
	}

	return design
}
