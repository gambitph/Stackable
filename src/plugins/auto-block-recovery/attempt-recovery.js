import {
	select, dispatch,
} from '@wordpress/data'
import { createBlock } from '@wordpress/blocks'
import { isInvalid } from './is-invalid'

// Runs an auto-attempt recovery on all the blocks.
export const autoAttemptRecovery = () => {
	const blocks = select( 'core/editor' ).getEditorBlocks()
	blocks.forEach( block => {
		if ( isInvalid( block ) ) {
			// Replace the block with a newly generated one.
			const recoverBlock = ( {
				name, attributes, innerBlocks,
			} ) => createBlock( name, attributes, innerBlocks )
			dispatch( 'core/block-editor' ).replaceBlock( block.clientId, recoverBlock( block ) )
		}
	} )
}
