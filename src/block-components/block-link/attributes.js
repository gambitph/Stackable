import { addLinkAttributes } from '../helpers/link'

export const addAttributes = attrObject => {
	addLinkAttributes( attrObject, 'blockLink%s', 'a.stk-block-link' )
}
