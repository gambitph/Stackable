import { Save } from './save'
import { attributes } from './schema'

import { withVersion } from '~stackable/higher-order'
import { deprecateBlockShadowColor, deprecateContainerShadowColor } from '~stackable/block-components'

const deprecated = [
	{
		// Support the new shadow color.
		attributes: attributes( '3.12.11' ),
		save: withVersion( '3.12.11' )( Save ),
		isEligible: attributes => {
			const hasBlockShadow = deprecateBlockShadowColor.isEligible( attributes )
			const hasContainerShadow = deprecateContainerShadowColor.isEligible( attributes )

			return hasBlockShadow || hasContainerShadow
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )

			return newAttributes
		},
	},
]
export default deprecated
