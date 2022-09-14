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
} from '~stackable/block-components'
import { useBlockHoverClass } from '~stackable/hooks'
import { withBlockAttributeContext, withQueryLoopContext } from '~stackable/higher-order'
import classnames from 'classnames'

import { compose } from '@wordpress/compose'
import { InnerBlocks } from '@wordpress/block-editor'

const ALLOWED_BLOCKS = [ 'stackable/text', 'stackable/count-up' ]

// className
// attributes
// setAttributes
// context - whatever data defined in metadata "usesContext"
// clientId
// name
const Edit = ( {
	className, attributes,
} ) => {
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
				<div
					className="stk-progress-circle"
					style={ {
						'--thickness': `${ attributes.thickness }px`,
						'--percent': attributes.percentage,
						'--progress-color': attributes.progressColor,
						'--progress-background': attributes.progressBackgroundColor,
					} }
					role="progressbar"
					aria-valuemin="0"
					aria-valuemax="100"
					aria-valuenow={ attributes.percentage }
					aria-valuetext={ attributes.ariaValueText }
				>
					<svg>
						<circle className="stk-progress-circle__background" />
						<circle className="stk-progress-circle__bar" />
					</svg>
					{ attributes.displayPercentage && (
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
