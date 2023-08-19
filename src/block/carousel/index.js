/**
 * BLOCK: New Block.
 */
/**
 * External dependencies
 */
import { CarouselIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import example from './example'

export const settings = {
	...metadata,
	icon: CarouselIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ], // Only select alignments.
		stkAlign: true,
		stkSaveBlockStyle: false,
		stkDefaultTab: 'layout',
		stkColumnResize: false,
		stkBlockLinking: true,
		spacing: true,
	},
	example,
	edit,
	save,
}
