/**
 * Internal dependencies
 */
import ProgressCircleStyles from './style'
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
import { useState, useEffect } from '@wordpress/element'

const Edit = ( {
	className, attributes,
} ) => {
	const [ forceRedraw, setForceRedraw ] = useState( false )
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

	/**
	 * workaround to correct the circle width when size changes
	 */
	 const workAroundClass = classnames( {
		'force-redraw': forceRedraw,
	} )

	useEffect( () => {
		setForceRedraw( true )
		const timer = setTimeout( () => {
			setForceRedraw( false )
		}, [ 50 ] )
		return () => clearTimeout( timer )
	}, [ attributes.progressSize ] )

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

			<ProgressBar.InspectorControls />

			<BlockDiv className={ blockClassNames }>
				<ProgressCircleStyles version={ VERSION } />
				<CustomCSS mainBlockClass="stk-block-progress-circle" />
				<div className={ containerClassNames }>
					<div
						className="stk-progress-circle stk-animate"
						role="progressbar"
						aria-valuemin="0"
						aria-valuemax="100"
						aria-valuenow={ derivedPercent }
						{ ...( attributes.progressAriaValueText && {
							'aria-valuetext': striptags( attributes.progressAriaValueText ),
						} ) }
					>
						<svg className={ workAroundClass }>
							{ attributes.progressColorType === 'gradient' && (
								<defs>
									<linearGradient
										id={ `gradient-${ attributes.uniqueId }` }
										{ ...( attributes.progressColorGradientDirection && {
											gradientTransform: `rotate(${ attributes.progressColorGradientDirection })`,
										} ) }
									>
										<stop offset="0%" stopColor={ attributes.progressColor1 } />
										<stop offset="100%" stopColor={ attributes.progressColor2 } />
									</linearGradient>
								</defs>
							) }
							<circle className="stk-progress-circle__background" />
							<circle className="stk-progress-circle__bar" />
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
