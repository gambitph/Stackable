/**
 * Internal dependencies
 */
import schema from './schema'
import save from './save'

const deprecated = [
	{
		attributes: {
			...schema,
			design: {
				type: 'string',
				default: 'plain',
			},
		},
		save,
		migrate: attributes => {
			return {
				...attributes,
				design: attributes.design || 'plain',
			}
		},
	},
]

export default deprecated
