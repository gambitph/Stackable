import {
	BlockDiv,
	CustomCSS,
	getResponsiveClasses,
} from '~stackable/block-components'
import classnames from 'classnames'

import { InnerBlocks } from '@wordpress/block-editor'

const Save = ( { className, attributes } ) => {
	const responsiveClass = getResponsiveClasses( attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-progress-circle',
		responsiveClass,
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<CustomCSS.Content attributes={ attributes } />
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
						<InnerBlocks.Content />
					</div>
				) }
			</div>
		</BlockDiv.Content>
	)
}

export default Save
