import ProgressBarStyles from './style'
import {
	BlockDiv,
	CustomCSS,
	Typography,
	getResponsiveClasses,
	getTypographyClasses,
	getAlignmentClasses,
} from '~stackable/block-components'
import { version as VERSION } from 'stackable'
import { withVersion } from '~stackable/higher-order'
import classnames from 'classnames'
import striptags from 'striptags'

import { compose } from '@wordpress/compose'
import { DEFAULT_PERCENT } from '../../block-components/progress-bar/attributes'

const Save = props => {
	const { className, attributes } = props
	const responsiveClass = getResponsiveClasses( attributes )
	const blockAlignmentClass = getAlignmentClasses( attributes )
	const textClasses = getTypographyClasses( attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-progress-bar',
		responsiveClass,
		blockAlignmentClass,
	] )

	const textClassNames = classnames( [
		'stk-progress-bar__inner-text',
		textClasses,
	] )

	const divClassNames = classnames( [
		'stk-progress-bar',
		{
			'stk--with-animation': attributes.progressAnimate,
		},
	] )

	const derivedPercent = attributes.progressPercent || DEFAULT_PERCENT
	const derivedValue = `${ attributes.textPrefix.trim() }${ derivedPercent }${ attributes.textSuffix.trim() }`.trim()

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<ProgressBarStyles.Content { ...props } />
			<CustomCSS.Content attributes={ attributes } />
			<div
				className={ divClassNames }
				role="progressbar"
				aria-valuemin="0"
				aria-valuemax="100"
				aria-valuenow={ derivedPercent }
				{ ...( attributes.progressAriaValueText && {
					'aria-valuetext': striptags( attributes.progressAriaValueText ),
				} ) }
			>
				<svg>
					{ attributes.progressColorType === 'gradient' && (
						<defs>
							<linearGradient id={ `gradient-${ attributes.uniqueId }` }>
								<stop offset="0%" stopColor={ attributes.progressColor1 } />
								<stop offset="100%" stopColor={ attributes.progressColor2 } />
							</linearGradient>
						</defs>
					) }
					<circle className="stk-progress__background" />
					<circle className="stk-progress__bar" />
				</svg>
				{ attributes.show && (
					<div className="stk-number">
						<Typography.Content
							tagName="span"
							className={ textClassNames }
							value={ derivedValue }
						/>
					</div>
				) }
			</div>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
