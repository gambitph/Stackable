/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks'
import {
	create, split, toHTMLString,
} from '@wordpress/rich-text'

/**
 * Internal dependencies
 */

// import { createListBlockFromDOMElement } from './util'

// function getListContentSchema( { phrasingContentSchema } ) {
// 	const listContentSchema = {
// 		...phrasingContentSchema,
// 		ul: {},
// 		ol: { attributes: [ 'type', 'start', 'reversed' ] },
// 	};

// 	// Recursion is needed.
// 	// Possible: ul > li > ul.
// 	// Impossible: ul > ul.
// 	[ 'ul', 'ol' ].forEach( tag => {
// 		listContentSchema[ tag ].children = {
// 			li: {
// 				children: listContentSchema,
// 			},
// 		}
// 	} )

// 	return listContentSchema
// }

function getListContentFlat( blocks ) {
	return blocks.flatMap( ( {
		name, attributes, innerBlocks = [],
	} ) => {
		if ( name === 'stackable/icon-list-item' ) {
			return [ attributes.text, ...getListContentFlat( innerBlocks ) ]
		}
		return getListContentFlat( innerBlocks )
	} )
}

const transforms = {
	from: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'core/paragraph', 'core/heading', 'stackable/text', 'stackable/heading', 'stackable/subtitle' ],
			transform: blockAttributes => {
				let childBlocks = []
				if ( blockAttributes.length > 1 ) {
					childBlocks = blockAttributes.map( ( { content } ) => {
						return createBlock( 'stackable/icon-list-item', { text: content } )
					} )
				} else if ( blockAttributes.length === 1 ) {
					const value = create( {
						html: blockAttributes[ 0 ].content,
					} )
					childBlocks = split( value, '\n' ).map( result => {
						return createBlock( 'stackable/icon-list-item', {
							text: toHTMLString( { value: result } ),
						} )
					} )
				}
				return createBlock(
					'stackable/icon-list',
					{
						anchor: blockAttributes.anchor,
					},
					childBlocks
				)
			},
		},
		{
			type: 'block',
			blocks: [ 'core/list' ],
			transform: ( blockAttributes, _childBlocks ) => {
				const childBlocks = _childBlocks.map( ( { attributes } ) => {
					return createBlock( 'stackable/icon-list-item', { text: attributes.content } )
				} )
				return createBlock(
					'stackable/icon-list',
					{
						anchor: blockAttributes.anchor,
					},
					childBlocks
				)
			},
		},
		// Commented out for now to prevent bullet lists from a word doc to be converted to icon lists.
		// {
		// 	type: 'raw',
		// 	selector: 'ol,ul',
		// 	schema: args => ( {
		// 		ol: getListContentSchema( args ).ol,
		// 		ul: getListContentSchema( args ).ul,
		// 	} ),
		// 	transform: createListBlockFromDOMElement,
		// },
	],
	to: [
		...[ 'core/paragraph', 'core/heading' ].map( block => ( {
			type: 'block',
			blocks: [ block ],
			transform: ( _attributes, childBlocks ) => {
				return getListContentFlat( childBlocks ).map( content =>
					createBlock( block, {
						content,
					} )
				)
			},
		} ) ),
		...[ 'stackable/text', 'stackable/heading' ].map( block => ( {
			type: 'block',
			blocks: [ block ],
			transform: ( _attributes, childBlocks ) => {
				return getListContentFlat( childBlocks ).map( content =>
					createBlock( block, {
						text: content,
					} )
				)
			},
		} ) ),
		{
			type: 'block',
			blocks: [ 'core/list' ],
			transform: ( blockAttributes, _childBlocks ) => {
				const childBlocks = _childBlocks.map( ( { attributes } ) => {
					return createBlock( 'core/list-item', { content: attributes.text } )
				} )
				return createBlock(
					'core/list',
					{
						anchor: blockAttributes.anchor,
					},
					childBlocks
				)
			},
		},
	],
}

export default transforms
