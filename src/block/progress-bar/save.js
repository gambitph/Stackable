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

	// Check if progressValue is an int/float/empty, if NaN, assume its dynamic content
	let progressValue = attributes.progressValue
	if ( attributes.progressValue === '' ) {
		progressValue = DEFAULT_PROGRESS
	} else if ( attributes.progressValue?.match( /^[\d.]+$/ ) ) {
		progressValue = parseFloat( progressValue )
	}

	const derivedValue = `${ attributes.progressValuePrefix }${ progressValue }${ attributes.progressValueSuffix }`.trim()
	const derivedAriaValue = attributes.showText ? attributes.progressAriaValueText || attributes.text : undefined

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
					aria-valuetext={ derivedAriaValue ? striptags( derivedAriaValue ) : undefined }
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
									className={ classnames( [ textClassNames, 'stk-progress-bar__progress-value-text' ] ) }
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
