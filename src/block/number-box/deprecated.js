import { Save } from './save'
import { attributes } from './schema'

import { withVersion } from '~stackable/higher-order'
import { deprecateBlockBackgroundColoropacity, deprecationBackgrounColorOpacity } from '~stackable/block-components'

const deprecated = [
	// Support the new combined opacity and color.
	{
		attributes: attributes( '3.11.9' ),
		save: withVersion( '3.11.9' )( Save ),
		isEligible: attributes => {
			return deprecateBlockBackgroundColoropacity.isEligible( attributes ) ||
				deprecationBackgrounColorOpacity.isEligible( 'shape%s' )( attributes )
		},
		migrate: attributes => {
			let newAttributes = deprecateBlockBackgroundColoropacity.migrate( attributes )
			newAttributes = deprecationBackgrounColorOpacity.migrate( 'shape%s' )( newAttributes )
			return newAttributes
		},
	},
	// Support new margin-top/bottom classes.
	// Support the new combined opacity and color.
	{
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
		migrate: attributes => {
			let newAttributes = deprecateBlockBackgroundColoropacity.migrate( attributes )
			newAttributes = deprecationBackgrounColorOpacity.migrate( 'shape%s' )( newAttributes )
			return newAttributes
		},
	},
]
export default deprecated
