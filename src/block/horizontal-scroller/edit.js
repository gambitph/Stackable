/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import {
	 ColumnInnerBlocks,
	 GroupPlaceholder,
	 InspectorTabs,
} from '~stackable/components'

import {
	 BlockDiv,
	 useGeneratedCss,
	 MarginBottom,
	 Alignment,
	 getAlignmentClasses,
	 Advanced,
	 CustomCSS,
	 Responsive,
	 CustomAttributes,
	 EffectsAnimations,
	 ConditionalDisplay,
	 Transform,
	 getContentAlignmentClasses,
	 HorizontalScroller,
	 Scrollbar,
} from '~stackable/block-components'
import { useBlockContext } from '~stackable/hooks'
import {
	 withBlockAttributeContext,
	 withBlockWrapperIsHovered,
	 withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'

const ALLOWED_INNER_BLOCKS = [ 'stackable/column' ]
const TEMPLATE = [
	[ 'stackable/column' ],
	[ 'stackable/column' ],
	[ 'stackable/column' ],
]

const Edit = props => {
	 const {
		 className,
		 clientId,
		 isSelected,
	 } = props

	 useGeneratedCss( props.attributes )

	 const blockAlignmentClass = getAlignmentClasses( props.attributes )
	 const { hasInnerBlocks } = useBlockContext()
	 const [ columnProviderValue, columnTooltipClass ] = ColumnInnerBlocks.useContext()

	 const blockClassNames = classnames( [
		 className,
		 'stk-block-horizontal-scroller editor',
		 columnTooltipClass,
	 ] )

	 const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	 ], getContentAlignmentClasses( props.attributes, 'horizontal-scroller' ), {
		'stk--with-scrollbar': props.attributes.showScrollbar,
	 } )

	 return (
		 <>
			 { isSelected && (
				 <>
					 <InspectorTabs />
					 <Alignment.InspectorControls hasRowAlignment={ true } />
					 <BlockDiv.InspectorControls />
					 <Advanced.InspectorControls />
					 <Transform.InspectorControls />
					 <EffectsAnimations.InspectorControls />
					 <CustomAttributes.InspectorControls />
					 <CustomCSS.InspectorControls mainBlockClass="stk-block-horizontal-scroller" />
					 <Responsive.InspectorControls />
					 <ConditionalDisplay.InspectorControls />
					 <HorizontalScroller.InspectorControls />
					 <Scrollbar.InspectorControls />
				 </>
			 ) }

			 <BlockDiv
				 blockHoverClass={ props.blockHoverClass }
				 clientId={ props.clientId }
				 attributes={ props.attributes }
				 className={ blockClassNames }
			 >
				 <BlockStyles
					 version={ VERSION }
					 blockState={ props.blockState }
					 clientId={ clientId }
				 />
				 <CustomCSS mainBlockClass="stk-block-horizontal-scroller" />

				 { ! hasInnerBlocks && <GroupPlaceholder /> }
				<div
					className={ contentClassNames }
					data-align={ ! props.attributes.contentAlign ? undefined // Only needed in the backend
							 : props.attributes.contentAlign === 'alignwide' ? 'wide'
								 : props.attributes.contentAlign === 'alignfull' ? 'full' : undefined }
				>
					<ColumnInnerBlocks
						providerValue={ columnProviderValue }
						orientation="horizontal"
						renderAppender={ false }
						template={ props.attributes.templateLock ? undefined : TEMPLATE }
						allowedBlocks={ ALLOWED_INNER_BLOCKS }
						templateLock={ props.attributes.templateLock || false }
					/>
				</div>
			 </BlockDiv>
			 { props.isHovered && hasInnerBlocks && <MarginBottom /> }
		 </>
	 )
}

export default compose(
	 withBlockWrapperIsHovered,
	 withQueryLoopContext,
	 withBlockAttributeContext,
)( Edit )
