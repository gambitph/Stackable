/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks'

const transforms = {
	from: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'core/paragraph' ],
			transform: attributes => {
				return attributes.map( ( { content } ) => createBlock( 'stackable/subtitle', {
					text: content,
				} ) )
			},
		},
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'core/heading' ],
			transform: attributes => {
				return attributes.map( ( { content } ) => createBlock( 'stackable/subtitle', {
					text: content,
				} ) )
			},
		},
	],
	to: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'core/paragraph' ],
			transform: attributes => {
				return attributes.map( ( { text } ) => createBlock( 'core/paragraph', { content: text } ) )
			},
		},
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'core/heading' ],
			transform: attributes => {
				return attributes.map( ( { text } ) => createBlock( 'core/heading', { content: text } ) )
			},
		},
	],
}

export default transforms
