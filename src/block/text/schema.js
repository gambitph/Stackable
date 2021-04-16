/**
 * External dependencies
 */
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	CustomCSS,
	Responsive,
	Advanced,
	Typography,
} from '~stackable/block-components'

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	BlockDiv.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	Typography.addAttributes( attrObject, '%s', '.stk-advanced-text__text' )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
