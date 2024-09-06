/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	EffectsAnimations,
	MarginBottom,
	Separator,
	Transform,
	Columns,
	ContainerDiv,
} from '~stackable/block-components'
import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

Alignment.addStyles( blockStyles, {
	editorSelectorCallback: getAttribute => `.stk--block-align-${ getAttribute( 'uniqueId' ) } > .block-editor-inner-blocks > .block-editor-block-list__layout`,
} )
BlockDiv.addStyles( blockStyles )
MarginBottom.addStyles( blockStyles )
ContainerDiv.addStyles( blockStyles, {
	sizeSelector: '.%s-column',
	sizeVerticalAlignRule: 'justifyContent',
	sizeVerticalAlignSelector: '.%s-column',
} )
Advanced.addStyles( blockStyles )
Transform.addStyles( blockStyles )
EffectsAnimations.addStyles( blockStyles )
Separator.addStyles( blockStyles )
Columns.addStyles( blockStyles )

export default blockStyles
