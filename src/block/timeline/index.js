/**
 * BLOCK: Timeline block.
 */
/**
 * External dependencies
 */
import { TimelineIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import example from './example'
import deprecated from './deprecated'

export const settings = {
	...metadata,
	icon: TimelineIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ], // Only select alignments.
		stkAlign: true,
		stkDefaultTab: 'layout',
		stkColumnResize: false,
	},
	example,
	deprecated,
	edit,
	save,
}
