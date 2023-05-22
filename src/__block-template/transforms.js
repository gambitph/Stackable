/**
 * Allow transforming to or from this block. For directions on how to add more transforms, use this guide:
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-transforms/
 */

/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks'

const transforms = {
	from: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'stackable/text' ],
			transform: attributes => {
				return attributes.map( ( { ...attrs } ) => createBlock( 'stackable/new-block', { ...attrs } ) )
			},
		},
	],
}

export default transforms
