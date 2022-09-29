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
		blockAlignmentClass,
	] )

	const textClassNames = classnames( [
		'stk-progress-circle__inner-text',
		textClasses,
	] )

	const derivedPercent = typeof attributes.progressPercent === 'string' ? DEFAULT_PERCENT : attributes.progressPercent
	const derivedValue = `${ attributes.textPrefix.trim() }${ derivedPercent }${ attributes.textSuffix.trim() }`.trim()

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

			<ProgressBar.InspectorControls isCircle />

			<BlockDiv className={ blockClassNames }>
				<ProgressCircleStyles version={ VERSION } />
				<CustomCSS mainBlockClass="stk-block-progress-circle" />
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
								<linearGradient id={ `gradient-${ attributes.uniqueId }` }>
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
			</BlockDiv>
		</>
	)
}

export default compose(
	withBlockWrapper,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
