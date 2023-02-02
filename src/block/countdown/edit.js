/**
 * Internal dependencies
 */
import { CountdownStyles } from './style'
import { CountdownNumber } from './countdown-number'
import { Divider } from './divider'
import { timezones as TIMEZONE_OPTIONS } from './timezones'

/**
 * External dependencies
 */
import {
	BlockDiv,
	ContainerDiv,
	useGeneratedCss,
	CustomCSS,
	Responsive,
	Advanced,
	// Alignment,
	MarginBottom,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Transform,
	Typography,
	getTypographyClasses,
} from '~stackable/block-components'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import {
	InspectorStyleControls, InspectorTabs, PanelAdvancedSettings, AdvancedSelectControl, AdvancedToolbarControl,
	AdvancedRangeControl, AdvancedToggleControl, AdvancedTextControl,
} from '~stackable/components'
import {
	 withBlockAttributeContext,
	 withBlockWrapperIsHovered,
	 withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { __, i18n } from '@wordpress/i18n'
import { useEffect, Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'
import { DateTimePicker } from '@wordpress/components'
import { useBlockEditContext } from '@wordpress/block-editor'
import { addFilter } from '@wordpress/hooks'

const COUNTDOWN_TYPE_OPTIONS = [
	{
		value: 'dueDate',
		title: __( 'Due Date', i18n ),
	},
	{
		value: 'recurring',
		title: __( 'Recurring', i18n ),
	},
]

const ACTION_ON_EXPIRATION_OPTIONS = [
	{
		label: __( 'None', i18n ),
		value: '',
	},
	{
		label: __( 'Hide Block', i18n ),
		value: 'hide',
	},
	{
		label: __( 'Display Message', i18n ),
		value: 'showMessage',
	},

]

const Edit = props => {
	const {
		className,
		setAttributes,
		attributes,
		clientId,
		isSelected,
	} = props

	useGeneratedCss( props.attributes )

	const digitTextClasses = getTypographyClasses( attributes, 'digit%s' )

	const labelTextClasses = getTypographyClasses( attributes, 'label%s' )

	const messageTextClasses = getTypographyClasses( attributes, 'message%s' )

	const blockClassNames = classnames( [
		className,
		'stk-block-countdown',
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
	] )

	const dayDigitClassNames = classnames( [
		'stk-block-countdown__digit',
		'stk-block-countdown__digit_day',
		digitTextClasses,
	] )

	const hourDigitClassNames = classnames( [
		'stk-block-countdown__digit',
		'stk-block-countdown__digit_hour',
		digitTextClasses,
	] )

	const minuteDigitClassNames = classnames( [
		'stk-block-countdown__digit',
		'stk-block-countdown__digit_minute',
		digitTextClasses,
	] )

	const secondDigitClassNames = classnames( [
		'stk-block-countdown__digit',
		'stk-block-countdown__digit_second',
		digitTextClasses,
	] )

	const dayLabelClassNames = classnames( [
		'stk-block-countdown__label_day',
		'stk-block-countdown__label',
		labelTextClasses,
	] )

	const hourLabelClassNames = classnames( [
		'stk-block-countdown__label_hour',
		'stk-block-countdown__label',
		labelTextClasses,
	] )

	const minuteLabelClassNames = classnames( [
		'stk-block-countdown__label_minute',
		'stk-block-countdown__label',
		labelTextClasses,
	] )

	const secondLabelClassNames = classnames( [
		'stk-block-countdown__label_second',
		'stk-block-countdown__label',
		labelTextClasses,
	] )

	const messageClassNames = classnames( [
		'stk-block-countdown__message',
		messageTextClasses,
	] )

	const dividerClassNames = classnames( [
		'stk-block-countdown__divider',
	] )

	useEffect( () => {
		if ( attributes.countdownType === 'recurring' ) {
			setAttributes( { actionOnExpiration: '' } )
		}
	}, [ attributes.countdownType ] )

	useEffect( () => {
		if ( attributes.dividerType === '|' ) {
			setAttributes( { dividerTopOffset: 3, dividerSizeColon: 45 } )
		} else {
			setAttributes( { dividerSizeLine: 50 } )
		}
	}, [ attributes.dividerType ] )

	return (
		<>
			{ isSelected && (
				<>
					<InspectorTabs />
					<InspectorStyleControls>
						<PanelAdvancedSettings
							title={ __( 'General', i18n ) }
							id="countdown"
							initialOpen={ true }
						>
							<AdvancedToolbarControl
								controls={ COUNTDOWN_TYPE_OPTIONS }
								attribute="countdownType"
								value={ attributes.countdownType }
								fullwidth={ true }
								default={ 'dueDate' }
								isSmall={ false }
							/>
							<span>
								{ attributes.countdownType === 'dueDate' ? 'End Date' : 'Start Date' }
							</span>
							<DateTimePicker
								currentDate={ attributes.date }
								is12Hour={ true }
								onChange={ currentDate => {
									// Do not include seconds
									setAttributes( { date: currentDate.slice( 0, currentDate.length - 3 ) } )
								} }
								__nextRemoveResetButton={ true }
							/>
							{	attributes.countdownType === 'dueDate' && (
								<>
									<AdvancedSelectControl
										label={ __( 'Timezone', i18n ) }
										value={ attributes.timezone }
										options={ TIMEZONE_OPTIONS }
										defaultValue={ '' }
										attribute="timezone"
									/>
									<AdvancedSelectControl
										label={ __( 'Action on Expiration', i18n ) }
										value={ attributes.actionOnExpiration }
										options={ ACTION_ON_EXPIRATION_OPTIONS }
										defaultValue={ '' }
										attribute="actionOnExpiration"
									/>
									{ attributes.actionOnExpiration === 'showMessage' }
								</>
							) }
							{ attributes.countdownType === 'recurring' && (
								<Fragment>
									<AdvancedRangeControl
										label={ __( 'Days', i18n ) }
										min={ 0 }
										max={ 364 }
										value={ attributes.daysLeft }
										attribute="daysLeft"
									/>
									<AdvancedRangeControl
										label={ __( 'Hours', i18n ) }
										min={ 0 }
										max={ 23 }
										value={ attributes.hoursLeft }
										attribute="hoursLeft"
									/>
									<AdvancedRangeControl
										label={ __( 'Minutes', i18n ) }
										min={ 0 }
										max={ 59 }
										value={ attributes.minutesLeft }
										attribute="minutesLeft"
									/>
									<AdvancedRangeControl
										label={ __( 'Seconds', i18n ) }
										min={ 0 }
										max={ 59 }
										value={ attributes.secondsLeft }
										attribute="secondsLeft"
									/>
									<AdvancedRangeControl
										label={ __( 'Restart Countdown After no. of Hours', i18n ) }
										min={ 0 }
										maxSlider={ 10 }
										value={ attributes.restartInterval }
										attribute="restartInterval"
									/>
								</Fragment>
							) }
							<AdvancedToggleControl
								label={ __( 'Enable Double Digit', i18n ) }
								attribute="isDoubleDigitHidden"
								defaultValue={ false }
							/>
							<AdvancedRangeControl
								label={ __( 'Box Gap', i18n ) }
								min={ 0 }
								sliderMax={ 50 }
								attribute="boxGap"
								default={ 16 }
							/>
							<AdvancedRangeControl
								label={ __( 'Label Top Margin', i18n ) }
								min={ 0 }
								sliderMax={ 50 }
								attribute="labelMarginTop"
								placeholder="8"
								default={ 8 }
							/>
						</PanelAdvancedSettings>
					</InspectorStyleControls>
					<Typography.InspectorControls
						label={ __( 'Digits', i18n ) }
						attrNameTemplate="digit%s"
						hasTextTag={ false }
						hasTextContent={ false }
						initialOpen={ false }
					/>
					<Typography.InspectorControls
						label={ __( 'Labels', i18n ) }
						attrNameTemplate="label%s"
						hasTextTag={ false }
						hasTextContent={ false }
						initialOpen={ false }
					/>
					<Divider.InspectorControls />
					{ /* <Alignment.InspectorControls /> */ }
					<BlockDiv.InspectorControls />
					<Advanced.InspectorControls />
					<Transform.InspectorControls />
					<ContainerDiv.InspectorControls sizeSelector=".stk-block-countdown__content" />
					{ attributes.actionOnExpiration === 'showMessage' &&
						<Typography.InspectorControls
							label={ __( 'Expired Message', i18n ) }
							attrNameTemplate="message%s"
							hasTextTag={ true }
							hasTextContent={ true }
							initialOpen={ false }
						/> }
					<EffectsAnimations.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-countdown" />
					<Responsive.InspectorControls />
					<ConditionalDisplay.InspectorControls />
				</>
			) }

			<CountdownStyles
				version={ VERSION }
				blockState={ props.blockState }
				clientId={ clientId }
			/>
			<CustomCSS mainBlockClass="stk-block-countdown" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<div className="stk-block-countdown__container">
					{ attributes.dayShow &&
						<ContainerDiv className={ contentClassNames }>
							<CountdownNumber
								className={ dayDigitClassNames }
								type={ 'days' }
								datetime={ attributes.date }
								countdownType={ attributes.countdownType }
								daysLeft={ attributes.daysLeft }
								hoursLeft={ attributes.hoursLeft }
								minutesLeft={ attributes.minutesLeft }
								secondsLeft={ attributes.secondsLeft }
								isDoubleDigit={ attributes.isDoubleDigitHidden }
							/>
							<Typography
								identifier="day"
								tagName="p"
								className={ dayLabelClassNames }
								attrNameTemplate="day%s"
								placeholder={ __( 'Days', i18n ) }
								withoutInteractiveFormatting={ true }
							/>
						</ContainerDiv>
					}
					{ attributes.hasDivider && attributes.dayShow && <Divider attributes={ attributes } className={ dividerClassNames } /> }
					{ attributes.hourShow &&
						<ContainerDiv className={ contentClassNames }>
							<CountdownNumber
								className={ hourDigitClassNames }
								type={ 'hours' }
								datetime={ attributes.date }
								countdownType={ attributes.countdownType }
								daysLeft={ attributes.daysLeft }
								hoursLeft={ attributes.hoursLeft }
								minutesLeft={ attributes.minutesLeft }
								secondsLeft={ attributes.secondsLeft }
								isDoubleDigit={ attributes.isDoubleDigitHidden }
							/>
							<Typography
								identifier="hour"
								tagName="p"
								className={ hourLabelClassNames }
								attrNameTemplate="hour%s"
								placeholder={ __( 'Hours', i18n ) }
								withoutInteractiveFormatting={ true }
							/>
						</ContainerDiv>
					}
					{ attributes.hasDivider && attributes.hourShow && <Divider attributes={ attributes } className={ dividerClassNames } /> }
					{ attributes.minuteShow &&
						<ContainerDiv className={ contentClassNames }>
							<CountdownNumber
								className={ minuteDigitClassNames }
								type={ 'minutes' }
								datetime={ attributes.date }
								countdownType={ attributes.countdownType }
								daysLeft={ attributes.daysLeft }
								hoursLeft={ attributes.hoursLeft }
								minutesLeft={ attributes.minutesLeft }
								secondsLeft={ attributes.secondsLeft }
								isDoubleDigit={ attributes.isDoubleDigitHidden }
							/>
							<Typography
								identifier="minute"
								tagName="p"
								className={ minuteLabelClassNames }
								attrNameTemplate="minute%s"
								placeholder={ __( 'Minutes', i18n ) }
								withoutInteractiveFormatting={ true }
							/>
						</ContainerDiv>
					}
					{ attributes.hasDivider && attributes.minuteShow && attributes.secondShow && <Divider attributes={ attributes } className={ dividerClassNames } /> }
					{ attributes.secondShow &&
						<ContainerDiv className={ contentClassNames }>
							<CountdownNumber
								className={ secondDigitClassNames }
								type={ 'seconds' }
								datetime={ attributes.date }
								countdownType={ attributes.countdownType }
								daysLeft={ attributes.daysLeft }
								hoursLeft={ attributes.hoursLeft }
								minutesLeft={ attributes.minutesLeft }
								secondsLeft={ attributes.secondsLeft }
								isDoubleDigit={ attributes.isDoubleDigitHidden }
							/>
							<Typography
								identifier="second"
								tagName="p"
								className={ secondLabelClassNames }
								attrNameTemplate="second%s"
								placeholder={ __( 'Seconds', i18n ) }
								withoutInteractiveFormatting={ true }
							/>
						</ContainerDiv>
					}
				</div>
				{ attributes.actionOnExpiration === 'showMessage' &&
					<Typography
						identifier="message"
						className={ messageClassNames }
						attrNameTemplate="message%s"
					/>
				}
			</BlockDiv>
			{ props.isHovered && <MarginBottom /> }
		</>
	)
}

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )

// Add meta controls for labels.
addFilter( 'stackable.block-component.typography.before', 'stackable/posts', ( output, props ) => {
	const { name } = useBlockEditContext()
	if ( name !== 'stackable/countdown' ) {
		return output
	}

	if ( props.attrNameTemplate !== 'label%s' ) {
		return output
	}

	return (
		<>
			<AdvancedToggleControl
				label={ __( 'Days', i18n ) }
				attribute="dayShow"
				defaultValue={ true }
			/>
			<AdvancedToggleControl
				label={ __( 'Hours', i18n ) }
				attribute="hourShow"
				defaultValue={ true }
			/>
			<AdvancedToggleControl
				label={ __( 'Minutes', i18n ) }
				attribute="minuteShow"
				defaultValue={ true }
			/>
			<AdvancedToggleControl
				label={ __( 'Seconds', i18n ) }
				attribute="secondShow"
				defaultValue={ true }
			/>
			<AdvancedTextControl
				label={ __( 'Days Label', i18n ) }
				attribute="dayText"
				placeholder="Days"
				default={ __( 'Days', i18n ) }
			/>

			<AdvancedTextControl
				label={ __( 'Hours Label', i18n ) }
				attribute="hourText"
				placeholder="Hours"
				default={ __( 'Hours', i18n ) }
			/>

			<AdvancedTextControl
				label={ __( 'Minutes Label', i18n ) }
				attribute="minuteText"
				placeholder="Minutes"
				default={ __( 'Minutes', i18n ) }
			/>

			<AdvancedTextControl
				label={ __( 'Seconds Label', i18n ) }
				attribute="secondText"
				placeholder="Seconds"
				default={ __( 'Seconds', i18n ) }
			/>
		</>
	)
} )
