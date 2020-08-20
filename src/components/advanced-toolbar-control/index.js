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
import {
	BaseControl, ButtonGroup, Button,
} from '@wordpress/components'
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
	const controls = typeof props.controls === 'string' ? CONTROLS[ props.controls ] : props.controls

	const toolbarClasses = classnames( {
		'ugb-toolbar--full-width': props.fullwidth,
		'ugb-toolbar--multiline': props.multiline,
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
			<ButtonGroup
				{ ...omit( props, [ 'className', 'help', 'label', 'units', 'unit', 'onChangeUnit', 'screens' ] ) }
				children={
					controls.map( ( option, index ) => {
						const controlProps = {
							...option,
							onClick: () => props.onChange( option.value !== props.value ? option.value : '' ),
							isPrimary: props.value === option.value,
							isSmall: props.isSmall,
							children: ! option.icon ? option.custom || <span className="ugb-advanced-toolbar-control__text-button">{ option.title }</span> : null,
						}
						return <Button key={ index } { ...controlProps } />
					} )
				}
				className={ toolbarClasses }
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
	multiline: false,
	fullwidth: true,
	isSmall: false,
}

export default AdvancedToolbarControl
