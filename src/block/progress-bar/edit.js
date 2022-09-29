/**
 * Internal dependencies
 */
import ProgressBarStyles from './style'
import { DEFAULT_PERCENT } from '../../block-components/progress-bar/attributes'

/**
 * External dependencies
 */
import { InspectorTabs } from '~stackable/components'
import {
	BlockDiv,
	Alignment,
	Advanced,
	Responsive,
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
import { version as VERSION } from 'stackable'
import {
	withBlockAttributeContext, withBlockWrapper, withQueryLoopContext,
} from '~stackable/higher-order'
import classnames from 'classnames'
import striptags from 'striptags'

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
		blockAlignmentClass,
	] )

	const textClassNames = classnames( [
		'stk-progress-bar__inner-text',
		textClasses,
	] )

	const derivedPercent = attributes.progressPercent || DEFAULT_PERCENT
	const derivedValue = `${ attributes.textPrefix.trim() }${ derivedPercent }${ attributes.textSuffix.trim() }`.trim()

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

			<BlockDiv className={ blockClassNames }>
				<ProgressBarStyles version={ VERSION } />
				<CustomCSS mainBlockClass="stk-block-progress-bar" />
				<div
					className="stk-progress-bar stk-animate"
					role="progressbar"
					aria-valuemin="0"
					aria-valuemax="100"
					aria-valuenow={ derivedPercent }
					{ ...( attributes.progressAriaValueText && {
						'aria-valuetext': striptags( attributes.progressAriaValueText ),
					} ) }
				>
					<svg>
						{ attributes.progressColorType === 'gradient' && (
							<defs>
								<linearGradient id={ `gradient-${ attributes.uniqueId }` }>
									<stop offset="0%" stopColor={ attributes.progressColor1 } />
									<stop offset="100%" stopColor={ attributes.progressColor2 } />
								</linearGradient>
							</defs>
						) }
						<circle className="stk-progress__background" />
						<circle className="stk-progress__bar" />
					</svg>
					{ attributes.show && (
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
			</BlockDiv>
		</>
	)
}

export default compose(
	withBlockWrapper,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
