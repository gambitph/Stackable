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
	Alignment,
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
} from '~stackable/block-components'
import { version as VERSION, i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
import {
	withBlockAttributeContext, withBlockWrapper, withQueryLoopContext,
} from '~stackable/higher-order'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'

const Edit = ( {
	className, attributes,
} ) => {
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

	// parsing string to number since progress value is of a string type to support dynamic content
	const parsedProgressValue = parseFloat( useDynamicContent( attributes.progressValue ) )
	const derivedProgressValue = isNaN( parsedProgressValue ) ? DEFAULT_PROGRESS : parsedProgressValue
	const derivedValue = `${ attributes.progressValuePrefix }${ derivedProgressValue }${ attributes.progressValueSuffix }`.trim()

	return (
		<>
			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />

			{ /** Advanced controls */ }
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-progress-bar" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<ProgressBar.InspectorControls />
			<Typography.InspectorControls
				initialOpen={ false }
				hasTextTag={ false }
				hasTextContent={ false }
				hasTextShadow
				hasToggle
				label={ __( 'Label', i18n ) }
			/>

			<BlockDiv className={ blockClassNames }>
				<ProgressBarStyles version={ VERSION } />
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
			</BlockDiv>
			<MarginBottom />
		</>
	)
}

export default compose(
	withBlockWrapper,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
