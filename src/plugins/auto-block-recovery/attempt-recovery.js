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
