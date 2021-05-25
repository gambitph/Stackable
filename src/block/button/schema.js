import {
	Advanced,
	BlockDiv,
	Column,
	CustomCSS,
	Responsive,
	Button,
	addBorderAttributes,
	Typography,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()
	BlockDiv.addAttributes( attrObject )
	Column.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	Button.addAttributes( attrObject, { selector: '.stk-button__button' } )
	addBorderAttributes( attrObject, 'button%s' )
	addBorderAttributes( attrObject, 'buttonHover%s' )
	Typography.addAttributes( attrObject, '.stk-button__inner-text', {
		enableTextTag: false,
	} )
	Typography.addAttributes( attrObject, '.stk-button__button:hover > .stk-button__inner-text', {
		enableTextTag: false, attrNameTemplate: 'hover%s', enableTextContent: false,
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
