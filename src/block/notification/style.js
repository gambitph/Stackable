/**
 * External dependencies
 */
import {
	BlockDiv,
	Alignment,
	Advanced,
	EffectsAnimations,
	ContainerDiv,
	MarginBottom,
	Transform,
} from '~stackable/block-components'
import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

blockStyles.addBlockStyles( 'dismissibleSize', [ {
	selector: '.stk-container',
	attrName: 'dismissibleSize',
	key: 'dismissibleSize',
	styleRule: 'paddingInlineEnd',
	enabledCallback: getAttribute => getAttribute( 'isDismissible' ) && getAttribute( 'dismissibleSize' ),
	valuePreCallback: value => value + 44,
	// 44 is an arbitrary number based on the size of the container paddings vs the close button size.
	format: '%spx',
	dependencies: [ 'isDismissible' ],
} ] )

blockStyles.addBlockStyles( 'dismissibleColor', [ {
	selector: '.stk-block-notification__close-button svg',
	attrName: 'dismissibleColor',
	key: 'dismissibleColor',
	styleRule: 'fill',
	enabledCallback: getAttribute => getAttribute( 'isDismissible' ),
	dependencies: [ 'isDismissible' ],
} ] )

Alignment.Style.addStyles( blockStyles )
BlockDiv.Style.addStyles( blockStyles )
Advanced.Style.addStyles( blockStyles )
Transform.Style.addStyles( blockStyles )
EffectsAnimations.Style.addStyles( blockStyles )
ContainerDiv.Style.addStyles( blockStyles, {
	sizeSelector: '.stk-block-notification__content',
	sizeHorizontalAlignRule: 'margin',
} )
MarginBottom.Style.addStyles( blockStyles )

export default blockStyles
