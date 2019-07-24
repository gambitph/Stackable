import { BaseControl, Toolbar } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import BaseControlMultiLabel from '../base-control-multi-label'
import classnames from 'classnames'
import { i18n } from 'stackable'
import { omit } from 'lodash'
import SVGIconBottom from './images/bottom.svg'
import SVGIconStretch from './images/stretch.svg'
import SVGIconTop from './images/top.svg'
import SVGIconVerticalCenter from './images/vertical-center.svg'

const FLEX_HORIZONTAL_ALIGN_OPTIONS = [
	{
		value: 'flex-start',
		title: __( 'Align Left', i18n ),
		icon: 'editor-alignleft',
	},
	{
		value: 'center',
		title: __( 'Align Center', i18n ),
		icon: 'editor-aligncenter',
	},
	{
		value: 'flex-end',
		title: __( 'Align Right', i18n ),
		icon: 'editor-alignright',
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
	{
		value: 'stretch',
		title: __( 'Stretch', i18n ),
		icon: <SVGIconStretch />,
	},
]

const CONTROLS = {
	'flex-horizontal': FLEX_HORIZONTAL_ALIGN_OPTIONS,
	'flex-vertical': FLEX_VERTICAL_ALIGN_OPTIONS,
}

const AdvancedToolbarControl = props => {
	const controls = typeof props.controls === 'string' ? CONTROLS[ props.controls ] : props.controls

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
						onClick: () => props.onChange( option.value ),
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
