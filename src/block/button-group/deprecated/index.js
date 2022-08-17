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
		migrate: ( { collapseOn } ) => {
			return {
				...attributes,
				buttonAlign: collapseOn === 'desktop' ? 'vertical' : '',
				buttonAlignTablet: collapseOn === 'tablet' ? 'vertical' : '',
				buttonAlignMobile: collapseOn === 'mobile' ? 'vertical' : '',
			}
		},
	},
]

export default deprecated
