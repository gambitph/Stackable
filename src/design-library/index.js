import domReady from '@wordpress/dom-ready'
import apiFetch from '@wordpress/api-fetch'

let designLibrary = null
const blockDesigns = {}
const designs = []

export const getBlockName = block => block.replace( /^[\w-]+\//, '' )

export const fetchDesignLibrary = async () => {
	if ( ! designLibrary ) {
		const results = await apiFetch( {
			path: `/wp/v2/stk_design_library`,
			method: 'GET',
		} )
		designLibrary = await results
	}
	return designLibrary
}

export const fetchBlockDesigns = async block => {
	const blockName = getBlockName( block )
	if ( ! blockDesigns[ blockName ] ) {
		const results = await apiFetch( {
			path: `/wp/v2/stk_block_designs/${ blockName }`,
			method: 'GET',
		} )
		blockDesigns[ blockName ] = await results
	}
	return blockDesigns[ blockName ]
}

export const fetchDesign = async designId => {
	if ( ! designs[ designId ] ) {
		const results = await apiFetch( {
			path: `/wp/v2/stk_design/${ designId }`,
			method: 'GET',
		} )
		designs[ designId ] = await results
	}
	return designs[ designId ]
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
} ) => {
	let library = Object.values( await fetchDesignLibrary() )

	if ( isType ) {
		library = library.filter( ( { type } ) => type === isType )
	}

	if ( isBlock ) {
		const blockName = isBlock.indexOf( 'ugb/' ) === -1 ? `ugb/${ isBlock }` : isBlock
		library = library.filter( ( { block } ) => block === blockName )
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

export const getDesign = async designId => {
	const library = await fetchDesignLibrary()

	const meta = library[ designId ]
	const {
		type, block, template,
	} = meta

	// We have a unified list of all designs per block, look there first to save of fetch time.
	if ( type === 'block' && block ) {
		const blockDesigns = await fetchBlockDesigns( block )
		return blockDesigns[ designId ]

	// Every design has their own template file which contains the entire design, get that.
	} else if ( template ) {
		return await fetchDesign( designId )
	}

	return null
}
