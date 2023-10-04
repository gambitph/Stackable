/**
 * Internal dependencies
 */
import { Save } from '../save'
import { attributes } from '../schema'
import { withVersion } from '~stackable/higher-order'
import { deprecateBlockBackgroundColorOpacity, deprecateContainerBackgroundColorOpacity } from '~stackable/block-components'

const deprecated = [
	// Support the new combined opacity and color.
	{
		attributes: attributes( '3.11.9' ),
		save: withVersion( '3.11.9' )( Save ),
		isEligible: attributes => {
			const hasContainerOpacity = deprecateContainerBackgroundColorOpacity.isEligible( attributes )
			const hasBlockOpacity = deprecateBlockBackgroundColorOpacity.isEligible( attributes )

			return hasContainerOpacity || hasBlockOpacity
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )

			return newAttributes
		},
	},
	// Support new margin-top/bottom classes.
	{
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
		migrate: attributes => {
			const newAttributes = deprecateContainerBackgroundColorOpacity.migrate( attributes )
			return deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
		},
	},
	{
		attributes: attributes( '3.4.2' ),
		save: withVersion( '3.4.2' )( Save ),
		migrate: attributes => {
			const {
				collapseOn,
				contentAlign,
			} = attributes
			return {
				...attributes,
				// Port collapse attribute to the new alignment option.
				buttonAlign: collapseOn === 'desktop' ? 'vertical' : '',
				buttonAlignTablet: collapseOn === 'tablet' ? 'vertical' : '',
				buttonAlignMobile: collapseOn === 'mobile' ? 'vertical' : '',
				// There was a bug <= v3.4.2 where collapsing on desktop would center the buttons.
				contentAlign: collapseOn === 'desktop' ? 'center' : contentAlign,
			}
		},
	},
]

export default deprecated
