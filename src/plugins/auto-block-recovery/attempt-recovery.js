import {
	select, dispatch, subscribe,
} from '@wordpress/data'
import {
	createBlock, parse, serialize,
} from '@wordpress/blocks'
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

	setTimeout( () => {
		const unsubscribe = subscribe( () => {
		// Run the auto block recovery if the `getEntityRecords` is already resolved.
			if ( select( 'core' ).getEntityRecords( 'postType', 'wp_block' ) !== null ) {
				unsubscribe()
				// Recover all the blocks that we can find.
				const mainBlocks = recoverBlocks( select( 'core/editor' ).getEditorBlocks() )
				// Replace the recovered blocks with the new ones.
				mainBlocks.forEach( block => {
					if ( block.isReusable && block.ref ) {
						// Update the reusable blocks.
						dispatch( 'core' ).editEntityRecord( 'postType', 'wp_block', block.ref, { content: serialize( block.blocks ) } ).then( () => {
							dispatch( 'core' ).saveEditedEntityRecord( 'postType', 'wp_block', block.ref )
						} )
					}

					if ( block.recovered && block.replacedClientId ) {
						dispatch( 'core/block-editor' ).replaceBlock( block.replacedClientId, block )
					}
				} )
				enableBlockWarnings()
			}
		} )
	}, 0 )
}

const recursivelyRecoverInvalidBlockList = blocks => {
	const _blocks = [ ...blocks ]
	let recoveryCalled = false
	const recursivelyRecoverBlocks = willRecoverBlocks => {
		willRecoverBlocks.forEach( _block => {
			if ( isInvalid( _block ) ) {
				recoveryCalled = true
				const newBlock = recoverBlock( _block )
				for ( const key in newBlock ) {
					_block[ key ] = newBlock[ key ]
				}
			}

			if ( _block.innerBlocks.length ) {
				recursivelyRecoverBlocks( _block.innerBlocks )
			}
		} )
	}

	recursivelyRecoverBlocks( _blocks )
	return [ _blocks, recoveryCalled ]
}

// Recursive fixing of all blocks. This doesn't actually fix any blocks in the
// editor, but instead creates a new set of fixed blocks based on the given
// blocks. The replaced blocks will have a `recovered` that's `true` and a
// `replacedClientId` that contains the block it replaced.
//
// It's not the responsibility of this function to manipulate the editor.
export const recoverBlocks = blocks => {
	return blocks.map( block => {
		const _block = block
		if ( block.name === 'core/block' ) {
			const { attributes: { ref } } = block
			const parsedBlocks = parse( select( 'core' ).getEntityRecords( 'postType', 'wp_block', { include: [ ref ] } )?.[0]?.content?.raw ) || []

			const [ recoveredBlocks, recoveryCalled ] = recursivelyRecoverInvalidBlockList( parsedBlocks )

			if ( recoveryCalled ) {
				console.log( 'Stackable notice: block ' + _block.name + ' (' + _block.clientId + ') was auto-recovered, you should not see this after saving your page.' ) // eslint-disable-line no-console
				return {
					blocks: recoveredBlocks,
					isReusable: true,
					ref,
				}
			}
		}

		if ( _block.innerBlocks && _block.innerBlocks.length ) {
			const newInnerBlocks = recoverBlocks( _block.innerBlocks )
			if ( newInnerBlocks.some( block => block.recovered ) ) {
				_block.innerBlocks = newInnerBlocks
				_block.replacedClientId = _block.clientId
				_block.recovered = true
			}
		}

		if ( isInvalid( _block ) ) {
			const newBlock = recoverBlock( _block )
			newBlock.replacedClientId = _block.clientId
			newBlock.recovered = true
			console.log( 'Stackable notice: block ' + _block.name + ' (' + _block.clientId + ') was auto-recovered, you should not see this after saving your page.' ) // eslint-disable-line no-console

			return newBlock
		}

		return _block
	} )
}

// Recovers one block.
export const recoverBlock = ( {
	name, attributes, innerBlocks,
} ) => {
	return createBlock( name, attributes, innerBlocks )
}
