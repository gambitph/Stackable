/**
 * Inserter-facing Stackable blocks for catalog / upgrade smokes.
 * Child-only types are omitted; parent templates already include them.
 * stackable/design-library is a picker, not saved content.
 *
 * Keep in sync with inserter-facing stackable blocks in src/block/<name>/block.json
 * (parent unset, not stk-type child-only). New top-level blocks must be added here.
 */
const TOP_LEVEL_BLOCKS = [
	'stackable/accordion',
	'stackable/blockquote',
	'stackable/button-group',
	'stackable/call-to-action',
	'stackable/card',
	'stackable/carousel',
	'stackable/columns',
	'stackable/count-up',
	'stackable/countdown',
	'stackable/divider',
	'stackable/expand',
	'stackable/feature',
	'stackable/feature-grid',
	'stackable/heading',
	'stackable/hero',
	'stackable/horizontal-scroller',
	'stackable/icon',
	'stackable/icon-box',
	'stackable/icon-label',
	'stackable/icon-list',
	'stackable/image',
	'stackable/image-box',
	'stackable/map',
	'stackable/notification',
	'stackable/number-box',
	'stackable/posts',
	'stackable/price',
	'stackable/pricing-box',
	'stackable/progress-bar',
	'stackable/progress-circle',
	'stackable/separator',
	'stackable/spacer',
	'stackable/subtitle',
	'stackable/table-of-contents',
	'stackable/tabs',
	'stackable/team-member',
	'stackable/testimonial',
	'stackable/text',
	'stackable/timeline',
	'stackable/video-popup',
]

module.exports = {
	TOP_LEVEL_BLOCKS,
}
