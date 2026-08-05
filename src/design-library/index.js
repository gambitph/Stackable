import apiFetch from '@wordpress/api-fetch'
import { doAction, applyFilters } from '@wordpress/hooks'

const LATEST_API_VERSION = 'v4'

let designLibrary = {}
let designs = {}

export const getBlockName = block => block.replace( /^[\w-]+\//, '' )

const hasLibraryError = library =>
	library && ( library.wp_remote_get_error || library.content_error )

export const fetchDesignLibrary = async ( forceReset = false, version = '', type = 'patterns' ) => {
	if ( forceReset ) {
		doAction( 'stackable.design-library.reset-cache' )
		designLibrary = {}
		designs = {}
	}

	const needsFetch = ( type === 'patterns' || type === 'pages' ) && ! designLibrary[ type ]

	if ( needsFetch ) {
		const results = await apiFetch( {
			path: `/stackable/v2/design_library/${ type }${ forceReset ? '/reset' : '' }`,
			method: 'GET',
		} ) || {}

		designLibrary[ type ] = results

		if ( hasLibraryError( results ) ) {
			if ( type === 'patterns' ) {
				designs = {}
			}
		} else if ( type === 'patterns' ) {
			designs = results[ LATEST_API_VERSION ] ?? {}
		}
	}

	const library = designLibrary[ type ] || {}

	// Return the raw response when it contains fetch/parse errors so callers can handle them.
	if ( hasLibraryError( library ) ) {
		return library
	}

	return library[ version || LATEST_API_VERSION ] ?? library
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
	const library = await fetchDesignLibrary( reset, LATEST_API_VERSION, type )

	if ( ! library || typeof library !== 'object' ) {
		const error = { message: 'Failed to load design library.' }
		// eslint-disable-next-line no-console
		console.error( 'Stackable: ', error )
		return { error }
	}

	if ( hasLibraryError( library ) ) {
		const error = library.wp_remote_get_error ?? library.content_error
		// eslint-disable-next-line no-console
		console.error( 'Stackable: ', error )
		return { error }
	}

	// pre-fetch patterns
	if ( type === 'pages' ) {
		await fetchDesignLibrary()
	}

	return Object.values( library )
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

	if ( ! library || hasLibraryError( library ) ) {
		return null
	}

	const meta = library[ designId ]

	let design = await applyFilters( 'stackable.design-library.get-design', null, designId, meta, version )

	// Every design has their own template file which contains the entire design, get that.
	if ( ! design && meta?.template ) {
		design = await fetchDesign( designId, version )
	}

	return design
}
