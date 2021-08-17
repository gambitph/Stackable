/**
 * WordPress dependencies
 */
import {
	createBlock,
} from '@wordpress/blocks'

/**
 * Internal dependencies
 */
import { defaultIcon } from './schema'

const transforms = {
	from: [
		{
			type: 'block',
			isMultiblock: false,
			blocks: [ 'stackable/button' ],
			transform: attributes => {
				return createBlock(
					'stackable/icon-button',
					{
						...attributes,
						icon: attributes.icon || defaultIcon,
					}
				)
			},
		},
	],
}

export default transforms
