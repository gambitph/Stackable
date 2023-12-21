/**
 * Internal dependencies
 */
import { TextStyles } from './style'
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
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import { InspectorTabs } from '~stackable/components'
import {
	withBlockAttributeContext,
	withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks'
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'
import { useEffect } from '@wordpress/element'
import { getUseSvgDef } from '../icon-list-new/util'
import { useBlockContext } from '~stackable/hooks'

const Edit = props => {
	const {
		attributes,
		clientId,
		isSelected,
		onRemove,
		mergeBlocks,
		onReplace,
		context,
		className,
		setAttributes,
	} = props

	useGeneratedCss( props.attributes )

	const { icon } = attributes
	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const { 'stackable/ordered': ordered, 'stackable/uniqueId': parentUniqueId } = context

	const { hasInnerBlocks } = useBlockContext()

	useEffect( () => {
		setAttributes( { ordered } )
	}, [ ordered ] )

	useEffect( () => {
		setAttributes( { parentUniqueId } )
	}, [ parentUniqueId ] )

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

	const _onRemove = () => {
		// TODO: remove block then transfer content to previous block
		onRemove( clientId )
	}

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
				{ ! ordered && icon && ! hasInnerBlocks &&
					<Icon value={ icon } /> }
				{ ! ordered && ! icon && ! hasInnerBlocks &&
					<Icon
						value={ getUseSvgDef( `#stk-icon-list__icon-svg-def-${ parentUniqueId }` ) } /> }
				{ /* TODO: change to allow icon list as inner blocks */ }
				{ ! hasInnerBlocks && <Typography
					ref={ ref }
					tagName="span"
					className={ textClassNames }
					onSplit={ onSplit }
					onRemove={ _onRemove }
					onMerge={ mergeBlocks }
					onReplace={ onReplace }
				/> }
				{ innerBlocksProps.children }
			</BlockDiv>
		</>
	)
}

export default compose(
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
