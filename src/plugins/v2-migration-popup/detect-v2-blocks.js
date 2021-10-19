/**
 * WordPress dependencies
 */
import { select, subscribe } from '@wordpress/data'

// Checks all blocks in the page on whether there are any v2 blocks.
const detectV2Blocks = () => new Promise( resolve => {
	// We need to do this inside a timeout since when calling this, the Block
	// Editor might not be ready yet with the contents or might not have
	// initialized yet.
	setTimeout( () => {
		const unsubscribe = subscribe( () => {
			// Run the auto block recovery if the `getEntityRecords` is already resolved.
			if ( select( 'core' ).getEntityRecords( 'postType', 'wp_block' ) !== null ) {
				unsubscribe()
				let hasV2Blocks = false
				const content = select( 'core/editor' )?.getEditedPostContent()
				if ( content ) {
					// Check the current content of the editor.
					if ( stringHasV2Block( content ) ) {
						hasV2Blocks = true
					// Check all blocks the reusable blocks that's present.
					} else if ( content.includes( 'wp:block' ) ) {
						const blocks = select( 'core/editor' )?.getEditorBlocks() || []
						if ( detectBlocks( blocks ) ) {
							hasV2Blocks = true
						}
					}
				}

				resolve( hasV2Blocks )
			}
		} )
	}, 500 )
} )

const stringHasV2Block = content => {
	return content.includes( 'ugb/' ) || content.includes( 'ugb-main-block' )
}

const detectBlocks = blocks => {
	return blocks.some( block => {
		// If the block is a reusable block, check blocks inside it.
		if ( block.name === 'core/block' ) {
			const { attributes: { ref } } = block
			const rawContent = select( 'core' ).getEntityRecords( 'postType', 'wp_block', { include: [ ref ] } )?.[ 0 ]?.content?.raw

			if ( stringHasV2Block( rawContent ) ) {
				return true
			}
		}

		// Check nested blocks.
		if ( block.innerBlocks && block.innerBlocks.length ) {
			if ( detectBlocks( block.innerBlocks ) ) {
				return true
			}
		}

		// Check the current block.
		if ( block.name && block.name.startsWith( 'ugb/' ) ) {
			return true
		}
		if ( block.originalContent && stringHasV2Block( block.originalContent ) ) {
			return true
		}

		return false
	} )
}

export default detectV2Blocks
