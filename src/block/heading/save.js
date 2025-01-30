/**
 * External dependencies
 */
import {
	BlockDiv,
	CustomCSS,
	Typography,
	getResponsiveClasses,
	getTypographyClasses,
	getAlignmentClasses,
} from '~stackable/block-components'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { applyFilters } from '@wordpress/hooks'

export const Save = props => {
	const {
		className,
		attributes,
	} = props

	const responsiveClass = getResponsiveClasses( props.attributes )
	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( applyFilters( 'stackable.heading.save.blockClassNames', [
		className,
		'stk-block-heading',
		responsiveClass,
		'stk-block-heading--v2',
	], props ) )

	const textClassNames = classnames( [
		'stk-block-heading__text',
		textClasses,
		blockAlignmentClass,
	], {
		'stk-block-heading--use-theme-margins': attributes.useThemeTextMargins,
	} )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			version={ props.version }
		>
			{ attributes.generatedCss && <style>{ attributes.generatedCss }</style> }
			<CustomCSS.Content attributes={ attributes } />
			{ props.attributes.showTopLine && <div className="stk-block-heading__top-line" /> }
			<Typography.Content
				attributes={ attributes }
				className={ textClassNames }
				defaultTag="h2"
			/>
			{ props.attributes.showBottomLine && <div className="stk-block-heading__bottom-line" /> }
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
