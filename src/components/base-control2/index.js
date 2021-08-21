/**
 * A better version that handles value updating, responsive, hover & unit toggles.
 */

/**
 * Internal dependencies
 */
import ControlIconToggle from '../control-icon-toggle'
import ResponsiveToggle from '../responsive-toggle'
import HoverStateToggle from './hover-state-toggle'
import { useAttributeName, useBlockAttributes } from '~stackable/hooks'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n } from 'stackable'
import { pick, omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { BaseControl as GutBaseControl } from '@wordpress/components'
import { useBlockEditContext } from '@wordpress/block-editor'
import { useDispatch } from '@wordpress/data'
import { useMemo, useCallback } from '@wordpress/element'

export const BaseControl = props => {
	const className = classnames( [
		'stk-control',
		props.className,
	] )

	const hasRepsonsive = !! props.responsive?.length
	const hasHover = !! props.hover?.length
	const hasUnits = !! props.units?.length

	const responsive = props.responsive === 'all' ? [ 'desktop', 'tablet', 'mobile' ] : props.responsive

	const units = useMemo( () => (
		props.units && props.units?.map( unit => {
			return { value: unit }
		} )
	), [ props.units ] ) || []

	const labelClassName = classnames( [
		'stk-control-label',
	], {
		'stk-control-label--bold': props.boldLabel,
	} )

	const label = props.boldLabel ? <h3>{ props.label }</h3> : props.label

	return (
		<GutBaseControl
			help={ props.help }
			className={ className }
		>
			<div className={ labelClassName }>
				<div className="components-base-control__label">{ label }</div>
				<div className="stk-control-label__toggles">
					{ hasRepsonsive && <ResponsiveToggle screens={ responsive } /> }
					{ hasHover && <HoverStateToggle hover={ props.hover } /> }
				</div>
				<div className="stk-control-label__after">
					{ hasUnits &&
						<ControlIconToggle
							className="stk-control-label__units"
							value={ props.unit }
							options={ units }
							onChange={ unit => props.onChangeUnit( unit ) }
							buttonLabel={ __( 'Unit', i18n ) }
							hasLabels={ false }
							hasColors={ false }
							labelPosition="left"
						/>
					}
					{ props.after }
				</div>
			</div>
			<div className="stk-control-content">
				{ props.children }
			</div>
		</GutBaseControl>
	)
}

BaseControl.defaultProps = {
	className: '',
	label: '',
	help: '',
	boldLabel: false,

	responsive: false,
	hover: false,

	units: false,
	unit: '',
	onChangeUnit: null,

	after: null,
}

const AdvancedControl = props => {
	const { clientId } = useBlockEditContext()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const attributes = useBlockAttributes( clientId )

	// Unit handles
	const unitAttrName = useAttributeName( `${ props.attribute }Unit`, props.responsive, props.hover )
	const unit = props.unit ? props.unit : attributes ? attributes[ unitAttrName ] : ''
	const onChangeUnit = useCallback( unit => updateBlockAttributes( clientId, { [ unitAttrName ]: unit } ), [ unitAttrName ] )

	const propsToPass = omit( props, [ 'attribute' ] )

	return (
		<BaseControl
			{ ...propsToPass }
			unit={ unit }
			onChangeUnit={ props.onChangeUnit || onChangeUnit }
		/>
	)
}

AdvancedControl.defaultProps = {
	// Control props
	className: '',
	label: '',
	help: '',

	attribute: '', // The name of the attribute to adjust.

	responsive: false,
	hover: false,
	units: false,

	onChangeUnit: null,
	unit: null,

	after: null,
}

export default AdvancedControl

export const extractControlProps = props => {
	const advancedControlProps = [ ...Object.keys( AdvancedControl.defaultProps ), 'allowReset', 'screens' ]
	const controlProps = pick( props, advancedControlProps )
	if ( props.screens ) {
		controlProps.responsive = props.screens
	}

	return [
		omit( props, advancedControlProps ),
		controlProps,
	]
}
