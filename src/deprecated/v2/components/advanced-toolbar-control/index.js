import SVGIconBottom from './images/bottom.svg'
import SVGIconHorizontalCenter from './images/horizontal-center.svg'
import SVGIconLeft from './images/left.svg'
import SVGIconRight from './images/right.svg'
import SVGIconStretch from './images/stretch.svg'
import SVGIconTop from './images/top.svg'
import SVGIconVerticalCenter from './images/vertical-center.svg'

import { i18n } from 'stackable'

import { __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'

const FLEX_HORIZONTAL_ALIGN_OPTIONS = [
	{
		value: 'flex-start',
		title: __( 'Start', i18n ),
		icon: <SVGIconLeft />,
	},
	{
		value: 'center',
		title: __( 'Center', i18n ),
		icon: <SVGIconHorizontalCenter />,
	},
	{
		value: 'flex-end',
		title: __( 'End', i18n ),
		icon: <SVGIconRight />,
	},
]

const FLEX_VERTICAL_ALIGN_STRETCH_OPTIONS = [
	{
		value: 'flex-start',
		title: __( 'Start', i18n ),
		icon: <SVGIconTop />,
	},
	{
		value: 'center',
		title: __( 'Center', i18n ),
		icon: <SVGIconVerticalCenter />,
	},
	{
		value: 'flex-end',
		title: __( 'End', i18n ),
		icon: <SVGIconBottom />,
	},
	{
		value: 'stretch',
		title: __( 'Stretch', i18n ),
		icon: <SVGIconStretch />,
	},
]

const FLEX_VERTICAL_ALIGN_OPTIONS = [
	{
		value: 'flex-start',
		title: __( 'Align Top', i18n ),
		icon: <SVGIconTop />,
	},
	{
		value: 'center',
		title: __( 'Align Center', i18n ),
		icon: <SVGIconVerticalCenter />,
	},
	{
		value: 'flex-end',
		title: __( 'Align Bottom', i18n ),
		icon: <SVGIconBottom />,
	},
]

addFilter( 'stackable.toolbar-control.controls', controls => {
	return {
		...controls,
		'__flex-horizontal': FLEX_HORIZONTAL_ALIGN_OPTIONS,
		'__flex-vertical': FLEX_VERTICAL_ALIGN_OPTIONS,
		'__flex-vertical-with-stretch': FLEX_VERTICAL_ALIGN_STRETCH_OPTIONS,
	}
} )
