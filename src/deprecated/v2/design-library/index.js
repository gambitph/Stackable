/**
 * Internal dependencies
 */
import ModalDesignLibrary from '../components/modal-design-library'
import { fetchDesignLibrary } from '../../../design-library'

/**
 * WordPress dependencies
 */
import { addFilter, addAction } from '@wordpress/hooks'
import apiFetch from '@wordpress/api-fetch'

// Add v2 in the design library modal. This enables the design library switch.
addFilter( 'stackable.design-library.versions', 'stackable/v2', versions => {
	versions.push( 'v2' )
	return versions
} )

// Load the v2 design library when switched to.
addFilter( 'stackable.design-library.modal-component', 'stackable/v2', ( component, version ) => {
	return version === 'v2' ? ModalDesignLibrary : component
} )

// Get the design data for v2 designs.
addFilter( 'stackable.design-library.get-design', 'stackable/v2', async ( design, designId, meta, version ) => {
	if ( version === 'v2' ) {
		const { type, block } = meta

		// We have a unified list of all designs per block, look there first to save of fetch time.
		if ( type === 'block' && block ) {
			const blockDesigns = await fetchBlockDesigns( block, version )
			return blockDesigns[ designId ]
		}
	}
	return design
} )

// We cache block design calls here.
let blockDesigns = {}

// Fetch specific block designs.
export const getBlockName = block => block.replace( /^[\w-]+\//, '' )
export const fetchBlockDesigns = async block => { // Always v2
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

// Clear our block design cache.
addAction( 'stackable.design-library.reset-cache', 'stackable/v2', () => {
	blockDesigns = {}
} )

/**
 * Gets the list of blocks available in the design library.
 *
 * @param {string} version The version of the design library API to use.
 *
 * @return {Array} An array of block names.
 */
export const getAllBlocks = async ( version = '' ) => {
	const library = Object.values( await fetchDesignLibrary( false, version ) )

	return library.reduce( ( blocks, design ) => {
		const { block, type } = design
		if ( ! blocks.includes( block ) && type === 'block' ) {
			blocks.push( block )
		}
		return blocks
	}, [] )
}
