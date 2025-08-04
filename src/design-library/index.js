import apiFetch from '@wordpress/api-fetch'
import { doAction, applyFilters } from '@wordpress/hooks'

const LATEST_API_VERSION = 'v4'

let designLibrary = {}
let designs = {}
let pages = {}

export const getBlockName = block => block.replace( /^[\w-]+\//, '' )

export const fetchDesignLibrary = async ( forceReset = false, version = '', type = 'patterns' ) => {
	if ( forceReset ) {
		doAction( 'stackable.design-library.reset-cache' )
		designLibrary = {}
		designs = {}
		pages = {}
	}

	if ( ( type === 'patterns' && ! Object.keys( designs ).length ) ||
		( type === 'pages' && ! Object.keys( pages ).length )
	) {
		const results = await apiFetch( {
			path: `/stackable/v2/design_library/${ type }${ forceReset ? '/reset' : '' }`,
			method: 'GET',
		} )
		const designsPerType = await results

		designLibrary[ type ] = designsPerType

		if ( type === 'patterns' ) {
			designs = designsPerType[ LATEST_API_VERSION ]
		} else {
			pages = designsPerType[ LATEST_API_VERSION ]
		}
	}

	return designLibrary[ type ][ version || LATEST_API_VERSION ]
}

export const fetchDesign = async designId => {
	if ( ! designs[ designId ] ) {
		await fetchDesignLibrary()
	}
	return designs[ designId ] || {}
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
	type = 'patterns',
} ) => {
	const designLibrary = await fetchDesignLibrary( reset, LATEST_API_VERSION, type )

	return Object.values( designLibrary )
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
