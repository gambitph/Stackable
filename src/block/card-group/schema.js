import { BlockDiv } from '~stackable/block-components'
import { marginBottomAttributes } from '~stackable/helpers'

export default {
	...BlockDiv.attributes,
	design: {
		type: 'string',
		default: '',
	},
	...marginBottomAttributes,
}
