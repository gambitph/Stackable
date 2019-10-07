/**
 * Internal dependencies
 */
import SVGH1 from './images/heading1.svg'
import SVGH2 from './images/heading2.svg'
import SVGH3 from './images/heading3.svg'
import SVGH4 from './images/heading4.svg'
import SVGH5 from './images/heading5.svg'
import SVGH6 from './images/heading6.svg'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { BaseControl, Toolbar } from '@wordpress/components'
import {
	__, _x, sprintf,
} from '@wordpress/i18n'

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
]

const HeadingButtonsControl = props => {
	const {
		label,
		value,
		onChange,
	} = props

	return (
		<BaseControl
			label={ label }
			id="ugb-heading-buttons-control"
			className="ugb-heading-buttons-control"
		>
			<Toolbar
				className="ugb-toolbar-full-width"
				controls={
					TAG_OPTIONS.map( option => {
						return {
							...option,
							onClick: () => onChange( value !== option.value ? option.value : '' ),
							isActive: value === option.value,
						}
					} )
				}
			/>
		</BaseControl>
	)
}

HeadingButtonsControl.defaultProps = {
	label: sprintf( _x( '%s HTML Tag', 'component' ), __( 'Title', i18n ) ),
	value: TAG_OPTIONS[ 0 ].value,
	onChange: () => {},
}

export default HeadingButtonsControl
