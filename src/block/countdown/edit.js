/**
 * Internal dependencies
 */
import { CountdownStyles } from './style'
import { CountdownNumber } from './countdown-number'

/**
 * External dependencies
 */
import {
	Divider,
	BlockDiv,
	ContainerDiv,
	useGeneratedCss,
	CustomCSS,
	Responsive,
	Advanced,
	Alignment,
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
	AdvancedRangeControl,
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
import { compose } from '@wordpress/compose'
import { DateTimePicker } from '@wordpress/components'
import { Fragment } from 'react'

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

	const labelClassNames = classnames( [
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
							{	attributes.countdownType === 'dueDate' && (
								<Fragment>
									<DateTimePicker
										label={ __( 'Start Date', i18n ) }
										currentDate={ attributes.date }
										is12Hour={ true }
										onChange={ currentDate => {
											// Do not include seconds
											setAttributes( { date: currentDate.slice( 0, currentDate.length - 3 ) } )
										} }
									/>
									<AdvancedSelectControl
										label={ __( 'Timezone', i18n ) }
										// value={ value || 'large' }
										// options={ imageSizeOptions }
										// className={ classnames( className, [ 'ugb--help-tip-image-size' ] ) }
										// defaultValue={ defaultValue || 'large' }
									/>
									<AdvancedSelectControl
										label={ __( 'Action on Expiration', i18n ) }
										value={ attributes.actionOnExpiration }
										options={ ACTION_ON_EXPIRATION_OPTIONS }
										defaultValue={ attributes.actionOnExpiration }
										attribute="actionOnExpiration"
									/>
									{ attributes.actionOnExpiration === 'showMessage' }
								</Fragment>
							) }
							{ attributes.countdownType === 'recurring' && (
								<div className="stk-block-countdown__recurring_control">
									<DateTimePicker
										label={ __( 'Start Date', i18n ) }
										currentDate={ attributes.date }
										is12Hour={ true }
										onChange={ currentDate => {
											// Do not include seconds
											setAttributes( { date: currentDate.slice( 0, currentDate.length - 3 ) } )
										} }
									/>
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
								</div>
							) }
							<AdvancedRangeControl
								label={ __( 'Box Gap', i18n ) }
								min={ 0 }
								sliderMax={ 50 }
								value={ attributes.boxGap }
								attribute="boxGap"
							/>
							<AdvancedRangeControl
								label={ __( 'Label Top Margin', i18n ) }
								min={ 0 }
								sliderMax={ 50 }
								value={ attributes.labelMarginTop }
								attribute="labelMarginTop"
							/>
						</PanelAdvancedSettings>
					</InspectorStyleControls>
					{ attributes.actionOnExpiration === 'showMessage' &&
						<Typography.InspectorControls
							label={ __( 'Message', i18n ) }
							attrNameTemplate="message%s"
							hasTextTag={ true }
							hasTextContent={ true }
						/> }
					<Typography.InspectorControls
						label={ __( 'Digits', i18n ) }
						attrNameTemplate="digit%s"
						hasTextTag={ false }
						hasTextContent={ false }
					/>
					<Typography.InspectorControls
						label={ __( 'Labels', i18n ) }
						attrNameTemplate="label%s"
						hasTextTag={ false }
						hasTextContent={ false }
					/>
					<Divider.InspectorControls />
					<Alignment.InspectorControls />
					<BlockDiv.InspectorControls />
					<Advanced.InspectorControls />
					<Transform.InspectorControls />
					<ContainerDiv.InspectorControls sizeSelector=".stk-block-countdown__content" />
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
					<ContainerDiv className={ contentClassNames }>
						<CountdownNumber
							className={ dayDigitClassNames }
							type={ 'days' }
							datetime={ attributes.date }
						/>
						<Typography
							identifier="day"
							tagName="p"
							className={ labelClassNames }
							attrNameTemplate="day%s"
							placeholder={ __( 'Days', i18n ) }
						/>
					</ContainerDiv>
					{ props.attributes?.hasDivider && <Divider attributes={ attributes } className={ dividerClassNames } /> }
					<ContainerDiv className={ contentClassNames }>
						<CountdownNumber
							className={ hourDigitClassNames }
							type={ 'hours' }
							datetime={ attributes.date }
						/>
						<Typography
							identifier="hour"
							tagName="p"
							className={ labelClassNames }
							attrNameTemplate="hour%s"
							placeholder={ __( 'Hours', i18n ) }
						/>
					</ContainerDiv>
					{ props.attributes?.hasDivider && <Divider attributes={ attributes } className={ dividerClassNames } /> }
					<ContainerDiv className={ contentClassNames }>
						<CountdownNumber
							className={ minuteDigitClassNames }
							type={ 'minutes' }
							datetime={ attributes.date }
						/>
						<Typography
							identifier="minute"
							tagName="p"
							className={ labelClassNames }
							attrNameTemplate="minute%s"
							placeholder={ __( 'Minutes', i18n ) }
						/>
					</ContainerDiv>
					{ props.attributes?.hasDivider && <Divider attributes={ attributes } className={ dividerClassNames } /> }
					<ContainerDiv className={ contentClassNames }>
						<CountdownNumber
							className={ secondDigitClassNames }
							type={ 'seconds' }
							datetime={ attributes.date }
						/>
						<Typography
							identifier="second"
							tagName="p"
							className={ labelClassNames }
							attrNameTemplate="second%s"
							placeholder={ __( 'Seconds', i18n ) }
						/>
					</ContainerDiv>
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
