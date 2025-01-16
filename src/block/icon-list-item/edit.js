/**
 * Internal dependencies
 */
import blockStyles from './style'
import { getUseSvgDef } from '../icon-list/util'
import {
	convertToListItems,
	useEnter,
} from './util'

/**
 * External dependencies
 */
import {
	BlockDiv,
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
import { InspectorTabs, useBlockCssGenerator } from '~stackable/components'
import {
	withBlockAttributeContext,
	withQueryLoopContext,
	withBlockWrapperIsHovered,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { compose, createHigherOrderComponent } from '@wordpress/compose'
import { dispatch, useSelect } from '@wordpress/data'
import {
	useEffect, useRef, memo,
} from '@wordpress/element'

const TABS = [ 'style', 'advanced' ]

const Edit = props => {
	const {
		attributes,
		clientId,
		onReplace,
		mergeBlocks,
		context,
		className,
		setAttributes,
	} = props

	const { icon, text } = attributes
	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { parentBlock } = useSelect( select => {
		const { getBlockRootClientId, getBlock } = select( 'core/block-editor' )
		const parentClientId = getBlockRootClientId( clientId )
		return {
			parentBlock: getBlock( parentClientId ),
		}
	}, [ clientId ] )

	const {
		'stackable/ordered': ordered,
		'stackable/uniqueId': parentUniqueId,
	} = context

	const updateOrderedTimeout = useRef()
	const updateUniqueIdTimeout = useRef()

	// Set the attributes so they can be used in Save.
	useEffect( () => {
		clearTimeout( updateOrderedTimeout.current )
		if ( ordered !== props.attributes.ordered ) {
			updateOrderedTimeout.current = setTimeout( () => {
				dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
				setAttributes( { ordered } )
			}, 300 )
		}
	}, [ ordered ] )

	useEffect( () => {
		clearTimeout( updateUniqueIdTimeout.current )
		if ( parentUniqueId !== props.attributes.parentUniqueId ) {
			updateUniqueIdTimeout.current = setTimeout( () => {
				dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
				setAttributes( { parentUniqueId } )
			}, 300 )
		}
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

	const onMerge = forward => {
		mergeBlocks( forward )

		// Remove icon list item and icon list on backspace if there is no text and is the only item on the list.
		if ( ! forward &&
			 ! attributes.text &&
			 parentBlock.innerBlocks.length === 1 ) {
			dispatch( 'core/block-editor' ).removeBlocks( [ clientId, parentBlock.clientId ] )
		}
	}

	// Generate the CSS styles for the block.
	const blockCss = useBlockCssGenerator( {
		attributes: props.attributes,
		blockStyles,
		clientId: props.clientId,
		context: props.context,
		setAttributes: props.setAttributes,
		blockState: props.blockState,
		version: VERSION,
	} )

	return (
		<>
			<InspectorControls blockState={ props.blockState } />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
				blockTag="li"
				renderHtmlTag={ false }
				tabIndex={ -1 } // We need this since navigating up/down selects the wrapper.
			>
				{ blockCss && <style key="block-css">{ blockCss }</style> }

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
						onMerge={ onMerge }
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

const InspectorControls = memo( props => {
	return (
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
	)
} )

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
