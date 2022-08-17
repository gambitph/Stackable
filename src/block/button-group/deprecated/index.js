/**
 * Internal dependencies
 */
import { Save } from '../save'
import { attributes } from '../schema'
import { withVersion } from '~stackable/higher-order'

const deprecated = [
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
