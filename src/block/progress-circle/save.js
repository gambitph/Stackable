import ProgressCircleStyles from './style'
import {
	BlockDiv,
	CustomCSS,
	getResponsiveClasses,
} from '~stackable/block-components'
import { version as VERSION } from 'stackable'
import { withVersion } from '~stackable/higher-order'
import classnames from 'classnames'

import { InnerBlocks } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'

const Save = props => {
	const { className, attributes } = props
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
			<ProgressCircleStyles.Content { ...props } />
			<CustomCSS.Content attributes={ attributes } />
			<div
				className="stk-progress-circle"
				role="progressbar"
				aria-valuemin="0"
				aria-valuemax="100"
				aria-valuenow={ attributes.progressPercent }
				aria-valuetext={ attributes.progressAriaValueText }
			>
				<svg>
					<circle className="stk-progress-circle__background" />
					<circle className="stk-progress-circle__bar" />
				</svg>
				{ attributes.progressDisplayPercent && (
					<div className="number">
						<InnerBlocks.Content />
					</div>
				) }
			</div>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
