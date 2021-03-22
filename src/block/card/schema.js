import {
	BlockDiv, Column, Image,
} from '~stackable/block-components'
import { convertResponsiveAttributes } from '~stackable/util'

export default convertResponsiveAttributes( {
	...BlockDiv.attributes,
	...Column.attributes,
	...Image.attributes,

	hasContainer: {
		type: 'boolean',
		default: true,
	},
	design: {
		type: 'string',
		default: '',
	},
} )
