import {
	Alignment,
	BlockDiv,
	MarginBottom,
	Row,
} from '~stackable/block-components'

export default {
	...BlockDiv.attributes,
	...MarginBottom.attributes,
	...Row.attributes,
	...Alignment.attributes,
	design: {
		type: 'string',
		default: '',
	},
}
