/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import {
	 BlockDiv,
	 CustomCSS,
	 getRowClasses,
	 getAlignmentClasses,
	 getResponsiveClasses,
	 getContentAlignmentClasses,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { applyFilters } from '@wordpress/hooks'

export const Save = props => {
	 const {
		 attributes,
	 } = props

	 const rowClass = getRowClasses( props.attributes )
	 const blockAlignmentClass = getAlignmentClasses( props.attributes )
	 const responsiveClass = getResponsiveClasses( props.attributes )

	 const blockClassName = classnames( [
		 props.className,
		 'stk-block-horizontal-scroller',
		 responsiveClass,
	 ] )

	 const contentClassNames = classnames( applyFilters( 'stackable.horizontal-scroller.save.contentClassNames', [
		 [
			rowClass,
			 'stk-inner-blocks',
			 blockAlignmentClass,
			 'stk-block-content',
		 ],
		 getContentAlignmentClasses( props.attributes, 'horizontal-scroller' ),
	 ], props ), {
		'stk--with-scrollbar': attributes.showScrollbar,
	 } )

	 return (
		 <BlockDiv.Content
			 className={ blockClassName }
			 attributes={ attributes }
			 version={ props.version }
		 >
			 { attributes.generatedCss && <style>{ attributes.generatedCss }</style> }
			 <CustomCSS.Content attributes={ attributes } />
			<div className={ contentClassNames }>
				<InnerBlocks.Content />
			</div>
		 </BlockDiv.Content>
	 )
}

export default withVersion( VERSION )( Save )
