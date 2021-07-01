import { addLinkAttributes } from '../helpers/link'

export const addAttributes = attrObject => {
	attrObject.add( {
		attributes: {
			hasBlockLink: {
				type: 'boolean',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	addLinkAttributes( attrObject, 'blockLink%s', 'a.stk-block-link' )
}
