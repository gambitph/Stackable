import {
	BlockDiv, MarginBottom, Row,
} from '~stackable/block-components'

export default {
	...BlockDiv.attributes,
	...MarginBottom.attributes,
	...Row.attributes,
	design: {
		type: 'string',
		default: '',
	},
}
