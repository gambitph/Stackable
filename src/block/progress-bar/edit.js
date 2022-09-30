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

	const barClassNames = classnames( 'stk-progress__bar', {
		'stk--has-background-overlay': attributes.progressColorType === 'gradient' && attributes.progressColor2,
	} )

	const derivedPercent = typeof attributes.progressPercent === 'string' ? DEFAULT_PERCENT : attributes.progressPercent
	const derivedValue = `${ attributes.textPrefix.trim() }${ derivedPercent }${ attributes.textSuffix.trim() }`.trim()
	const deviedAriaValue = attributes.progressAriaValueText || attributes.progressInnerText || attributes.text

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
					{ ...( deviedAriaValue && {
						'aria-valuetext': striptags( deviedAriaValue ),
					} ) }
				>
					<div className="stk-progress__background">
						<div className={ barClassNames }>
							{ attributes.show && (
								<>
									<Typography
										tagName="span"
										className={ classnames( [ textClassNames, 'stk-progress-text' ] ) }
										value={ attributes.progressInnerText || attributes.text }
									/>
									<Typography
										tagName="span"
										className={ classnames( [ textClassNames, 'stk-progress-percent-text' ] ) }
										value={ derivedValue }
										editable={ false }
									/>
								</>
							) }
						</div>
					</div>
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
