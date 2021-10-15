/**
 * WordPress dependencies
 */
import { createBlocksFromInnerBlocksTemplate, createBlock } from '@wordpress/blocks'

/**
 * Internal dependencies
 */
import { TEMPLATE as IMAGE_BOX_TEMPLATE } from '../image-box/edit'

/**
 * External dependencies
 */
import { createUniqueClass } from '~stackable/block-components/block-div/use-unique-id'

const transforms = {
	from: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'stackable/image-box' ],
			__experimentalConvert: blocks => {
				return blocks.map( block => {
					const imageBlockAttributes = block.innerBlocks[ 0 ].attributes
					return createBlock( 'stackable/image', imageBlockAttributes )
				} )
			},
		},
	],
	to: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'stackable/image-box' ],
			transform: attributes => {
				return attributes.map( ( { ...attrs } ) => {
					const block = createBlocksFromInnerBlocksTemplate( [
						[ 'stackable/image-box', {}, IMAGE_BOX_TEMPLATE.map(
							block => {
								if ( block[ 0 ] === 'stackable/image' ) {
									block[ 1 ] = attrs
								}
								return block
							}
						) ],
					] )[ 0 ]

					block.attributes.uniqueId = createUniqueClass( block.clientId )
					return block
				} )
			},
		},
	],
}

export default transforms
