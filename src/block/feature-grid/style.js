/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	Column,
	EffectsAnimations,
	Separator,
	Transform,
	Columns,
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
Column.addStyles( blockStyles )
Advanced.addStyles( blockStyles )
Transform.addStyles( blockStyles )
EffectsAnimations.addStyles( blockStyles )
Separator.addStyles( blockStyles )
Columns.addStyles( blockStyles )

export default blockStyles
