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
	ContainerDiv,
	Columns,
} from '~stackable/block-components'
import { BlockStyleGenerator } from '~stackable/components'

// import { useBlockAttributesContext } from '~stackable/hooks'
// import { applyFilters } from '@wordpress/hooks'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

blockStyles.addBlockStyles( 'rowGap', [ {
	renderIn: 'save',
	selector: '.%s-column',
	styleRule: '--stk-row-gap',
	attrName: 'rowGap',
	key: 'rowGap-save',
	format: '%spx',
	responsive: 'all',
}, {
	renderIn: 'edit',
	selector: '.%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout',
	styleRule: '--stk-row-gap',
	attrName: 'rowGap',
	key: 'rowGap',
	format: '%spx',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'columnWrapDesktop', [ {
	renderIn: 'save',
	styleRule: '--stk-feature-flex-wrap',
	attrName: 'columnWrapDesktop',
	key: 'columnWrapDesktop-save',
	valueCallback: value => {
		return value ? 'wrap' : 'nowrap'
	},
} ] )

Alignment.addStyles( blockStyles )
BlockDiv.addStyles( blockStyles )
ContainerDiv.addStyles( blockStyles )
Column.addStyles( blockStyles )
Columns.addStyles( blockStyles, {
	hasRowGap: false,
} )
Advanced.addStyles( blockStyles )
Transform.addStyles( blockStyles )
EffectsAnimations.addStyles( blockStyles )
Separator.addStyles( blockStyles )

export default blockStyles
