/**
 * External dependencies
 */
import {
	FourRangeControl,
	WhenResponsiveScreen,
} from '~stackable/components'
import { i18n } from 'stackable'
import { pick } from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'

const SpacingControl = props => {
	const propsToPass = pick( props, [ 'label', 'units', 'screens', 'defaultLocked', 'enableTop', 'enableRight', 'enableBottom', 'enableLeft', 'className', 'sliderMax', 'sliderMin' ] )

	// Allow different sets of min/max/step values per screen size.
	const min = Array.isArray( props.min ) ? props.min : [ props.min, props.min, props.min ]
	const max = Array.isArray( props.max ) ? props.max : [ props.max, props.max, props.max ]
	const sliderMin = Array.isArray( props.sliderMin ) ? props.sliderMin : [ props.sliderMin, props.sliderMin, props.sliderMin ]
	const sliderMax = Array.isArray( props.sliderMax ) ? props.sliderMax : [ props.sliderMax, props.sliderMax, props.sliderMax ]
	const step = Array.isArray( props.step ) ? props.step : [ props.step, props.step, props.step ]

	return <Fragment>
		<WhenResponsiveScreen screen="desktop">
			<FourRangeControl
				{ ...propsToPass }
				min={ min[ 0 ] }
				max={ max[ 0 ] }
				sliderMin={ sliderMin[ 0 ] }
				sliderMax={ sliderMax[ 0 ] }
				step={ step[ 0 ] }
				top={ props.valueDesktop.top }
				right={ props.valueDesktop.right }
				bottom={ props.valueDesktop.bottom }
				left={ props.valueDesktop.left }
				unit={ props.valueDesktopUnit || props.units[ 0 ] }
				onChange={
					( {
						top, right, bottom, left,
					} ) => {
						props.onChangeDesktop( {
							top: ! top && top !== 0 ? '' : parseInt( top, 10 ),
							right: ! right && right !== 0 ? '' : parseInt( right, 10 ),
							bottom: ! bottom && bottom !== 0 ? '' : parseInt( bottom, 10 ),
							left: ! left && left !== 0 ? '' : parseInt( left, 10 ),
						} )
					} }
				onChangeUnit={ value => props.onChangeDesktopUnit( value ) }
				placeholder={ props.placeholder }
				placeholderTop={ props.placeholderTop }
				placeholderLeft={ props.placeholderLeft }
				placeholderBottom={ props.placeholderBottom }
				placeholderRight={ props.placeholderRight }
			/>
		</WhenResponsiveScreen>
		<WhenResponsiveScreen screen="tablet">
			<FourRangeControl
				{ ...propsToPass }
				min={ min[ 1 ] }
				max={ max[ 1 ] }
				sliderMin={ sliderMin[ 1 ] }
				sliderMax={ sliderMax[ 1 ] }
				step={ step[ 1 ] }
				top={ props.valueTablet.top }
				right={ props.valueTablet.right }
				bottom={ props.valueTablet.bottom }
				left={ props.valueTablet.left }
				unit={ props.valueTabletUnit || props.units[ 0 ] }
				onChange={
					( {
						top, right, bottom, left,
					} ) => {
						props.onChangeTablet( {
							top: ! top && top !== 0 ? '' : parseInt( top, 10 ),
							right: ! right && right !== 0 ? '' : parseInt( right, 10 ),
							bottom: ! bottom && bottom !== 0 ? '' : parseInt( bottom, 10 ),
							left: ! left && left !== 0 ? '' : parseInt( left, 10 ),
						} )
					} }
				onChangeUnit={ value => props.onChangeTabletUnit( value ) }
			/>
		</WhenResponsiveScreen>
		<WhenResponsiveScreen screen="mobile">
			<FourRangeControl
				{ ...propsToPass }
				min={ min[ 2 ] }
				max={ max[ 2 ] }
				sliderMin={ sliderMin[ 2 ] }
				sliderMax={ sliderMax[ 2 ] }
				step={ step[ 2 ] }
				top={ props.valueMobile.top }
				right={ props.valueMobile.right }
				bottom={ props.valueMobile.bottom }
				left={ props.valueMobile.left }
				unit={ props.valueMobileUnit || props.units[ 0 ] }
				onChange={
					( {
						top, right, bottom, left,
					} ) => {
						props.onChangeMobile( {
							top: ! top && top !== 0 ? '' : parseInt( top, 10 ),
							right: ! right && right !== 0 ? '' : parseInt( right, 10 ),
							bottom: ! bottom && bottom !== 0 ? '' : parseInt( bottom, 10 ),
							left: ! left && left !== 0 ? '' : parseInt( left, 10 ),
						} )
					} }
				onChangeUnit={ value => props.onChangeMobileUnit( value ) }
			/>
		</WhenResponsiveScreen>
	</Fragment>
}

SpacingControl.defaultProps = {
	label: __( 'Spacing', i18n ),
	defaultLocked: true,
	units: [ 'px', 'em', '%' ],
	screens: [ 'desktop', 'tablet', 'mobile' ],
	min: 0,
	max: Infinity,
	sliderMax: null,
	sliderMin: null,
	step: 1,
	enableTop: true,
	enableRight: true,
	enableBottom: true,
	enableLeft: true,
	valueDesktop: {},
	valueTablet: {},
	valueMobile: {},
	valueDesktopUnit: '',
	valueTabletUnit: '',
	valueMobileUnit: '',
	onChangeDesktop: () => {},
	onChangeTablet: () => {},
	onChangeMobile: () => {},
	onChangeDesktopUnit: () => {},
	onChangeTabletUnit: () => {},
	onChangeMobileUnit: () => {},
	placeholderTop: '60',
	placeholderLeft: '35',
	placeholderBottom: '60',
	placeholderRight: '35',
	placeholder: '',
	className: 'ugb--help-tip-advanced-column-paddings',
}

export default SpacingControl
