/**
 * External dependencies
 */
import { get } from 'lodash'
import { createUniqueClass } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks'

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

				if ( blocks.length === 1 && blocks[ 0 ].name === 'core/columns' ) {
					const oldColumnsBlock = blocks[ 0 ]

					const newInnerBlocks = []
					const newColumnsAttributes = { uniqueId: createUniqueClass( oldColumnsBlock.clientId ) }

					for ( const [ attrKey, value ] of Object.entries( oldColumnsBlock.attributes ) ) {
						switch ( attrKey ) {
							case 'align': {
								if ( attrKey ) {
									newColumnsAttributes.align = value
									newColumnsAttributes.innerBlockContentAlign = 'align' + value
								}
								break
							}
							case 'style': {
								const background = get( value, 'color.background' )
								if ( background ) {
									newColumnsAttributes.hasBackground = true
									newColumnsAttributes.blockBackgroundColor = background
								}
								break
							}
							case 'backgroundColor': {
								if ( value ) {
									newColumnsAttributes.hasBackground = true
								}

								break
							}
							default: break
						}
					}

					for ( const innerBlock of oldColumnsBlock.innerBlocks ) {
						const newAttributes = { uniqueId: createUniqueClass( innerBlock.clientId ) }
						const padding = get( innerBlock.attributes, 'style.spacing.padding' )
						if ( padding ) {
							newAttributes.containerPadding = {}
							newAttributes.containerPadding.top = parseInt( padding.top )
							newAttributes.containerPadding.right = parseInt( padding.right )
							newAttributes.containerPadding.bottom = parseInt( padding.bottom )
							newAttributes.containerPadding.left = parseInt( padding.left )
							newAttributes.containerPaddingUnit = padding.top?.match( /([a-z]*)$/g )?.[ 0 ] || ''
						}
						newInnerBlocks.push( createBlock(
							'stackable/column',
							newAttributes,
							innerBlock.innerBlocks,
						) )
					}

					return createBlock( 'stackable/columns', newColumnsAttributes, newInnerBlocks )
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
