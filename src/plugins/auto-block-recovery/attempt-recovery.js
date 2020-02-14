import {
	select, dispatch,
} from '@wordpress/data'
import { createBlock } from '@wordpress/blocks'
import { isInvalid } from './is-invalid'

// Runs an auto-attempt recovery on all the blocks.
export const autoAttemptRecovery = () => {
	autoAttemptRecoveryRecursive( select( 'core/editor' ).getEditorBlocks() )
}

// Recursive fixing of all blocks.
export const autoAttemptRecoveryRecursive = blocks => {
	blocks.forEach( block => {
		if ( isInvalid( block ) ) {
			// Replace the block with a newly generated one.
			const recoverBlock = ( {
				name, attributes, innerBlocks,
			} ) => createBlock( name, attributes, innerBlocks )
			dispatch( 'core/block-editor' ).replaceBlock( block.clientId, recoverBlock( block ) )
		}

		// Also fix the inner blocks.
		if ( block.innerBlocks && block.innerBlocks.length ) {
			autoAttemptRecoveryRecursive( block.innerBlocks )
		}
	} )
}
