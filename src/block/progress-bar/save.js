import ProgressBarStyles from './style'
import { DEFAULT_PERCENT } from './schema'

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

	const barClassNames = classnames( 'stk-progress-bar__bar', {
		'stk--has-background-overlay': attributes.progressColorType === 'gradient' && attributes.progressColor2,
	} )

	// parsing string to number since percentage is of a string type to support dynamic content
	const percentage = parseFloat( attributes.progressPercent )
	const derivedPercent = isNaN( percentage ) ? DEFAULT_PERCENT : percentage
	const derivedValue = `${ attributes.textPrefix }${ derivedPercent }${ attributes.textSuffix }`.trim()
	const deviedAriaValue = attributes.progressAriaValueText || attributes.progressInnerText || attributes.text

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
				aria-valuetext={ deviedAriaValue ? striptags( deviedAriaValue ) : undefined }
			>
				<div className={ barClassNames }>
					{ attributes.showText && (
						<>
							<Typography.Content
								tagName="span"
								className={ classnames( [ textClassNames, 'stk-progress-bar__text' ] ) }
								value={ attributes.progressInnerText || attributes.text }
							/>
							<Typography.Content
								tagName="span"
								className={ classnames( [ textClassNames, 'stk-progress-bar__percent-text' ] ) }
								value={ derivedValue }
							/>
						</>
					) }
				</div>
			</div>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
