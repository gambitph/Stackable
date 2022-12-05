/**
 * Internal dependencies
 */
import SVGH1 from './images/heading1.svg'
import SVGH2 from './images/heading2.svg'
import SVGH3 from './images/heading3.svg'
import SVGH4 from './images/heading4.svg'
import SVGH5 from './images/heading5.svg'
import SVGH6 from './images/heading6.svg'
import SVGP from './images/paragraph.svg'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { AdvancedToolbarControl } from '~stackable/components'

/**
 * WordPress dependencies
 */
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
import { memo } from '@wordpress/element'

const TAG_OPTIONS = [
	{
		value: 'h1',
		title: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Heading', i18n ), 1 ),
		icon: <SVGH1 />,
	},
	{
		value: 'h2',
		title: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Heading', i18n ), 2 ),
		icon: <SVGH2 />,
	},
	{
		value: 'h3',
		title: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Heading', i18n ), 3 ),
		icon: <SVGH3 />,
	},
	{
		value: 'h4',
		title: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Heading', i18n ), 4 ),
		icon: <SVGH4 />,
	},
	{
		value: 'h5',
		title: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Heading', i18n ), 5 ),
		icon: <SVGH5 />,
	},
	{
		value: 'h6',
		title: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Heading', i18n ), 6 ),
		icon: <SVGH6 />,
	},
	{
		value: 'p',
		title: __( 'Paragraph', i18n ),
		icon: <SVGP />,
	},
]

const TAG_OPTIONS_NOP = TAG_OPTIONS.filter( ( { value } ) => value !== 'p' )

const HeadingButtonsControl = memo( props => {
	return (
		<AdvancedToolbarControl
			{ ...props }
			className="ugb-heading-buttons-control"
			controls={ props.hasP ? TAG_OPTIONS : TAG_OPTIONS_NOP }
			placeholder={ TAG_OPTIONS[ 1 ].value }
			default={ TAG_OPTIONS[ 1 ].value }
		/>
	)
} )

HeadingButtonsControl.defaultProps = {
	label: sprintf( _x( '%s HTML Tag', 'component', i18n ), __( 'Title', i18n ) ),
	value: undefined,
	hasP: true,
}

export default HeadingButtonsControl
