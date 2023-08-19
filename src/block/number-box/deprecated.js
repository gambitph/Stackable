import { Save } from './save'
import { attributes } from './schema'

import { withVersion } from '~stackable/higher-order'

const deprecated = [
	// Support new margin-top/bottom classes.
	{
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
	},
]
export default deprecated
