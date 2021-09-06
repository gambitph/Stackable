/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n, version as VERSION } from 'stackable'
import {
	FourRangeControl,
	InspectorStyleControls,
	InspectorTabs,
	PanelAdvancedSettings,
} from '~stackable/components'
import {
	useBlockContext, useBlockHoverClass,
} from '~stackable/hooks'
import {
	withIsHovered,
} from '~stackable/higher-order'
import {
	Column,
	getColumnClasses,
	BlockDiv,
	getAlignmentClasses,
	Alignment,
	useAlignment,
	Advanced,
	CustomCSS,
	Responsive,
	Linking,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	BlockLink,
	ContainerDiv,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { InnerBlocks } from '@wordpress/block-editor'
import {
	Fragment, useCallback,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { useSelect } from '@wordpress/data'
import { applyFilters } from '@wordpress/hooks'

const TEMPLATE = []

const Edit = props => {
	const {
		hasInnerBlocks, isOnlyBlock,
	} = useBlockContext()

	const {
		className,
		isHovered,
	} = props

	const { blockOrientation } = useAlignment()
	const [ columnClass, columnWrapperClass ] = getColumnClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockHoverClass = useBlockHoverClass()

	const ALLOWED_INNER_BLOCKS = useSelect( select => {
		return applyFilters( 'stackable.block.column.allowed-inner-blocks', undefined, select )
	} )

	const blockClassNames = classnames( [
		className,
		'stk-block-column',
		columnClass,
		blockHoverClass,
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-inner-blocks',
		columnWrapperClass,
		blockAlignmentClass,
		'stk-column__content',
		`stk-${ props.attributes.uniqueId }-container`,
	] )

	const renderAppender = useCallback(
		() => hasInnerBlocks ? false : <InnerBlocks.ButtonBlockAppender />,
		[ hasInnerBlocks ]
	)

	return (
		<Fragment>

			<InspectorTabs />

			<Alignment.InspectorControls hasColumnAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<BlockLink.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-column" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<BlockStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-column" />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Column Spacing', i18n ) }
					id="column-spacing"
					initialOpen={ true }
				>
					<FourRangeControl
						label={ __( 'Spacing', i18n ) }
						attribute={ 'columnSpacing' }
						responsive="all"
						units={ [ 'px', 'em' ] }
						defaultLocked={ true }
						min={ [ 0, 0 ] }
						sliderMax={ [ 200, 30 ] }
						placeholder={ isOnlyBlock ? '0' : '12' }
						className="ugb--help-tip-advanced-block-paddings"
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>
			<ContainerDiv.InspectorControls sizeSelector=".stk-block-content" />

			<Column showHandle={ isHovered } context={ props.context }>
				<Linking show={ isHovered } />
				<BlockDiv className={ blockClassNames }>
					<ContainerDiv className={ contentClassNames }>
						<InnerBlocks
							allowedBlocks={ ALLOWED_INNER_BLOCKS }
							template={ TEMPLATE }
							templateLock={ props.attributes.templateLock || false }
							orientation={ blockOrientation }
							renderAppender={ renderAppender }
						/>
					</ContainerDiv>
				</BlockDiv>
			</Column>
		</Fragment>
	)
}

export default compose(
	withIsHovered,
)( Edit )
