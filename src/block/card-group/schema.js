import { BlockDiv, MarginBottom } from '~stackable/block-components'

export default {
	...BlockDiv.attributes,
	...MarginBottom.attributes,
	design: {
		type: 'string',
		default: '',
	},
	numInnerBlocks: {
		type: 'number',
		default: '',
	},
}
