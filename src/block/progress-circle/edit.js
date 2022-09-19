import ProgressCircleStyles from './style'
import { InspectorTabs } from '~stackable/components'
import {
	BlockDiv,
	Advanced,
	Responsive,
	Transform,
	EffectsAnimations,
	CustomAttributes,
	CustomCSS,
	ConditionalDisplay,
	ProgressBar,
	useGeneratedCss,
} from '~stackable/block-components'
import { version as VERSION } from 'stackable'
import { useBlockHoverClass } from '~stackable/hooks'
import { withBlockAttributeContext, withQueryLoopContext } from '~stackable/higher-order'
import classnames from 'classnames'
import striptags from 'striptags'

import { compose } from '@wordpress/compose'
import { InnerBlocks } from '@wordpress/block-editor'

const ALLOWED_BLOCKS = [ 'stackable/text', 'stackable/count-up' ]

const Edit = ( {
	className, attributes,
} ) => {
	useGeneratedCss( attributes )

	const blockHoverClass = useBlockHoverClass()

	const blockClassNames = classnames( [
		className,
		'stk-block-progress-circle',
		blockHoverClass,
	] )

	return (
		<>
			<InspectorTabs />

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
				<div
					className="stk-progress-circle stk--with-animation animate"
					role="progressbar"
					aria-valuemin="0"
					aria-valuemax="100"
					aria-valuenow={ attributes.progressPercent }
					aria-valuetext={ striptags( attributes.progressAriaValueText || undefined ) }
				>
					<svg>
						<circle className="stk-progress-circle__background" />
						<circle className="stk-progress-circle__bar" />
					</svg>
					{ attributes.progressDisplayPercent && (
						<div className="number">
							<InnerBlocks
								allowedBlocks={ ALLOWED_BLOCKS }
								template={ [
									[ 'stackable/text', {
										text: '50%', htmlTag: 'h4', innerTextTag: 'span',
									} ],
								] }
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
