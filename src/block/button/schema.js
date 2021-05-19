//import {
//Advanced,
//Alignment,
//BlockDiv,
//Column,
//ContainerDiv,
//CustomCSS,
//Image,
//Responsive,
//} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'
import { BlockLink } from '~stackable/block-components/block-link'

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()
	BlockLink.addAttributes( attrObject )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
