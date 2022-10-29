import './blocks'

import { last, omit } from 'lodash'
import {
	useSelect, select, dispatch,
} from '@wordpress/data'
import {
	useEffect, useCallback, useState, useMemo,
} from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import {
	isBlockLinked, useDidAttributesChange, useIsLinked,
} from '~stackable/hooks'
import { extractBlockStyleStructure, getBlocksToStyle } from '~stackable/util'

export const BlockLinking = () => {
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
			dispatch( 'core/block-editor' ).updateBlockAttributes( clientIdsToUpdate, attributes ) // eslint-disable-line stackable/no-update-block-attributes
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
export const useClosestLinkableBlock = clientId => {
	const linkableBlockTypes = useLinkableBlockTypes()

	return useMemo( () => {
		if ( ! clientId ) {
			return null
		}

		let linkableClientId = null
		const {
			getBlock,
			getBlockParents,
		} = select( 'core/block-editor' )

		// Check if the current block is linkable.
		const blockType = getBlock( clientId )?.name || ''
		if ( linkableBlockTypes.includes( blockType ) ) {
			linkableClientId = clientId
		}

		// If current block isn't linkable, look for any parent that is linkable
		if ( ! linkableClientId ) {
			const parents = [ ...getBlockParents( clientId ) ].reverse() // Create a new array so as not to accidentally mutate the property.
			linkableClientId = parents.find( clientId => {
				const blockType = getBlock( clientId )?.name
				return linkableBlockTypes.includes( blockType ) ? clientId : false
			} ) || null
		}

		// Check if the immediate parent explicitly disallows linking
		// (stkBlockLinking = false)
		if ( linkableClientId ) {
			const parent = last( getBlockParents( linkableClientId ) )
			if ( parent ) {
				const blockType = getBlock( parent )?.name
				const blockData = wp.data.select( 'core/blocks' ).getBlockType( blockType )
				if ( blockData?.supports?.stkBlockLinking === false ) {
					return null
				}
			}
		}

		return linkableClientId
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
		console.error( `Stackable: block type "${ blockType }" was not included the list of blocks allowed for linking. Did you forget to include it? See filter "stackable.block-linking.blocks"` )
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
