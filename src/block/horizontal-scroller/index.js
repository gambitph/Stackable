/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import example from './example'
import metadata from './block.json'

import { HorizontalScrollerIcon } from '~stackable/icons'

export const settings = {
	...metadata,
	icon: HorizontalScrollerIcon,
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
