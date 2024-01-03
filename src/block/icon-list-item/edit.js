/**
 * Internal dependencies
 */
import { TextStyles } from './style'
import { getUseSvgDef } from '../icon-list-new/util'
import {
	useOutdentListItem, useIndentListItem, useMerge,
} from './util'

/**
 * External dependencies
 */
import {
	BlockDiv,
	useGeneratedCss,
	CustomCSS,
	Responsive,
	Advanced,
	Typography,
	getTypographyClasses,
	getAlignmentClasses,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Transform,
	Icon,
} from '~stackable/block-components'
import { i18n, version as VERSION } from 'stackable'
import classnames from 'classnames'
import { InspectorTabs } from '~stackable/components'
import {
	withBlockAttributeContext,
	withQueryLoopContext,
} from '~stackable/higher-order'
import { useBlockContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks'
import {
	useBlockProps, useInnerBlocksProps, BlockControls,
} from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'
import { useEffect } from '@wordpress/element'
import { ToolbarGroup, ToolbarButton } from '@wordpress/components'

const Edit = props => {
	const {
		attributes,
		clientId,
		isSelected,
		onRemove,
		onReplace,
		context,
		className,
		setAttributes,
	} = props

	useGeneratedCss( props.attributes )

	const { icon } = attributes
	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const {
		'stackable/ordered': ordered, 'stackable/uniqueId': parentUniqueId, 'stackable/isIndented': isIndented,
	} = context

	const blockContext = useBlockContext()
	const { blockIndex } = blockContext

	useEffect( () => {
		setAttributes( { ordered } )
	}, [ ordered ] )

	useEffect( () => {
		setAttributes( { parentUniqueId } )
	}, [ parentUniqueId ] )

	const indentListItem = useIndentListItem( blockContext, clientId )
	const outdentListItem = useOutdentListItem( blockContext, clientId )

	const blockClassNames = classnames( [
		className,
		'stk-block-icon-list-item',
	] )

	const textClassNames = classnames( [
		'stk-block-icon-list-item__text',
		textClasses,
		blockAlignmentClass,
	] )

	const onSplit = ( value, isOriginal ) => {
		// TODO: update when block is split and has inner blocks
		let block

		if ( isOriginal || value ) {
			block = createBlock( 'stackable/icon-list-item', {
				...attributes,
				text: value,
			} )
		} else {
			block = createBlock( 'stackable/icon-list-item', {
				...attributes,
				text: '',
			} )
		}

		if ( isOriginal ) {
			block.clientId = clientId
		}

		return block
	}

	const onMerge = useMerge( blockContext, clientId, attributes.text )

	//TODO: move cursor to adjacent blocks without double press of arrow keys

	const blockProps = useBlockProps( {
		blockHoverClass: props.blockHoverClass,
		clientId: props.clientId,
		attributes: props.attributes,
		className: blockClassNames,
		blockTag: 'li',
		renderHtmlTag: false,
	} )

	const { ref, ...innerBlocksProps } = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ 'stackable/icon-list-new' ],
		renderAppender: false,
		__unstableDisableDropZone: true,
	} )

	return (
		<>
			{ isSelected && (
				<>
					<BlockControls>
						<ToolbarGroup>
							<ToolbarButton
								label={ __( 'Outdent', i18n ) }
								icon="editor-outdent"
								disabled={ ! isIndented }
								onClick={ outdentListItem }
							/>
							<ToolbarButton
								label={ __( 'Indent', i18n ) }
								icon="editor-indent"
								disabled={ blockIndex === 0 }
								onClick={ indentListItem }
							/>
						</ToolbarGroup>
					</BlockControls>

					<InspectorTabs hasLayoutPanel={ false } />

					<Typography.InspectorControls
						{ ...props }
						hasTextTag={ false }
						initialOpen={ true }
						hasTextShadow={ true }
					/>
					<BlockDiv.InspectorControls />
					<Advanced.InspectorControls />
					<Transform.InspectorControls />

					<EffectsAnimations.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-icon-list-item" />
					<Responsive.InspectorControls />
					<ConditionalDisplay.InspectorControls />
				</>
			) }
			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
				blockTag="li"
				renderHtmlTag={ false }
				{ ...innerBlocksProps }
			>
				<TextStyles
					version={ VERSION }
					blockState={ props.blockState }
					clientId={ clientId }
				/>
				<CustomCSS mainBlockClass="stk-block-icon-list-item" />
				{ /* TODO: Open icon search popover on click */ }
				<div className="stk-block-icon-list-item__content">
					{ ! ordered && icon &&
						<Icon value={ icon } /> }
					{ ! ordered && ! icon &&
						<Icon
							value={ getUseSvgDef( `#stk-icon-list__icon-svg-def-${ parentUniqueId }` ) } /> }
					<Typography
						ref={ ref }
						tagName="span"
						className={ textClassNames }
						onSplit={ onSplit }
						onRemove={ onRemove }
						onMerge={ onMerge }
						onReplace={ onReplace }
					/>
				</div>
				{ innerBlocksProps.children }
			</BlockDiv>
		</>
	)
}

export default compose(
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
