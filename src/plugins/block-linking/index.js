import './blocks'

import { last, omit } from 'lodash'
import {
	useSelect, select, useDispatch,
} from '@wordpress/data'
import {
	useEffect, useCallback, useState, useMemo,
} from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import {
	isBlockLinked, useDidAttributesChange, useIsLinked,
} from '~stackable/hooks'

export const BlockLinking = () => {
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )

	const [ currentClientId, setCurrentClientId ] = useState( null )
	const { selectedBlock, selectedBlockClientId } = useSelect(
		select => {
			return {
				selectedBlock: select( 'core/block-editor' ).getSelectedBlock(),
				selectedBlockClientId: select( 'core/block-editor' ).getSelectedBlockClientId(),
			}
		},
		[]
	)

	const linkableBlockClientId = useClosestLinkableBlock( currentClientId )
	const isLinked = useIsLinked( linkableBlockClientId )

	const cb = useCallback( newAttributes => {
		// This callback can be called falsely if the user switches to different blocks.
		if ( ! selectedBlockClientId || currentClientId !== selectedBlockClientId ) {
			return
		}

		// Only update the other blocks if linking is turned on.
		if ( ! isLinked ) {
			return
		}

		// Only update non-content attributes which belong to supported blocks.
		const currentBlockType = select( 'core/block-editor' ).getBlock( currentClientId ).name
		if ( ! isSupportedBlock( currentBlockType ) ) {
			return
		}

		// Filter out content attributes.
		const attributes = filterContentAttributes( newAttributes, selectedBlock.name )
		// If no attributes remained.
		if ( ! Object.keys( attributes ).length ) {
			return
		}

		// Extract the structure of the block against the linkable parent block
		const styleStructure = extractBlockStyleStructure( currentClientId, linkableBlockClientId )
		styleStructure[ styleStructure.length - 1 ].attributes = attributes // Add in the attributes.

		// Gather all the linked blocks that will be affected by the style change.
		const linkedClientIds = getAdjacentLinkedBlocks( linkableBlockClientId ).map( ( { clientId } ) => clientId )
		const clientIdsToUpdate = linkedClientIds.reduce( ( clientIdsToUpdate, linkedClientId ) => {
			return [
				...clientIdsToUpdate,
				...getBlocksToStyle( linkedClientId, styleStructure ),
			]
		}, [] )

		// Update the blocks!
		if ( clientIdsToUpdate.length ) {
			updateBlockAttributes( clientIdsToUpdate, attributes )
		}
	}, [ currentClientId, selectedBlockClientId, linkableBlockClientId, isLinked ] )

	// Listen to attribute changes.
	useDidAttributesChange(
		cb,
		isLinked ? selectedBlock?.name : '', // Normally we pass the name of the block here. But if we pass "", we skip some processes
		selectedBlock?.attributes || {},
		false
	)

	useEffect( () => {
		setCurrentClientId( selectedBlockClientId )
	}, [ selectedBlockClientId ] )

	return null
}

const useLinkableBlockTypes = () => {
	return useMemo( () => {
		return wp.data.select( 'core/blocks' ).getBlockTypes().reduce( ( blockTypes, block ) => {
			if ( block.supports?.stkBlockLinking ) {
				blockTypes.push( block.name )
			}
			return blockTypes
		}, [] )
	}, [] )
}

// Returns the closest block that supports linking (doesn't mean the block is linked or unlinked)
const useClosestLinkableBlock = clientId => {
	const linkableBlockTypes = useLinkableBlockTypes()

	return useMemo( () => {
		if ( ! clientId ) {
			return null
		}

		const {
			getBlock,
			getBlockParents,
		} = select( 'core/block-editor' )

		// Check if the current block is linkable.
		const blockType = getBlock( clientId ).name
		if ( linkableBlockTypes.includes( blockType ) ) {
			return clientId
		}

		// Looks for the parent that is linkable, returns null if can't find any
		const parents = getBlockParents( clientId ).reverse()
		return parents.find( clientId => {
			const blockType = getBlock( clientId ).name
			return linkableBlockTypes.includes( blockType ) ? clientId : false
		} ) || null
	}, [ clientId ] )
}

const getAdjacentLinkedBlocks = clientId => {
	const { getBlock, getBlockParents } = select( 'core/block-editor' )
	const parentClientId = last( getBlockParents( clientId ) )
	const childBlocks = getBlock( parentClientId ).innerBlocks
	return childBlocks.filter( block => {
		return block.clientId !== clientId && isBlockLinked( block.clientId )
	} )
}

const isSupportedBlock = blockType => {
	const isSupported = Object.keys( applyFilters( 'stackable.block-linking.blocks', {} ) ).includes( blockType )

	if ( ! isSupported && blockType.startsWith( 'stackable/' ) ) {
		// eslint-disable-next-line no-console
		console.error( `Stackable: block type "${ blockType }" was not included the list of blocks allowed for linking. See filter "stackable.block-linking.blocks"` )
	}

	return isSupported
}

const filterContentAttributes = ( attributes, blockType ) => {
	const blockSupport = applyFilters( 'stackable.block-linking.blocks', {} )
	if ( blockSupport[ blockType ] && blockSupport[ blockType ].filterAttributes ) {
		return omit( attributes, blockSupport[ blockType ].filterAttributes )
	}
	return attributes
}

/**
 * Gets the list of blocks which the styleStructure is applicable to.
 *
 * This method tries to match/paste to a block and its nested contents.
 *
 * The styleStructure explains the attributes to be applied, the styles can be
 * applied to multiple nested blocks. Here's an example styleStructure:
 *
 * [
 *   {
 *     type: 'stackable/card',
 *   },
 *   {
 *     type: 'stackable/columns',
 *     nthOfType: 1,
 *     numOfType: 1,
 *   },
 *   {
 *     type: 'stackable/column',
 *     nthOfType: 1,
 *     numOfType: 2,
 *   },
 *   {
 *     type: 'stackable/heading',
 *     nthOfType: 1,
 *     numOfType: 1,
 *     attributes: {
 *       color: red,
 *     },
 *   }
 * ]
 *
 * @param {number} clientId The block to apply the styles to
 * @param {Object} styleStructure An object explaining the style/attributes to
 * apply
 *
 * @return {Array} Array of block client Ids which the styleStructure should be
 * applied to.
 */
export const getBlocksToStyle = ( clientId, styleStructure ) => {
	const clientIds = []
	if ( ! styleStructure.length ) {
		return clientIds
	}

	// Don't match the type of the very first entry since it's the main one.
	styleStructure[ 0 ].nthOfType = 1
	styleStructure[ 0 ].numOfType = 1

	let currentBlocks = [ select( 'core/block-editor' ).getBlock( clientId ) ]
	styleStructure.forEach( ( currentStructure, i ) => {
		const matchingBlocks = currentBlocks.filter( block => {
			if ( currentStructure.type !== block.name ) {
				return false
			}

			// The first block should always match.
			if ( i === 0 ) {
				return true
			}

			// Match if it's the same child type.
			const nthOfType = getNthTypeOfBlock( block.clientId )
			if ( nthOfType === currentStructure.nthOfType ) {
				return true
			}

			const lastInStructure = currentStructure.nthOfType === currentStructure.numOfType
			if ( lastInStructure && nthOfType > currentStructure.nthOfType && nthOfType >= currentStructure.numOfType ) {
				return true
			}

			return false
		} )

		// All the client Id for updating.
		if ( currentStructure.attributes ) {
			matchingBlocks.forEach( ( { clientId } ) => {
				clientIds.push( clientId )
			} )
		}

		// Go through the next level of inner blocks.
		currentBlocks = matchingBlocks.reduce( ( allInnerBlocks, matchingBlock ) => {
			return [
				...allInnerBlocks,
				...matchingBlock.innerBlocks,
			]
		}, [] )
	} )

	return clientIds
}

const getNthTypeOfBlock = currentClientId => {
	const { getBlock, getBlockParents } = select( 'core/block-editor' )
	const block = getBlock( currentClientId )
	const currentBlockName = block.name
	const parentClientId = last( getBlockParents( currentClientId ) )

	if ( ! parentClientId || parentClientId === currentClientId ) {
		return 1
	}

	// Get nthOfType and numOfType
	const childBlocks = getBlock( parentClientId ).innerBlocks
	let nthOfType = 0
	childBlocks.some( ( { name, clientId } ) => {
		if ( name === currentBlockName ) {
			nthOfType++
			return clientId === currentClientId
		}
		return false
	} )

	return nthOfType
}

/**
 * Generates a structure object based on the clientId (up to the parent clientId).
 *
 * A structure object looks like this:
 * [
 *   {
 *     type: 'stackable/card',
 *   },
 *   {
 *     type: 'stackable/columns',
 *     nthOfType: 1,
 *     numOfType: 1,
 *   },
 *   {
 *     type: 'stackable/column',
 *     nthOfType: 1,
 *     numOfType: 2,
 *   },
 *   {
 *     type: 'stackable/heading',
 *     nthOfType: 1,
 *     numOfType: 1,
 *     attributes: {
 *       color: red,
 *     },
 *   }
 * ]
 *
 * @param {string} clientId The main block
 * @param {string} rootClientId The root parent block
 */
export const extractBlockStyleStructure = ( clientId, rootClientId ) => {
	let currentClientId = clientId
	const structureArray = []

	while ( currentClientId !== null ) {
		const { getBlock, getBlockParents } = select( 'core/block-editor' )
		const block = getBlock( currentClientId )
		const currentBlockName = block.name
		const parentClientId = last( getBlockParents( currentClientId ) )

		if ( ! parentClientId || parentClientId === currentClientId ) {
			structureArray.unshift( {
				type: block.name,
				nthOfType: 1,
				numOfType: 1,
			} )
			break
		}

		// Get nthOfType and numOfType
		const childBlocks = getBlock( parentClientId ).innerBlocks
		const { nthOfType, numOfType } = childBlocks.reduce( ( blockData, { name, clientId } ) => {
			if ( name === currentBlockName ) {
				blockData.numOfType++
				if ( ! blockData.foundClientId ) {
					blockData.nthOfType++
					if ( clientId === currentClientId ) {
						blockData.foundClientId = true
					}
				}
			}
			return blockData
		}, {
			nthOfType: 0, numOfType: 0, foundClientId: false,
		} )

		structureArray.unshift( {
			type: block.name,
			nthOfType,
			numOfType,
		} )

		// Go back one parent.
		if ( currentClientId === rootClientId ) {
			currentClientId = null
		} else {
			currentClientId = last( select( 'core/block-editor' ).getBlockParents( currentClientId ) )
		}
	}

	return structureArray
}
