import ProgressCircleStyles from './style'
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
import { withBlockAttributeContext, withQueryLoopContext } from '~stackable/higher-order'
import classnames from 'classnames'
import striptags from 'striptags'

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

	const derivedValue = `${ attributes.textPrefix.trim() }${ attributes.progressPercent }${ attributes.textSuffix.trim() }`.trim()

	/**
	 * workaround to correct the circle width when size changes
	 */
	 const workAroundClass = classnames( {
		'force-redraw': forceRedraw,
	} )

	useEffect( () => {
		if ( attributes.progressSize ) {
			setForceRedraw( true )
			const timer = setTimeout( () => {
				setForceRedraw( false )
			}, 100 )
			return () => clearTimeout( timer )
		}
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
				<div
					className="stk-progress-circle animate"
					role="progressbar"
					aria-valuemin="0"
					aria-valuemax="100"
					aria-valuenow={ attributes.progressPercent }
					aria-valuetext={ striptags( attributes.progressAriaValueText || undefined ) }
				>
					<svg viewBox={ `0 0 ${ attributes.progressSize } ${ attributes.progressSize }` } className={ workAroundClass }>
						<circle className="stk-progress-circle__background" />
						<circle className="stk-progress-circle__bar" />
					</svg>
					{ attributes.show && (
						<div className="number">
							<Typography
								tagName="h4"
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
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
