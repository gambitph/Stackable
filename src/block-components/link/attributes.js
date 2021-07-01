import { addLinkAttributes } from '../helpers/link'

export const addAttributes = ( attrObject, options = {} ) => {
	const {
		attrNameTemplate = 'link%s',
		selector = '',
	} = options

	addLinkAttributes( attrObject, attrNameTemplate, selector )
}
