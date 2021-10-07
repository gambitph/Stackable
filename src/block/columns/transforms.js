/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks'
import { createUniqueClass } from '~stackable/block-components/block-div/use-unique-id'

const MAXIMUM_SELECTED_BLOCKS = 10

const transforms = {
	from: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ '*' ],
			__experimentalConvert: blocks => {
				// Avoid transforming a single `stackable/column` Block
				if ( blocks.length === 1 && blocks[ 0 ].name === 'stackable/column' ) {
					return
				}

				// Clone the Blocks to be converted into columns.
				// Failing to create new block references causes the original blocks
				// to be replaced in the switchToBlockType call thereby meaning they
				// are removed both from their original location and within the
				// new group block.
				const groupInnerBlocks = blocks.map( block => {
					return createBlock(
						block.name,
						block.attributes,
						block.innerBlocks
					)
				} )

				const column = createBlock( 'stackable/column', {}, groupInnerBlocks )
				const block = createBlock( 'stackable/columns', {}, [ column ] )

				// Add a unique Id to prevent the block picker from appearing.
				block.attributes.uniqueId = createUniqueClass( block.clientId )
				return block
			},
			isMatch: block => {
				const { length: selectedBlocksLength } = block
				return selectedBlocksLength && selectedBlocksLength <= MAXIMUM_SELECTED_BLOCKS
			},
		},
	],
}

export default transforms
