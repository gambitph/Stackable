/**
 * Internal dependencies
 */
import ControlIconToggle from '../control-icon-toggle'
import ResponsiveToggle from '~stackable/components/responsive-toggle'
import { i18n } from 'stackable'

/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

const BaseControlMultiLabel = props => {
	const screens = props.screens === 'all' ? [ 'desktop', 'tablet', 'mobile' ] : props.screens

	const units = useMemo( () => (
		props.units?.map( unit => {
			return { value: unit }
		} )
	), [ props.units ] ) || []

	return (
		<div className="ugb-base-control-multi-label">
			<div className="ugb-base-control-multi-label__label components-base-control__label">{ props.label }</div>
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

BaseControlMultiLabel.defaultProps = {
	label: '',
	units: [ 'px' ],
	unit: 'px',
	onChangeUnit: () => {},
	screens: [ 'desktop' ], // You can pass "all" as shortcut for all devices.
	afterButton: null,
}

export default BaseControlMultiLabel
