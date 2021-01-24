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
		// Recover all the blocks that we can find.
		const mainBlocks = recoverBlocks( select( 'core/editor' ).getEditorBlocks() )
		// Replace the recovered blocks with the new ones.
		mainBlocks.forEach( block => {
			if ( block.recovered && block.replacedClientId ) {
				dispatch( 'core/block-editor' ).replaceBlock( block.replacedClientId, block )
			}
		} )
		enableBlockWarnings()
	}, 0 )
}

// Recursive fixing of all blocks. This doesn't actually fix any blocks in the
// editor, but instead creates a new set of fixed blocks based on the given
// blocks. The replaced blocks will have a `recovered` that's `true` and a
// `replacedClientId` that contains the block it replaced.
//
// It's not the responsibility of this function to manipulate the editor.
export const recoverBlocks = blocks => {
	return blocks.map( block => {
		if ( block.innerBlocks && block.innerBlocks.length ) {
			const newInnerBlocks = recoverBlocks( block.innerBlocks )
			if ( newInnerBlocks.some( block => block.recovered ) ) {
				block.innerBlocks = newInnerBlocks
				block.replacedClientId = block.clientId
				block.recovered = true
			}
		}

		if ( isInvalid( block ) ) {
			const newBlock = recoverBlock( block )
			newBlock.replacedClientId = block.clientId
			newBlock.recovered = true
			console.log( 'Stackable notice: block ' + block.name + ' (' + block.clientId + ') was auto-recovered, you should not see this after saving your page.' ) // eslint-disable-line no-console
			return newBlock
		}

		return block
	} )
}

// Recovers one block.
export const recoverBlock = ( {
	name, attributes, innerBlocks,
} ) => {
	return createBlock( name, attributes, innerBlocks )
}
