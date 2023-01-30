/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import example from './example'
import metadata from './block.json'

export const settings = {
	...metadata,
	attributes: schema,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ],
		stkAlign: true,
		stkLayoutReset: false,
		stkSaveBlockStyle: false,
	},
	example,
	edit,
	save,
}
