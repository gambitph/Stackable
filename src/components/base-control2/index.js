/**
 * A better version that handles value updating, responsive, hover & unit toggles.
 */

/**
 * Internal dependencies
 */
import ControlIconToggle from '../control-icon-toggle'
import ResponsiveToggle from '../responsive-toggle'
import HoverStateToggle from './hover-state-toggle'
import { VisualGuideer } from './use-visual-guide'
import LabelTooltip from './label-tooltip'
import {
	useAttributeName, useBlockAttributesContext, useBlockSetAttributesContext, useDeviceType,
} from '~stackable/hooks'

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
import { Fragment } from '@wordpress/element'
import { BaseControl as GutBaseControl } from '@wordpress/components'

// Expose useControlHandlers to our API.
export { useControlHandlers } from './hooks'

const ALL_SCREENS = [ 'desktop', 'tablet', 'mobile' ]
const EMPTY_OBJ = {}

export const BaseControl = props => {
	const deviceType = useDeviceType()

	const className = classnames( [
		'stk-control',
		props.className,
	], {
		'stk-control--disabled': ( props.disableTablet && deviceType === 'Tablet' ) || ( props.disableMobile && deviceType === 'Mobile' ),
	} )

	const hasResponsive = !! props.responsive?.length
	const hasHover = !! props.hover?.length
	const hasUnits = !! props.units?.length

	const responsive = props.responsive === 'all' ? ALL_SCREENS : props.responsive

	const units = ( props.units && props.units?.map( unit => {
		return { value: unit }
	} ) ) || []

	const labelClassName = classnames( [
		'stk-control-label',
	], {
		'stk-control-label--bold': props.boldLabel,
	} )

	const label = props.boldLabel ? <h3>{ props.label }</h3> : props.label

	const VisualGuide = props.visualGuide !== EMPTY_OBJ ? VisualGuideer : Fragment

	return (
		<GutBaseControl
			help={ props.help }
			className={ className }
		>
			<VisualGuide { ...props.visualGuide }>
				<div className={ labelClassName }>
					<LabelTooltip label={ label } { ...props.helpTooltip } />
					<div className="stk-control-label__toggles">
						{ hasResponsive && (
							<ResponsiveToggle
								screens={ responsive }
								attribute={ props.attribute }
								hasTabletValue={ props.hasTabletValue }
								hasMobileValue={ props.hasMobileValue }
								valueCheckAttribute={ props.valueCheckAttribute }
							/>
						) }
						{ hasHover && (
							<HoverStateToggle
								hover={ props.hover }
								attribute={ props.attribute }
								hasResponsive={ hasResponsive }
							/>
						) }
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
			</VisualGuide>
		</GutBaseControl>
	)
}

BaseControl.defaultProps = {
	className: '',
	label: '',
	help: '',
	boldLabel: false,
	attribute: '',

	responsive: false,
	hover: false,

	units: false,
	unit: '',
	onChangeUnit: null,

	after: null,

	disableTablet: false, // If true, then the control will be disabled in tablet preview.
	disableMobile: false, // If true, then the control will be disabled in mobile preview.

	hasTabletValue: undefined, // If true, then the responsive toggle for tablet will be highlighted to show that the tablet value has been set.
	hasMobileValue: undefined, // If true, then the responsive toggle for mobile will be highlighted to show that the mobile value has been set.

	visualGuide: EMPTY_OBJ, // If supplied, displays a highlight on the block.
	helpTooltip: EMPTY_OBJ, // If supplied, displays a help tooltip when hovering on the label.
}

const AdvancedControl = props => {
	// Unit handles
	const unitAttrName = useAttributeName( `${ props.attribute }Unit`, props.responsive, props.hover )
	const unitAttribute = useBlockAttributesContext( attributes => attributes[ unitAttrName ] ) || ''

	const unit = props.unit ? props.unit : unitAttribute
	const setAttributes = useBlockSetAttributesContext()
	const onChangeUnit = unit => {
		if ( props.onChangeUnit ) {
			return props.onChangeUnit( unit, unitAttrName, unitAttribute )
		}
		setAttributes( { [ unitAttrName ]: unit } )
	}

	return (
		<BaseControl
			{ ...props }
			unit={ unit }
			onChangeUnit={ onChangeUnit }
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

	valueCheckAttribute: '', // Checks the value of different variations of the attribute name i.e. backgroundMedia -> backgroundMediaUrl. This is mainly used for the modified indicator.

	disableTablet: false, // If true, then the control will be disabled in tablet preview.
	disableMobile: false, // If true, then the control will be disabled in mobile preview.

	hasTabletValue: undefined, // If true, then the responsive toggle for tablet will be highlighted to show that the tablet value has been set.
	hasMobileValue: undefined, // If true, then the responsive toggle for mobile will be highlighted to show that the mobile value has been set.

	visualGuide: EMPTY_OBJ, // If supplied, displays a highlight on the block.
	helpTooltip: EMPTY_OBJ, // If supplied, displays a help tooltip when hovering on the label.
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
