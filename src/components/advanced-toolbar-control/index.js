/**
 * Internal dependencies
 */
import SVGIconBottom from './images/bottom.svg'
import SVGIconHorizontalCenter from './images/horizontal-center.svg'
import SVGIconLeft from './images/left.svg'
import SVGIconRight from './images/right.svg'
import SVGIconStretch from './images/stretch.svg'
import SVGIconTop from './images/top.svg'
import SVGIconVerticalCenter from './images/vertical-center.svg'
import Button from '../button'
import { BaseControl } from '..'

/**
 * External dependencies
 */
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import {
	ButtonGroup,
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
	const {
		className = '',
		controls: _controls,
		fullwidth,
		multiline,
		isToggleOnly,
		...propsToPass
	} = props

	const controls = typeof _controls === 'string' ? CONTROLS[ _controls ] : _controls

	const toolbarClasses = classnames( {
		'ugb-toolbar--full-width': fullwidth,
		'ugb-toolbar--multiline': multiline,
	} )

	return (
		<BaseControl
			className={ classnames( 'ugb-advanced-toolbar-control', className ) }
			{ ...propsToPass }
		>
			<ButtonGroup
				children={
					controls.map( ( option, index ) => {
						const controlProps = {
							...option,
							onClick: () => {
								// If toggle only, prevent buttons from being unselected.
								if ( isToggleOnly && option.value === props.value ) {
									return
								}
								props.onChange( option.value !== props.value ? option.value : '' )
							},
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
	isToggleOnly: false,
	allowReset: true,
}

export default AdvancedToolbarControl
