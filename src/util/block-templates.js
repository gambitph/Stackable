import { i18n } from 'stackable'

import { __, sprintf } from '@wordpress/i18n'

export const LONG_TEXT = [
	// Translators: This is placeholder text used in the style guide.
	__( 'They didn\'t plan to build a life around shared walls and hand-me-down furniture, but somehow, it worked.', i18n ),
	// Translators: This is placeholder text used in the style guide.
	__( 'Morning routines bled into late-night talks, and even the silence felt familiar.', i18n ),
	// Translators: This is placeholder text used in the style guide.
	__( 'Careers shifted, relationships changed, and expectations rarely lined up with reality.', i18n ),
	// Translators: This is placeholder text used in the style guide.
	__( 'But there was always time for inside jokes, spontaneous distractions, and someone to show up, even without being asked.', i18n ),
	// Translators: This is placeholder text used in the style guide.
	__( 'Each of them brought something different—quiet patience, loud opinions, unexpected wisdom.', i18n ),
	// Translators: This is placeholder text used in the style guide.
	__( 'Change arrived slowly, then all at once. Some said goodbye, some stayed longer, and some simply evolved.', i18n ),
]

const CAROUSEL_TEMPLATE = [
	[ 'stackable/column', {}, [
		[ 'stackable/heading', { text: __( 'Slide', i18n ) } ],
		[ 'stackable/text', { text: LONG_TEXT[ 2 ] } ],
	] ],
]

const COLUMN_TEMPLATE = [
	[ 'stackable/heading', { text: __( 'Column', i18n ) } ],
	[ 'stackable/text', { text: LONG_TEXT[ 1 ] } ],
]

const HORIZONTAL_SCROLLER_TEMPLATE = [
	[ 'stackable/column', {}, [
		[ 'stackable/heading', { text: __( 'Heading', i18n ) } ],
		[ 'stackable/text', { text: LONG_TEXT[ 5 ] } ],
	] ],
	[ 'stackable/column', {}, [
		[ 'stackable/heading', { text: __( 'Heading', i18n ) } ],
		[ 'stackable/text', { text: LONG_TEXT[ 4 ] } ],
	] ],
	[ 'stackable/column', {}, [
		[ 'stackable/heading', { text: __( 'Heading', i18n ) } ],
		[ 'stackable/text', { text: LONG_TEXT[ 3 ] } ],
	] ],
]

const ICON_BOX_TEMPLATE = [
	[ 'stackable/icon-label', { blockMargin: { bottom: 0 } }, [
		[ 'stackable/icon', { contentAlign: 'left' } ],
		[ 'stackable/heading', {
			text: __( 'Icon Box', i18n ), hasP: true, textTag: 'h4',
		} ],
	] ],
	[ 'stackable/text', { text: __( 'Description for this block.', i18n ) } ],
]

const ICON_LABEL_TEMPLATE = [
	[ 'stackable/icon', { contentAlign: 'left' } ],
	[ 'stackable/heading', {
		text: __( 'Icon Label', i18n ), hasP: true, textTag: 'h4',
	} ],
]

const ICON_LIST_TEMPLATE = [
	[ 'stackable/icon-list-item', { text: __( 'List Item', i18n ) } ],
	[ 'stackable/icon-list-item', { text: __( 'List Item', i18n ) } ],
	[ 'stackable/icon-list-item', { text: __( 'List Item', i18n ) } ],
]

const PRICE_TEMPLATE = [
	[ 'stackable/text', {
		text: '$', htmlTag: 'span', innerTextTag: 'span',
	} ],
	[ 'stackable/text', {
		text: '99', htmlTag: 'span', innerTextTag: 'span', className: 'stk-block-price__price',
	} ],
	[ 'stackable/text', {
		text: '.00', htmlTag: 'span', innerTextTag: 'span',
	} ],
]

const PRICING_BOX_TEMPLATE = [
	[ 'stackable/heading', {
		text: __( 'Title for This Block', i18n ), textTag: 'h3',
	} ],
	[ 'stackable/price', {}, PRICE_TEMPLATE ],
	[ 'stackable/subtitle', { text: __( 'Subtitle for This Block', i18n ) } ],
	[ 'stackable/icon-list', {}, [
		[ 'stackable/icon-list-item', { text: sprintf( __( 'Package inclusion %s', i18n ), __( 'one', i18n ) ) } ],
		[ 'stackable/icon-list-item', { text: sprintf( __( 'Package inclusion %s', i18n ), __( 'two', i18n ) ) } ],
		[ 'stackable/icon-list-item', { text: sprintf( __( 'Package inclusion %s', i18n ), __( 'three', i18n ) ) } ],
	] ],
	[ 'stackable/button-group', {}, [
		[ 'stackable/button', {
			text: __( 'Button', i18n ),
		} ],
	] ],
]

const TABS_TEMPLATE = [
	[ 'stackable/tab-labels', {
		tabLabels: [
			{ label: sprintf( __( 'Tab %d', i18n ), 1 ), icon: '' },
			{ label: sprintf( __( 'Tab %d', i18n ), 2 ), icon: '' },
			{ label: sprintf( __( 'Tab %d', i18n ), 3 ), icon: '' },
		],
		blockShadow: 'inset 0px -1px 0px 0px rgba(0,0,0, 0.1)',
		tabBorderType: 'solid',
		tabBorderColor: 'transparent',
		tabBorderWidth: {
			top: 0,
			right: 0,
			bottom: 2,
			left: 0,
		},
		activeTabBorderColor: '#000000',
		tabTextColor1: '#999999',
		activeTabTextColor: '#000000',
		tabTextColorHover: '#000000',
		tabIconColor1: '#909090',
		activeTabIconColor1: '#000000',
		tabIconColor1Hover: '#909090',
		activeTabIconColor1Hover: '#000000',
		tabBackgroundColor: 'transparent',
	} ],
	[ 'stackable/tab-content', {}, [
		[ 'stackable/text', { text: LONG_TEXT[ 0 ] } ],
	] ],
]

const TIMELINE_TEMPLATE = [
	[ 'stackable/column', {
		columnSpacing: {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
		},
	}, [
		[ 'stackable/text', { text: __( 'Description for this block. Use this space for describing your block. Any text will do.', 'Content placeholder', i18n ) } ],
	] ],
]

export const PLACEHOLDER_INNER_BLOCKS = {
	'stackable/carousel': CAROUSEL_TEMPLATE,
	'stackable/column': COLUMN_TEMPLATE,
	'stackable/horizontal-scroller': HORIZONTAL_SCROLLER_TEMPLATE,
	'stackable/icon-box': ICON_BOX_TEMPLATE,
	'stackable/icon-label': ICON_LABEL_TEMPLATE,
	'stackable/icon-list': ICON_LIST_TEMPLATE,
	'stackable/price': PRICE_TEMPLATE,
	'stackable/pricing-box': PRICING_BOX_TEMPLATE,
	'stackable/tabs': TABS_TEMPLATE,
	'stackable/timeline': TIMELINE_TEMPLATE,
}
