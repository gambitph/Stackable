/**
 * Internal dependencies
 */
import { TextStyles } from './style'
import { getUseSvgDef } from '../icon-list/util'
import {
	convertToListItems,
	useOnSplit,
	useCopy,
	useEnter,
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
import { version as VERSION } from 'stackable'
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
import { useBlockProps } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { compose, useMergeRefs } from '@wordpress/compose'
import { dispatch } from '@wordpress/data'
import { useEffect, useRef } from '@wordpress/element'

const Edit = props => {
	const {
		attributes,
		clientId,
		isSelected,
		onReplace,
		mergeBlocks,
		context,
		className,
		setAttributes,
	} = props

	useGeneratedCss( props.attributes )

	const { icon, text } = attributes
	const textRef = useRef( text )
	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { parentBlock } = useBlockContext()

	const {
		'stackable/ordered': ordered,
		'stackable/uniqueId': parentUniqueId,
	} = context

	// Set the attributes so they can be used in Save.
	useEffect( () => {
		dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
		setAttributes( { ordered } )
	}, [ ordered ] )

	useEffect( () => {
		dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
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

	const useEnterRef = useEnter( textRef, clientId )
	const onSplit = useOnSplit( clientId, attributes )

	const { ref, ...blockProps } = useBlockProps( {
		ref: useCopy( clientId ),
		blockHoverClass: props.blockHoverClass,
		clientId: props.clientId,
		attributes: props.attributes,
		className: blockClassNames,
		blockTag: 'li',
		renderHtmlTag: false,
		tabIndex: '-1', // We need this since navigating up/down selects the wrapper.
	} )

	const onMerge = forward => {
		mergeBlocks( forward )

		// Remove icon list item and icon list on backspace if there is no text and is the only item on the list.
		if ( ! forward &&
			 ! attributes.text &&
			 parentBlock.innerBlocks.length === 1 ) {
			dispatch( 'core/block-editor' ).removeBlocks( [ clientId, parentBlock.clientId ] )
		}
	}

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
				{ ...blockProps }
			>
				<TextStyles
					version={ VERSION }
					blockState={ props.blockState }
					clientId={ clientId }
				/>
				<CustomCSS mainBlockClass="stk-block-icon-list-item" />
				<div className="stk-block-icon-list-item__content">
					{ ! ordered && icon &&
						<Icon value={ icon } openEvenIfUnselected={ true } /> }
					{ ! ordered && ! icon &&
						<Icon
							value={ getUseSvgDef( `#stk-icon-list__icon-svg-def-${ parentUniqueId }` ) }
							openEvenIfUnselected={ true } /> }
					<Typography
						ref={ useMergeRefs( [ ref, useEnterRef ] ) }
						realtimeOnChange={ text => textRef.current = text }
						tagName="span"
						className={ textClassNames }
						onSplit={ onSplit }
						onMerge={ onMerge }
						onReplace={ onReplace
							? ( blocks, ...args ) => {
								onReplace(
									convertToListItems( blocks ),
									...args
								)
							  }
							: undefined }
					/>
				</div>
			</BlockDiv>
		</>
	)
}

export default compose(
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
