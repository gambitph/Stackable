/**
 * Internal dependencies
 */
import SVGIconBottom from './images/bottom.svg'
import SVGIconHorizontalCenter from './images/horizontal-center.svg'
import SVGIconLeft from './images/left.svg'
import SVGIconRight from './images/right.svg'
import SVGIconSpaceBetween from './images/horizontal-space-between.svg'
import SVGIconSpaceAround from './images/horizontal-space-around.svg'
import SVGIconSpaceEvenly from './images/horizontal-space-evenly.svg'
import SVGIconStretch from './images/stretch.svg'
import SVGIconVerticalBaseline from './images/vertical-baseline.svg'
import SVGIconTop from './images/top.svg'
import SVGIconVerticalCenter from './images/vertical-center.svg'
import Button from '../button'
import AdvancedControl, { extractControlProps } from '../base-control2'
import { useControlHandlers } from '../base-control2/hooks'
import { ResetButton } from '../base-control2/reset-button'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { omit, isEqual } from 'lodash'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { ButtonGroup } from '@wordpress/components'
import { memo } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

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
	{
		value: 'space-between',
		title: __( 'Space Between', i18n ),
		icon: <SVGIconSpaceBetween />,
	},
	{
		value: 'space-around',
		title: __( 'Space Around', i18n ),
		icon: <SVGIconSpaceAround />,
	},
	{
		value: 'space-evenly',
		title: __( 'Space Evenly', i18n ),
		icon: <SVGIconSpaceEvenly />,
	},
]

const FLEX_VERTICAL_ALIGN_OPTIONS = [
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
	{
		value: 'baseline',
		title: __( 'Baseline', i18n ),
		icon: <SVGIconVerticalBaseline />,
	},
]

const FLEX_VERTICAL_JUSTIFY_OPTIONS = [
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
		value: 'space-between',
		title: __( 'Space Between', i18n ),
		icon: <SVGIconSpaceBetween style={ { transform: 'rotate(90deg)' } } />,
	},
	{
		value: 'space-around',
		title: __( 'Space Around', i18n ),
		icon: <SVGIconSpaceAround style={ { transform: 'rotate(90deg)' } } />,
	},
	{
		value: 'space-evenly',
		title: __( 'Space Evenly', i18n ),
		icon: <SVGIconSpaceEvenly style={ { transform: 'rotate(90deg)' } } />,
	},
]

const HORIZONTAL_ALIGN_OPTIONS = [
	{
		value: 'flex-start',
		title: __( 'Left', i18n ),
		icon: <SVGIconLeft />,
	},
	{
		value: 'center',
		title: __( 'Center', i18n ),
		icon: <SVGIconHorizontalCenter />,
	},
	{
		value: 'flex-end',
		title: __( 'Right', i18n ),
		icon: <SVGIconRight />,
	},
]

const VERTICAL_ALIGN_OPTIONS = [
	{
		value: 'flex-start',
		title: __( 'Top', i18n ),
		icon: <SVGIconTop />,
	},
	{
		value: 'center',
		title: __( 'Center', i18n ),
		icon: <SVGIconVerticalCenter />,
	},
	{
		value: 'flex-end',
		title: __( 'Bottom', i18n ),
		icon: <SVGIconBottom />,
	},
]

export const CONTROLS = {
	'flex-horizontal': FLEX_HORIZONTAL_ALIGN_OPTIONS,
	'flex-vertical': FLEX_VERTICAL_ALIGN_OPTIONS,
	'flex-justify-vertical': FLEX_VERTICAL_JUSTIFY_OPTIONS,
	horizontal: HORIZONTAL_ALIGN_OPTIONS,
	vertical: VERTICAL_ALIGN_OPTIONS,
}

const AdvancedToolbarControl = props => {
	const [ _value, _onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover, props.valueCallback, props.changeCallback )
	const [ _propsToPass, controlProps ] = extractControlProps( props )

	const {
		className = '',
		controls: _controls,
		fullwidth,
		multiline,
		isToggleOnly,
	} = _propsToPass

	const _CONTROLS = applyFilters( 'stackable.toolbar-control.controls', CONTROLS )
	const controls = typeof _controls === 'string' ? _CONTROLS[ _controls ] : _controls

	const toolbarClasses = classnames( {
		'ugb-toolbar--full-width': fullwidth,
		'ugb-toolbar--multiline': multiline,
		'ugb-toolbar--small': props.isSmall,
	} )

	const value = typeof props.value === 'undefined' ? _value : props.value
	const onChange = typeof props.onChange === 'undefined' ? _onChange : props.onChange

	return (
		<AdvancedControl
			{ ...controlProps }
			className={ classnames( 'ugb-advanced-toolbar-control', className, controlProps.className ) }
		>
			<ButtonGroup
				children={
					controls.map( option => {
						const defaultValue = props.default || ''
						const controlProps = {
							...( omit( option, 'controls', 'show' ) ),
							onClick: () => {
								// If toggle only, prevent buttons from being unselected.
								if ( isToggleOnly && option.value === value ) {
									return
								}
								onChange( option.value !== value ? option.value : defaultValue )
							},
							isPrimary: value ? value === option.value : props.placeholder === option.value,
							isSmall: props.isSmall,
							children: ! option.icon ? option.custom || <span className="ugb-advanced-toolbar-control__text-button">{ option.title }</span> : null,
							disabled: props.disabled === 'all' ? true : props.disabled.includes( option.value ),
						}
						return <Button key={ option.value } { ...controlProps } />
					} )
				}
				className={ toolbarClasses }
			/>
			<ResetButton
				allowReset={ props.allowReset }
				value={ value }
				default={ props.default }
				onChange={ onChange }
			/>
		</AdvancedControl>
	)
}

AdvancedToolbarControl.defaultProps = {
	controls: [],
	multiline: false,
	fullwidth: true,
	isSmall: false,
	isToggleOnly: false,

	allowReset: true,
	default: '',

	attribute: '',
	responsive: false,
	hover: false,

	value: undefined,
	onChange: undefined,
	placeholder: '',
	disabled: [],
}

export default memo( AdvancedToolbarControl, isEqual )
