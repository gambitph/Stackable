/**
 * External dependencies
 */
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	CustomCSS,
	getResponsiveClasses,
} from '~stackable/block-components'
import { Separator2 } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const Save = props => {
	const {
		className,
		attributes,
	} = props

	const {
		separatorDesign,
		separatorInverted,
	} = attributes

	const responsiveClass = getResponsiveClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-separator',
		responsiveClass,
		'stk--no-padding',
	] )

	const separatorClassNames = classnames( [
		'stk-block-separator__inner',
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			version={ props.version }
		>
			{ attributes.generatedCss && <style>{ attributes.generatedCss }</style> }
			<CustomCSS.Content attributes={ attributes } />
			<div className={ separatorClassNames }>
				<Separator2.Content
					design={ separatorDesign }
					inverted={ separatorInverted }
				/>
				{ applyFilters( 'stackable.block.separator.save.output.layers', null, props ) }
			</div>
		</BlockDiv.Content>
	)
}

export default withVersion( VERSION )( Save )
