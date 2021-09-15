/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks'

const transforms = {
	from: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'stackable/subtitle' ],
			transform: attributes => {
				return attributes.map( ( { ...attrs } ) => createBlock( 'stackable/text', { ...attrs } ) )
			},
		},
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'core/paragraph' ],
			transform: attributes => {
				return attributes.map( ( { content } ) => createBlock( 'stackable/text', {
					text: content,
				} ) )
			},
		},
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'core/heading' ],
			transform: attributes => {
				return attributes.map( ( { content } ) => createBlock( 'stackable/text', {
					text: content,
				} ) )
			},
		},
	],
	to: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'stackable/subtitle' ],
			transform: attributes => {
				return attributes.map( ( { ...attrs } ) => createBlock( 'stackable/subtitle', { ...attrs } ) )
			},
		},
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
