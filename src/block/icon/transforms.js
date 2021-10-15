/**
 * Internal dependencies
 */
import { TEMPLATE as ICON_LABEL_TEMPLATE } from '../icon-label/edit'
import { TEMPLATE as ICON_BOX_TEMPLATE } from '../icon-box/edit'

/**
 * WordPress dependencies
 */
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks'

const transforms = {
	to: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'stackable/icon-box' ],
			transform: attributes => {
				return attributes.map( ( { ...attrs } ) => createBlocksFromInnerBlocksTemplate(
					[
						[ 'stackable/icon-box', {}, ICON_BOX_TEMPLATE.map(
							block => {
								if ( block[ 0 ] === 'stackable/icon-label' ) {
									block[ 2 ][ 0 ][ 1 ] = attrs
								}
								return block
							}
						) ],
					]
				)[ 0 ] )
			},
		},
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'stackable/icon-label' ],
			transform: attributes => {
				return attributes.map( ( { ...attrs } ) => createBlocksFromInnerBlocksTemplate(
					[
						[ 'stackable/icon-label', {}, ICON_LABEL_TEMPLATE.map(
							block => {
								if ( block[ 0 ] === 'stackable/icon' ) {
									block[ 1 ] = attrs
								}
								return block
							}
						) ],
					]
				)[ 0 ] )
			},
		},
	],
}

export default transforms
