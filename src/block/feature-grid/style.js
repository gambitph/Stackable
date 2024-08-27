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

Alignment.Style.addStyles( blockStyles, {
	editorSelectorCallback: getAttribute => `.stk--block-align-${ getAttribute( 'uniqueId' ) } > .block-editor-inner-blocks > .block-editor-block-list__layout`,
} )
BlockDiv.Style.addStyles( blockStyles )
Column.Style.addStyles( blockStyles )
Advanced.Style.addStyles( blockStyles )
Transform.Style.addStyles( blockStyles )
EffectsAnimations.Style.addStyles( blockStyles )
Separator.Style.addStyles( blockStyles )
Columns.Style.addStyles( blockStyles )

export default blockStyles
