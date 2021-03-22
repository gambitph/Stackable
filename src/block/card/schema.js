import { BlockDiv, Column } from '~stackable/block-components'
import {
	imageAttributes,
} from '~stackable/helpers'
import { convertResponsiveAttributes } from '~stackable/util'

export default convertResponsiveAttributes( {
	...BlockDiv.attributes,
	...Column.attributes,

	hasContainer: {
		type: 'boolean',
		default: true,
	},
	design: {
		type: 'string',
		default: '',
	},

	...imageAttributes,
} )
