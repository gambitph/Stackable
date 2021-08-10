/**
 * WordPress dependencies
 */
import {
	createBlock,
} from '@wordpress/blocks'

const transforms = {
	from: [
		{
			type: 'block',
			isMultiblock: false,
			blocks: [ 'stackable/icon-button' ],
			transform: attributes => {
				return createBlock(
					'stackable/button',
					attributes
				)
			},
		},
	],
}

export default transforms
