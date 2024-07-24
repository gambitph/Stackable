/**
 * Internal dependencies
 */
import ProgressCircleStyles from './style'
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
import {
	withBlockAttributeContext, withBlockWrapperIsHovered, withQueryLoopContext,
} from '~stackable/higher-order'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'

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

	const progressValue = attributes.progressValue || ''

	// this is to handle dynamic content; only show valid value
	const parsedProgressValue = parseFloat( useDynamicContent( progressValue ).replace( /,/g, '' ) )
	const derivedProgressValue = isNaN( parsedProgressValue ) ? DEFAULT_PROGRESS : parsedProgressValue
	const derivedValue = `${ attributes.progressValuePrefix }${ derivedProgressValue }${ attributes.progressValueSuffix }`.trim()

	// generate custom identifier on the editor as uniqueId can be blank
	// This happens when adding block with default block styling created.
	// should use uniqueId upon saving
	const color1 = attributes.progressColor1 || ''
	const color2 = attributes.progressColor2 || ''
	const direction = attributes.progressColorGradientDirection || ''
	const customGradientId = ( color1 + color2 + direction ).replace( /[^0-9A-Z]+/gi, '' )

	return (
		<>
			<>
				<InspectorTabs />

				<Alignment.InspectorControls />

				<ProgressBar.InspectorControls isCircle />
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
				<CustomCSS.InspectorControls mainBlockClass="stk-block-progress-circle" />
				<Responsive.InspectorControls />
				<ConditionalDisplay.InspectorControls />

			</>

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<ProgressCircleStyles
					version={ VERSION }
					blockState={ props.blockState }
					clientId={ clientId }
				/>
				<CustomCSS mainBlockClass="stk-block-progress-circle" />
				<div className={ containerClassNames }>
					<div className="stk-progress-circle stk-animate">
						<svg>
							{ attributes.progressColorType === 'gradient' && (
								<defs>
									<linearGradient
										id={ `gradient-${ customGradientId }` }
										gradientTransform={ attributes.progressColorGradientDirection ? `rotate(${ attributes.progressColorGradientDirection })` : undefined }
									>
										<stop offset="0%" stopColor={ attributes.progressColor1 } />
										<stop offset="100%" stopColor={ attributes.progressColor2 } />
									</linearGradient>
								</defs>
							) }
							<circle className="stk-progress-circle__background"></circle>
							<circle className="stk-progress-circle__bar"></circle>
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
				{ /* Add our progress style here because we're adjusting the value using a hook */ }
				<style>
					{ `.editor-styles-wrapper .stk-${ props.attributes.uniqueId } .stk-progress-circle { --progress-value:${ derivedValue } }` }
				</style>
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
