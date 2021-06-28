/**
 * External dependencies
 */
import {
	Advanced,
	BlockDiv,
	CustomCSS,
	Responsive,
	Button,
	Typography,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()
	BlockDiv.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	Button.addAttributes( attrObject, {
		selector: '.stk-button__button',
		hasIconGradient: false,
		hasIconShape: false,
		hasIconBackgroundShape: false,
	} )

	Typography.addAttributes( attrObject, '.stk-button__inner-text', {
		hasTextTag: false,
		hasColor: false,
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
