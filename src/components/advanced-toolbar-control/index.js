/**
 * Internal dependencies
 */
import BaseControlMultiLabel from '../base-control-multi-label'
import SVGIconBottom from './images/bottom.svg'
import SVGIconHorizontalCenter from './images/horizontal-center.svg'
import SVGIconLeft from './images/left.svg'
import SVGIconRight from './images/right.svg'
import SVGIconStretch from './images/stretch.svg'
import SVGIconTop from './images/top.svg'
import SVGIconVerticalCenter from './images/vertical-center.svg'

/**
 * External dependencies
 */
import { omit } from 'lodash'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { BaseControl, Toolbar } from '@wordpress/components'
import { i18n } from 'stackable'
import { __ } from '@wordpress/i18n'

const FLEX_HORIZONTAL_ALIGN_OPTIONS = [
	{
		value: 'flex-start',
		title: __( 'Align Left', i18n ),
		icon: <SVGIconLeft />,
	},
	{
		value: 'center',
		title: __( 'Align Center', i18n ),
		icon: <SVGIconHorizontalCenter />,
	},
	{
		value: 'flex-end',
		title: __( 'Align Right', i18n ),
		icon: <SVGIconRight />,
	},
]

const FLEX_VERTICAL_ALIGN_STRETCH_OPTIONS = [
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

const CONTROLS = {
	'flex-horizontal': FLEX_HORIZONTAL_ALIGN_OPTIONS,
	'flex-vertical': FLEX_VERTICAL_ALIGN_OPTIONS,
	'flex-vertical-with-stretch': FLEX_VERTICAL_ALIGN_STRETCH_OPTIONS,
}

const AdvancedToolbarControl = props => {
	let controls = typeof props.controls === 'string' ? CONTROLS[ props.controls ] : props.controls

	// If no icon is given and a label is given, make the button a label.
	controls = controls.map( button => {
		if ( ! button.icon && button.label ) {
			return {
				...button,
				icon: <span className="ugb-advanced-toolbar-control__text-button">{ button.label }</span>,
			}
		}
		return button
	} )

	return (
		<BaseControl
			help={ props.help }
			className={ classnames( 'ugb-advanced-toolbar-control', props.className ) }
		>
			<BaseControlMultiLabel
				label={ props.label }
				units={ props.units }
				unit={ props.unit }
				onChangeUnit={ props.onChangeUnit }
				screens={ props.screens }
			/>
			<Toolbar
				{ ...omit( props, [ 'className', 'help', 'label', 'units', 'unit', 'onChangeUnit', 'screens' ] ) }
				controls={ controls.map( option => {
					return {
						...option,
						onClick: () => props.onChange( option.value !== props.value ? option.value : '' ),
						isActive: props.value === option.value,
					}
				} ) }
			/>
		</BaseControl>
	)
}

AdvancedToolbarControl.defaultProps = {
	onChange: () => {},
	onChangeUnit: () => {},
	help: '',
	className: '',
	units: [ 'px' ],
	unit: 'px',
	screens: [ 'desktop' ],
	value: '',
	controls: [],
}

export default AdvancedToolbarControl
