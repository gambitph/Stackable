import ProgressCircleStyles from './style'
import {
	BlockDiv,
	CustomCSS,
	getResponsiveClasses,
} from '~stackable/block-components'
import { version as VERSION } from 'stackable'
import { withVersion } from '~stackable/higher-order'
import classnames from 'classnames'
import striptags from 'striptags'

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

	const divClassNames = classnames( [
		'stk-progress-circle',
		{
			'stk--with-animation': attributes.progressAnimate,
		},
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<ProgressCircleStyles.Content { ...props } />
			<CustomCSS.Content attributes={ attributes } />
			<div
				className={ divClassNames }
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
