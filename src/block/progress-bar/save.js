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
	] )

	const containerClassNames = classnames( [
		'stk-block-progress-bar__container',
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

	// this is to handle dynamic content; only show valid value
	let percent = attributes.progressPercent
	const isDynamicContent = !! attributes.progressPercent?.startsWith( '!#stk_dynamic/' )
	if ( ! isDynamicContent ) {
		percent = parseFloat( attributes.progressPercent )
		percent = isNaN( percent ) ? DEFAULT_PERCENT : percent
	}
	const derivedValue = `${ attributes.progressPercentPrefix }${ percent }${ attributes.progressPercentSuffix }`.trim()
	const deviedAriaValue = attributes.progressAriaValueText || attributes.text

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
		>
			<ProgressBarStyles.Content { ...props } />
			<CustomCSS.Content attributes={ attributes } />
			<div className={ containerClassNames }>
				<div
					className={ divClassNames }
					role="progressbar"
					aria-valuemin="0"
					aria-valuemax="100"
					aria-valuenow={ percent }
					aria-valuetext={ deviedAriaValue ? striptags( deviedAriaValue ) : undefined }
				>
					<div className={ barClassNames }>
						{ attributes.showText && (
							<>
								<Typography.Content
									tagName="span"
									className={ classnames( [ textClassNames, 'stk-progress-bar__text' ] ) }
									value={ attributes.text }
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
			</div>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
