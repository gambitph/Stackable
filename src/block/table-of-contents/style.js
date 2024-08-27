/**
 * External dependencies
 */
import { isEmpty } from 'lodash'
import {
	Typography, MarginBottom, BlockDiv, Advanced, EffectsAnimations, Alignment, Transform,
} from '~stackable/block-components'
import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

blockStyles.addBlockStyles( 'iconGap', [ {
	selector: 'li',
	styleRule: 'paddingInlineStart',
	attrName: 'iconGap',
	key: 'iconGap',
	responsive: 'all',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'listType', [ {
	selector: 'ul',
	styleRule: 'listStyleType',
	attrName: 'listType',
	key: 'listType',
	valueCallback: value => ( value === 'none' ? 'none' : undefined ),
}, {
	selector: 'ol',
	styleRule: 'listStyleType',
	attrName: 'listType',
	key: 'listType-ol',
	valueCallback: value =>
		isEmpty( value ) || value === 'none' || value === 'unordered'
			? undefined
			: value,
} ] )

blockStyles.addBlockStyles( 'columns', [ {
	selector: '.stk-table-of-contents__table',
	styleRule: 'columnCount',
	attrName: 'columns',
	key: 'columns',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'columnGap', [ {
	selector: '.stk-table-of-contents__table',
	styleRule: 'columnGap',
	attrName: 'columnGap',
	key: 'columnGap',
	responsive: 'all',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'rowGap', [ {
	renderIn: 'save',
	selector: 'li',
	styleRule: 'marginBottom',
	attrName: 'rowGap',
	key: 'rowGapSave',
	responsive: 'all',
	format: '%spx',
}, {
	renderIn: 'edit',
	selector: '.stk-block-table-of-contents__list-item-inner',
	styleRule: 'marginBottom',
	attrName: 'rowGap',
	key: 'rowGapEdit',
	responsive: 'all',
	format: '%spx',
}, {
	selector: '.stk-table-of-contents__table ul',
	styleRule: 'marginTop',
	attrName: 'rowGap',
	key: 'rowGap-top',
	responsive: 'all',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'indentation', [ {
	selector: [ 'ul', 'ol' ],
	styleRule: 'paddingLeft',
	attrName: 'indentation',
	key: 'indentation',
	responsive: 'all',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'color', [ {
	selector: 'li a',
	hover: 'all',
	styleRule: 'color',
	attrName: 'color',
	key: 'color',
} ] )

blockStyles.addBlockStyles( 'listAlignment', [ {
	selector: [ 'li' ],
	styleRule: 'marginInline',
	attrName: 'listAlignment',
	key: 'listAlignment',
	responsive: 'all',
	valueCallback: value =>
		value === 'center'
			? 'auto'
			: value === 'right'
				? 'auto 0'
				: value === 'left'
					? '0 auto'
					: '',
} ] )

blockStyles.addBlockStyles( 'isSmoothScroll', [ {
	selector: 'html',
	styleRule: 'scroll-behavior',
	attrName: 'isSmoothScroll',
	key: 'isSmoothScroll',
	valueCallback: value => ( value ? 'smooth' : undefined ),
} ] )

blockStyles.addBlockStyle( 'scrollTopOffset', [ {
	selector: 'html',
	styleRule: 'scroll-padding-top',
	attrName: 'scrollTopOffset',
	key: 'scrollTopOffset',
	responsive: 'all',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'fontSize', [ {
	// This fixes the issue where the bullet becomes small when a global font size is set.
	renderIn: 'edit',
	selector: '.%s.%s li',
	styleRule: 'fontSize',
	attrName: 'fontSize',
	key: 'fontSize',
	responsive: 'all',
	format: '%spx',
} ] )

Alignment.Style.addStyles( blockStyles )
Typography.Style.addStyles( blockStyles, {
	selector: [
		'li',
		'ul li a',
		'ol li a',
	],
	hoverSelector: [
		'.%s:hover li',
		'.%s:hover ul li a',
		'.%s:hover ol li a',
	],
} )
Typography.Style.addStyles( blockStyles, {
	selector: '.stk-table-of-contents__title',
	hoverSelector: '.stk-table-of-contents__title:hover',
	attrNameTemplate: 'title%s',
} )
MarginBottom.Style.addStyles( blockStyles )
BlockDiv.Style.addStyles( blockStyles )
Advanced.Style.addStyles( blockStyles )
Transform.Style.addStyles( blockStyles )
EffectsAnimations.Style.addStyles( blockStyles )

export default blockStyles
