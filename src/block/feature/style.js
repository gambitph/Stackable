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

Alignment.Style.addStyles( blockStyles )
BlockDiv.Style.addStyles( blockStyles )
ContainerDiv.Style.addStyles( blockStyles )
Column.Style.addStyles( blockStyles )
Columns.Style.addStyles( blockStyles, {
	hasRowGap: false,
} )
Advanced.Style.addStyles( blockStyles )
Transform.Style.addStyles( blockStyles )
EffectsAnimations.Style.addStyles( blockStyles )
Separator.Style.addStyles( blockStyles )

// const columnArrangement = useBlockAttributesContext( attributes => attributes.columnArrangementMobile || attributes.columnArrangementTablet )
// const numColumns = ( columnArrangement || '' ).split( ',' ).length

// const ColumnOrderStyle = applyFilters( 'stackable.block-component.columns.column-order-style', null )
// { ColumnOrderStyle && <ColumnOrderStyle { ...props } numColumns={ numColumns } /> }

export default blockStyles
