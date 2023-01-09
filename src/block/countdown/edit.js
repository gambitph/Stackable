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
	InspectorStyleControls, InspectorTabs, PanelAdvancedSettings, AdvancedSelectControl,
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
							<DateTimePicker
								label={ __( 'End Date', i18n ) }
								currentDate={ attributes.endDate }
								is12Hour={ true }
								onChange={ currentDate => {
									// Do not include seconds
									setAttributes( { endDate: currentDate.slice( 0, currentDate.length - 3 ) } )
								} }
							/>
							<AdvancedSelectControl
								// value={ value || 'large' }
								// options={ imageSizeOptions }
								// className={ classnames( className, [ 'ugb--help-tip-image-size' ] ) }
								// defaultValue={ defaultValue || 'large' }
							/>
						</PanelAdvancedSettings>
					</InspectorStyleControls>
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
				<ContainerDiv className={ contentClassNames }>
					<CountdownNumber
						className={ dayDigitClassNames }
						type={ 'days' }
						datetime={ attributes?.endDate }
					/>
					<Typography
						identifier="day"
						tagName="p"
						className={ labelClassNames }
						attrNameTemplate="day%s"
						placeholder={ __( 'Days', i18n ) }
					/>
				</ContainerDiv>
				{ props.attributes?.hasDivider && <Divider { ...props } /> }
				<ContainerDiv className={ contentClassNames }>
					<CountdownNumber
						className={ hourDigitClassNames }
						type={ 'hours' }
						datetime={ attributes?.endDate }
					/>
					<Typography
						identifier="hour"
						tagName="p"
						className={ labelClassNames }
						attrNameTemplate="hour%s"
						placeholder={ __( 'Hours', i18n ) }
					/>
				</ContainerDiv>
				{ props.attributes?.hasDivider && <Divider { ...props } /> }
				<ContainerDiv className={ contentClassNames }>
					<CountdownNumber
						className={ minuteDigitClassNames }
						type={ 'minutes' }
						datetime={ attributes?.endDate }
					/>
					<Typography
						identifier="minute"
						tagName="p"
						className={ labelClassNames }
						attrNameTemplate="minute%s"
						placeholder={ __( 'Minutes', i18n ) }
					/>
				</ContainerDiv>
				{ props.attributes?.hasDivider && <Divider { ...props } /> }
				<ContainerDiv className={ contentClassNames }>
					<CountdownNumber
						className={ secondDigitClassNames }
						type={ 'seconds' }
						datetime={ attributes?.endDate }
					/>
					<Typography
						identifier="second"
						tagName="p"
						className={ labelClassNames }
						attrNameTemplate="second%s"
						placeholder={ __( 'Seconds', i18n ) }
					/>
				</ContainerDiv>

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
