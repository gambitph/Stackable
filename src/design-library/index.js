import domReady from '@wordpress/dom-ready'
import apiFetch from '@wordpress/api-fetch'
import { doAction, applyFilters } from '@wordpress/hooks'

const LATEST_API_VERSION = 'v3'

let designLibrary = null
let designs = []

export const getBlockName = block => block.replace( /^[\w-]+\//, '' )

export const fetchDesignLibrary = async ( forceReset = false, version = '' ) => {
	if ( ! designLibrary || forceReset ) {
		const results = await apiFetch( {
			path: `/wp/v2/stk_design_library${ forceReset ? '/reset' : '' }`,
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

export const fetchDesign = async ( designId, version = '' ) => {
	if ( ! designs[ designId ] ) {
		const results = await apiFetch( {
			path: `/wp/v2/stk_design/${ version }/${ designId }`,
			method: 'GET',
		} )
		designs[ designId ] = await results
	}
	return designs[ designId ]
}

export const setDevModeDesignLibrary = async ( devMode = false ) => {
	const results = await apiFetch( {
		path: `/wp/v2/stk_design_library_dev_mode/`,
		method: 'POST',
		data: {
			devmode: devMode,
		},
	} )
	return await results
}

domReady( () => {
	// Save the option to not show the video again.
	// fetchDesignLibrary()
} )

export const getDesigns = async ( {
	type: isType = '',
	block: isBlock = '',
	mood: isMood = '',
	plan: isPlan = '',
	colors: hasColors = [],
	categories: hasCategories = [],
	search = '',
	reset = false,
	apiVersion = '',
} ) => {
	let library = Object.values( await fetchDesignLibrary( reset, apiVersion ) )

	if ( isType ) {
		library = library.filter( ( { type } ) => type === isType )
	}

	if ( isBlock ) {
		const blockName = isBlock.replace( /^\w+\//, '' )
		library = library.filter( ( { block } ) => block.endsWith( `/${ blockName }` ) )
	}

	if ( isMood ) {
		library = library.filter( ( { mood } ) => mood === isMood )
	}

	if ( isPlan ) {
		library = library.filter( ( { plan } ) => plan === isPlan )
	}

	if ( hasColors && hasColors.length ) {
		library = library.filter( ( { colors } ) => colors.some( color => hasColors.includes( color ) ) )
	}

	if ( hasCategories && hasCategories.length ) {
		library = library.filter( ( { categories } ) => categories.some( category => hasCategories.includes( category ) ) )
	}

	if ( search ) {
		const terms = search.toLowerCase().replace( /\s+/, ' ' ).trim().split( ' ' )

		// Every search term should match a property of a design.
		terms.forEach( searchTerm => {
			library = library.filter( design => {
				// Our search term needs to match at least one of these properties.
				return [ 'label', 'plan', 'block', 'tags', 'categories', 'colors' ].some( designProp => {
					// Search whether the term matched.
					return design[ designProp ].toString().toLowerCase().indexOf( searchTerm ) !== -1
				} )
			} )
		} )
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
	if ( design ) {
		return design
	}

	// Every design has their own template file which contains the entire design, get that.
	if ( meta.template ) {
		design = await fetchDesign( designId )
	}

	return design
}
