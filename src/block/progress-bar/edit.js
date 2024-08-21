/**
 * Internal dependencies
 */
import ProgressBarStyles from './style'
import { DEFAULT_PROGRESS } from './schema'

/**
 * External dependencies
 */
import { InspectorTabs, useDynamicContent } from '~stackable/components'
import {
	BlockDiv,
	Advanced,
	Responsive,
	MarginBottom,
	Transform,
	EffectsAnimations,
	CustomAttributes,
	CustomCSS,
	ConditionalDisplay,
	ProgressBar,
	useGeneratedCss,
	Typography,
	getTypographyClasses,
	getAlignmentClasses,
	Alignment,
} from '~stackable/block-components'
import { version as VERSION, i18n } from 'stackable'
import {
	withBlockAttributeContext, withBlockWrapperIsHovered, withQueryLoopContext,
} from '~stackable/higher-order'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import { memo } from '@wordpress/element'

const Edit = props => {
	const {
		clientId,
		className,
		attributes,
	} = props

	useGeneratedCss( attributes )

	const blockAlignmentClass = getAlignmentClasses( attributes )
	const textClasses = getTypographyClasses( attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-progress-bar',
	] )

	const containerClassNames = classnames( [
		'stk-block-progress-bar__container',
		blockAlignmentClass,
	] )

	const textClassNames = classnames( [
		'stk-progress-bar__inner-text',
		textClasses,
	] )

	const barClassNames = classnames( 'stk-progress-bar__bar', {
		'stk--has-background-overlay': attributes.progressColorType === 'gradient' && attributes.progressColor2,
	} )

	const progressValue = attributes.progressValue || ''

	// parsing string to number since progress value is of a string type to support dynamic content
	const parsedProgressValue = parseFloat( useDynamicContent( progressValue ).replace( /,/g, '' ) )
	const derivedProgressValue = isNaN( parsedProgressValue ) ? DEFAULT_PROGRESS : parsedProgressValue
	const derivedValue = `${ attributes.progressValuePrefix }${ derivedProgressValue }${ attributes.progressValueSuffix }`.trim()

	return (
		<>
			<InspectorControls blockState={ props.blockState } />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<ProgressBarStyles
					version={ VERSION }
					blockState={ props.blockState }
					clientId={ clientId }
				/>
				<CustomCSS mainBlockClass="stk-block-progress-bar" />
				<div className={ containerClassNames }>
					<div className="stk-progress-bar stk-animate">
						<div className={ barClassNames }>
							{ attributes.showText && (
								<>
									<Typography
										tagName="span"
										className={ classnames( [ textClassNames, 'stk-progress-bar__text' ] ) }
										value={ attributes.text }
									/>
									<Typography
										tagName="span"
										className={ classnames( [ textClassNames, 'stk-progress-bar__progress-value-text' ] ) }
										value={ derivedValue }
										editable={ false }
									/>
								</>
							) }
						</div>
					</div>
				</div>
				{ /* Add our progress style here because we're adjusting the value using a hook */ }
				<style>
					{ `.editor-styles-wrapper .stk-${ props.attributes.uniqueId } .stk-progress-bar { --progress-value:${ derivedValue }% !important; }` }
				</style>
			</BlockDiv>
			{ props.isHovered && <MarginBottom /> }
		</>
	)
}

const InspectorControls = memo( props => {
	return (
		<>
			<InspectorTabs />

			<Alignment.InspectorControls />
			<ProgressBar.InspectorControls />
			<Typography.InspectorControls
				{ ...props }
				initialOpen={ false }
				hasTextTag={ false }
				hasTextContent={ false }
				hasTextShadow
				hasToggle
				label={ __( 'Label', i18n ) }
			/>

			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-progress-bar" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

		</>
	)
} )

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
