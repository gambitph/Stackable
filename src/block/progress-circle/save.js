import { DEFAULT_PROGRESS } from './schema'

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

export const Save = props => {
	const { className, attributes } = props
	const responsiveClass = getResponsiveClasses( attributes )
	const blockAlignmentClass = getAlignmentClasses( attributes )
	const textClasses = getTypographyClasses( attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-progress-circle',
		responsiveClass,
	] )

	const containerClassNames = classnames( [
		className,
		'stk-block-progress-circle__container',
		blockAlignmentClass,
	] )

	const textClassNames = classnames( [
		'stk-progress-circle__inner-text',
		textClasses,
	] )

	const divClassNames = classnames( [
		'stk-progress-circle',
		{
			'stk--with-animation': attributes.progressAnimate,
		},
	] )

	// Check if progressValue is an int/float/empty, if NaN, assume its dynamic content
	let progressValue = attributes.progressValue
	if ( attributes.progressValue === '' ) {
		progressValue = DEFAULT_PROGRESS
	} else if ( attributes.progressValue?.match( /^[\d.]+$/ ) ) {
		progressValue = parseFloat( progressValue )
	}

	const label = `${ attributes.progressValuePrefix }${ progressValue }${ attributes.progressValueSuffix }`.trim()

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			version={ props.version }
		>
			{ attributes.generatedCss && <style>{ attributes.generatedCss }</style> }
			<CustomCSS.Content attributes={ attributes } />
			<div className={ containerClassNames }>
				<div
					className={ divClassNames }
					role="progressbar"
					aria-valuemin="0"
					aria-valuemax="100"
					aria-valuenow={ progressValue }
					aria-valuetext={ attributes.progressAriaValueText ? striptags( attributes.progressAriaValueText ) : undefined }
				>
					<svg>
						{ attributes.progressColorType === 'gradient' && (
							<defs>
								<linearGradient
									id={ `gradient-${ attributes.uniqueId }` }
									gradientTransform={ attributes.progressColorGradientDirection ? `rotate(${ attributes.progressColorGradientDirection })` : undefined }
								>
									<stop offset="0%" stopColor={ attributes.progressColor1 } />
									<stop offset="100%" stopColor={ attributes.progressColor2 } />
								</linearGradient>
							</defs>
						) }
						<circle className="stk-progress-circle__background"></circle>
						<circle className="stk-progress-circle__bar"></circle>
					</svg>
					{ attributes.showText && (
						<div className="stk-number">
							<Typography.Content
								tagName="span"
								className={ textClassNames }
								value={ label }
							/>
						</div>
					) }
				</div>
			</div>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
