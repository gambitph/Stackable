/**
 * Internal dependencies
 */
import ProgressCircleStyles from './style'
import { DEFAULT_PERCENT } from './schema'

/**
 * External dependencies
 */
import { InspectorTabs } from '~stackable/components'
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
		'stk-block-progress-circle',
	] )

	const containerClassNames = classnames( [
		'stk-block-progress-circle__container',
		blockAlignmentClass,
	] )

	const textClassNames = classnames( [
		'stk-progress-circle__inner-text',
		textClasses,
	] )

	// this is to handle dynamic content; only show valid value
	const parsedPercent = parseFloat( attributes.progressPercent )
	const derivedPercent = isNaN( parsedPercent ) ? DEFAULT_PERCENT : parsedPercent
	const derivedValue = `${ attributes.textPrefix }${ derivedPercent }${ attributes.textSuffix }`.trim()

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
			<CustomCSS.InspectorControls mainBlockClass="stk-block-progress-circle" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<ProgressBar.InspectorControls isCircle />
			<Typography.InspectorControls
				initialOpen={ false }
				hasTextTag={ false }
				hasTextContent={ false }
				hasTextShadow
				hasToggle
				label={ __( 'Label', i18n ) }
			/>

			<BlockDiv className={ blockClassNames }>
				<ProgressCircleStyles version={ VERSION } />
				<CustomCSS mainBlockClass="stk-block-progress-circle" />
				<div className={ containerClassNames }>
					<div className="stk-progress-circle stk-animate">
						<svg>
							{ attributes.progressColorType === 'gradient' && (
								<defs>
									<linearGradient
										id={ `gradient-${ attributes.uniqueId }` }
										gradientTransform={ attributes.progressColorGradientDirection ? `rotate(${ attributes.progressColorGradientDirection })` : undefined }
									>
										<stop offset="0%" stopColor={ attributes.progressColor1 } />
										<stop offset="100%" stopColor={ attributes.progressColor2 } />
									</linearGradient>
								</defs>
							) }
							<circle className="stk-progress-circle__background" />
							<circle className="stk-progress-circle__bar" />
						</svg>
						{ attributes.showText && (
							<div className="stk-number">
								<Typography
									tagName="span"
									className={ textClassNames }
									value={ derivedValue }
									editable={ false }
								/>
							</div>
						) }
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
