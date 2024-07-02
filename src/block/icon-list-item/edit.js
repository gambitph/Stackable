/**
 * Internal dependencies
 */
import { TextStyles } from './style'
import { getUseSvgDef } from '../icon-list/util'
import {
	convertToListItems,
	useOnSplit,
	useOnPaste,
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
	withBlockWrapperIsHovered,
} from '~stackable/higher-order'
import { useBlockContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { compose, createHigherOrderComponent } from '@wordpress/compose'
import { dispatch } from '@wordpress/data'
import { useEffect } from '@wordpress/element'

const TABS = [ 'style', 'advanced' ]

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

	const useEnterRef = useEnter( text, clientId )
	const onSplit = useOnSplit( clientId, attributes )
	const onPaste = useOnPaste( clientId, parentBlock?.clientId, attributes, setAttributes )

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
					<InspectorTabs tabs={ TABS } hasLayoutPanel={ false } />

					<Typography.InspectorControls
						{ ...props }
						hasTextTag={ false }
						initialOpen={ true }
						hasTextShadow={ true }
					/>
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
				tabIndex={ -1 } // We need this since navigating up/down selects the wrapper.
			>
				<TextStyles
					version={ VERSION }
					blockState={ props.blockState }
					clientId={ clientId }
				/>
				<CustomCSS mainBlockClass="stk-block-icon-list-item" />
				<div className="stk-block-icon-list-item__content">
					{ ! ordered && icon &&
						<Icon
							value={ icon }
							openEvenIfUnselected={ true }
							hasLinearGradient={ false }
						/> }
					{ ! ordered && ! icon &&
						<Icon
							value={ getUseSvgDef( `#stk-icon-list__icon-svg-def-${ parentUniqueId }` ) }
							openEvenIfUnselected={ true }
							hasLinearGradient={ false }
						/> }
					{ ordered &&
						// This will contain the numbers in ::before pseudo-element for ordered lists.
						// Placing the numbers here instead on li allows us to center the text vertically.
						<span className="stk-block-icon-list-item__marker"></span>
					 }
					<Typography
						ref={ useEnterRef }
						tagName="span"
						className={ textClassNames }
						onSplit={ onSplit }
						onMerge={ onMerge }
						onPaste={ onPaste }
						onReplace={ onReplace
							? ( blocks, ...args ) => {
								onReplace(
									convertToListItems( blocks ),
									...args
								)
							  }
							: undefined }
						enableDebounce={ false }
					/>
				</div>
			</BlockDiv>
		</>
	)
}

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )

/**
 * Add tabindex=-1 to the wrapper of the icon list item so that navigating
 * up/down will not select the wrapper.
 */
const withNegativeTabIndex = createHigherOrderComponent( BlockEdit => {
	return props => {
		if ( props.name !== 'stackable/icon-list-item' ) {
			return <BlockEdit { ...props } />
		}

		const wrapperProps = {
			...props.wrapperProps,
			tabIndex: -1,
		}
		return <BlockEdit { ...props } wrapperProps={ wrapperProps } />
	}
}, 'withNegativeTabIndex' )

wp.hooks.addFilter(
	'editor.BlockEdit',
	'stackable/with-icon-list-negative-tab-index',
	withNegativeTabIndex
)
