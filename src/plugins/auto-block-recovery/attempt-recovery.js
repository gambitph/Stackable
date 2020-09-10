import {
	select, dispatch,
} from '@wordpress/data'
import { createBlock } from '@wordpress/blocks'
import { isInvalid } from './is-invalid'

// Add some styles to hide the flash of errored blocks.
const disableBlockWarnings = () => {
	const warningStyle = document.createElement( 'style' )
	warningStyle.setAttribute( 'id', 'ugb-disable-block-warnings' )
	warningStyle.innerHTML = '.has-warning[data-type^="ugb/"] { opacity: 0 !important; }'
	document.body.appendChild( warningStyle )
}

// Remove the styles that hides the flash of errored blocks.
const enableBlockWarnings = () => {
	const warningStyle = document.querySelector( '#ugb-disable-block-warnings' )
	if ( warningStyle ) {
		document.body.removeChild( warningStyle )
	}
}

// Runs an auto-attempt recovery on all the blocks.
export const autoAttemptRecovery = () => {
	// Since we're doing this inside a timeout, there will be a flash of errored
	// blocks momentarily, let's hide these until the recovery is done.
	disableBlockWarnings()

	// We need to do this inside a timeout since when calling this, the Block
	// Editor might not be ready yet with the contents or might not have
	// initialized yet.
	setTimeout( () => {
		autoAttemptRecoveryRecursive( select( 'core/editor' ).getEditorBlocks() )
		enableBlockWarnings()
	}, 0 )
}

// Recursive fixing of all blocks.
export const autoAttemptRecoveryRecursive = blocks => {
	blocks.forEach( block => {
		// Auto recover the block.
		if ( isInvalid( block ) ) {
			recoverBlock( block )
		}

		// Also fix the inner blocks.
		if ( block.innerBlocks && block.innerBlocks.length ) {
			autoAttemptRecoveryRecursive( block.innerBlocks )
		}
	} )
}

// Recover an invalid block.
export const recoverBlock = block => {
	const {
		name, attributes, innerBlocks, clientId,
	} = block

	const {
		getBlockParents,
		getBlock,
		getTemplateLock,
	} = wp.data.select( 'core/block-editor' )

	// Check if an innerBlock, Innerblocks with a templateLock cannot be
	// replaced via replaceBlock, so we need to replace the parent also.
	const parents = getBlockParents( clientId )
	if ( parents && parents.length ) {
		const parentClientId = parents[ parents.length - 1 ] // The last parent is the immediate one.
		const parentBlock = getBlock( parentClientId )
		const templateLock = getTemplateLock( parentClientId )

		if ( templateLock && parentBlock.innerBlocks.includes( block ) ) {
			// Create a new set of innerBlocks but replace the one we want to recover.
			const innerBlockIndex = parentBlock.innerBlocks.indexOf( block )
			const newBlock = createBlock( name, attributes, innerBlocks )
			const newInnerBlocks = [ ...parentBlock.innerBlocks ]
			newInnerBlocks[ innerBlockIndex ] = newBlock

			const newParentBlock = createBlock( parentBlock.name, parentBlock.attributes, newInnerBlocks )
			dispatch( 'core/block-editor' ).replaceBlock( parentClientId, newParentBlock )
			return
		}
	}

	// Regular replacing of the block.
	const newBlock = createBlock( name, attributes, innerBlocks )
	dispatch( 'core/block-editor' ).replaceBlock( clientId, newBlock )
}
