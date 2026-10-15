/**
 * Internal dependencies
 */
import ControlIconToggle from '../control-icon-toggle'
import ResponsiveToggle from '~stackable/components/responsive-toggle'
import { i18n } from 'stackable'
import LabelTooltip from '../base-control2/label-tooltip'

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n'
import { getPropsWithDefaults } from '../../util/props'

const BaseControlMultiLabel = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, BASE_CONTROL_MULTI_LABEL_DEFAULT_PROPS )
	const screens = props.screens === 'all' ? [ 'desktop', 'tablet', 'mobile' ] : props.screens

	const units = props.units?.map( unit => {
		return { value: unit }
	} ) || []

	return (
		<div className="ugb-base-control-multi-label">
			<LabelTooltip
				label={ props.label }
				{ ...props.helpTooltip }
			/>
			<ResponsiveToggle screens={ screens } />
			<div className="ugb-base-control-multi-label__units">
				<ControlIconToggle
					className="stk-control-unit-toggle"
					value={ props.unit }
					options={ units }
					onChange={ unit => props.onChangeUnit( unit ) }
					labelPosition="left"
					buttonLabel={ __( 'Unit', i18n ) }
					hasLabels={ false }
					hasColors={ false }
				/>
				{ props.afterButton }
			</div>
		</div>
	)
}

const BASE_CONTROL_MULTI_LABEL_DEFAULT_PROPS = {
	label: '',
	units: [ 'px' ],
	unit: 'px',
	onChangeUnit: () => {},
	screens: [ 'desktop' ], // You can pass "all" as shortcut for all devices.
	afterButton: null,
}

export default BaseControlMultiLabel
