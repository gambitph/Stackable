/**
 * Internal dependencies
 */
import blockStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION, i18n } from 'stackable'
import {
	AdvancedToggleControl,
	IconControl,
	InspectorBottomTip,
	InspectorStyleControls,
	InspectorTabs,
	PanelAdvancedSettings,
	InspectorAdvancedControls,
	useBlockCssGenerator,
} from '~stackable/components'
import {
	BlockDiv,
	getAlignmentClasses,
	Alignment,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	MarginBottom,
	Transform,
} from '~stackable/block-components'
import {
	useBlockAttributesContext, useBlockSetAttributesContext,
} from '~stackable/hooks'
import {
	withBlockAttributeContext, withBlockWrapperIsHovered, withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * Internal dependencies
 */
import variations, { defaultIcon } from './variations'

/**
 * WordPress dependencies
 */
import { InnerBlocks, useBlockEditContext } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'
import { useSelect } from '@wordpress/data'
import { useState, useEffect, memo } from '@wordpress/element'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { findLast } from 'lodash'

// Use the default template from the block variations.
const TEMPLATE = variations[ 0 ].innerBlocks

const Edit = props => {
	const {
		clientId,
		className,
	} = props

	const [ isOpen, setIsOpen ] = useState( props.attributes.startOpen )
	const { hasInnerBlocks } = useSelect( select => {
		const { getBlockOrder } = select( 'core/block-editor' )
		return {
			hasInnerBlocks: getBlockOrder( clientId ).length > 0,
		}
	}, [ clientId ] )
	const [ hasInitClickHandler, setHasInitClickHandler ] = useState( false )
	const { getEditorDom } = useSelect( 'stackable/editor-dom' )

	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	// Hacky fix: getEditorDom() always returns null in theme customizer, so we need to manually get its editor
	const isCustomizer = window?.location?.href && window.location.href.indexOf( 'customize.php' ) !== -1
	const isWidgets = window?.location?.href && window.location.href.indexOf( 'widgets.php' ) !== -1
	const getDom = () => {
		return isCustomizer ? document?.querySelector( '#customize-controls' ) : ( isWidgets ? document?.querySelector( '.edit-widgets-main-block-list.block-editor-block-list__layout' ) : getEditorDom() )
	}
	// Opens or closes the accordion when the heading is clicked.
	useEffect( () => {
		if ( ! hasInitClickHandler ) {
			return
		}
		const headerEl = getDom()?.querySelector( `[data-block="${ clientId }"] [data-type="stackable/column"]` )
		const onClick = ev => {
			// Dom't open the accordion if the user is clicking on the icon.
			if ( ! ev.target.closest( '[data-type="stackable/icon"]' ) ) {
				setIsOpen( ! isOpen )
			}
		}
		headerEl?.addEventListener( 'click', onClick )
		return () => {
			headerEl?.removeEventListener( 'click', onClick )
		}
	}, [ clientId, isOpen, setIsOpen, hasInitClickHandler, getEditorDom ] )

	// If the className changes (e.g. layout switch), we need to re-apply the
	// Accordion open/close click handler.
	useEffect( () => {
		if ( hasInitClickHandler ) {
			setHasInitClickHandler( false )
		}
	}, [ props.className ] )

	// When first adding an accordion, the inner blocks may not be rendered yet, wait for it.
	if ( ! hasInitClickHandler ) {
		const headerEl = getDom()?.querySelector( `[data-block="${ clientId }"] [data-type="stackable/column"]` )
		if ( headerEl ) {
			setHasInitClickHandler( true )
		}
	}

	const blockClassNames = classnames( [
		className,
		'stk-block-accordion',
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	], {
		'stk--is-open': isOpen, // This opens the accordion in the editor.
	} )

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
			<InspectorControls />

			{ blockCss && <style key="block-css">{ blockCss }</style> }
			<CustomCSS mainBlockClass="stk-block-accordion" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
				renderHtmlTag={ false }
				enableVariationPicker={ true }
			>
				<InnerBlocks
					template={ TEMPLATE }
					templateLock="insert"
				/>
			</BlockDiv>
			{ props.isHovered && hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

const InspectorControls = memo( () => {
	return (
		<>
			<InspectorTabs />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					id="general"
					initialOpen={ true }
				>
					<AdvancedToggleControl
						label={ __( 'Open at the start', i18n ) }
						attribute="startOpen"
					/>
					<AdvancedToggleControl
						label={ __( 'Close adjacent on open', i18n ) }
						attribute="onlyOnePanelOpen"
						helpTooltip={ {
							video: 'accordion-adjacent-open',
							title: __( 'Close adjacent on open', i18n ),
							description: __( 'Automatically closes adjacent accordion panels when clicked.', i18n ),
						} }
					/>
					<AdvancedToggleControl
						label={ __( 'Enable FAQ Schema', i18n ) }
						attribute="enableFAQ"
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls backgroundMediaAllowVideo={ false } />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-accordion" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<InspectorStyleControls>
				<InspectorBottomTip />
			</InspectorStyleControls>
		</>
	)
} )

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )

// Add another icon picker to the Icon block for picking the icon for the opened accordion.
addFilter( 'stackable.block-component.icon.after', 'stackable/blockquote', output => {
	const icon2 = useBlockAttributesContext( attributes => attributes.icon2 )
	const setAttributes = useBlockSetAttributesContext()

	const { clientId } = useBlockEditContext()
	const { parentTree, getBlock } = useSelect( select => {
		const { getBlock, getBlockParents } = select( 'core/block-editor' )
		const parentTree = getBlockParents( clientId ).map( parentClientId => ( { clientId: parentClientId, name: getBlock( parentClientId ).name } ) )
		return {
			getBlock,
			parentTree,
		}
	}, [ clientId ] )
	const { getActiveBlockVariation } = useSelect( 'core/blocks' )

	const accordionBlock = findLast( parentTree, pt => pt.name === 'stackable/accordion' )
	const accordionBlockDetails = getBlock( accordionBlock?.clientId )

	const columnBlock = findLast( parentTree, pt => pt.name === 'stackable/column' )
	const iconLabelBlock = findLast( parentTree, pt => pt.name === 'stackable/icon-label' )

	// an accordion icon must have accordion (0), column (1) and icon-label (2) as parent blocks (indicated by array index)
	// also parent column block (1) of an accordion icon must match with the first accordion block's innerblocks[0].clientId
	// as it should be the same block
	const isAccordionIcon = iconLabelBlock && accordionBlockDetails?.innerBlocks[ 0 ].clientId === columnBlock?.clientId

	if ( isAccordionIcon && accordionBlockDetails ) {
		const activeVariation = getActiveBlockVariation( accordionBlockDetails.name, accordionBlockDetails.attributes )
		const defaultValue = activeVariation?.name === 'plus' ? applyFilters( 'stackable.block-component.plus.icon-close' ) : undefined
		return (
			<>
				{ output }
				<IconControl
					label={ __( 'Open Icon', i18n ) }
					value={ icon2 }
					defaultValue={ defaultValue }
					onChange={ icon2 => setAttributes( { icon2 } ) }
					help={ __( 'The open icon will appear when the accordion is opened', i18n ) }
				/>
			</>
		)
	}
	return output
} )

// Prevent the icon label from being being styled with a saved default style.
addFilter( 'stackable.block-default-styles.use-saved-style', 'stackable/icon-label', ( enabled, block, parentBlockNames ) => {
	if ( block.name === 'stackable/icon-label' && parentBlockNames.length >= 2 && parentBlockNames[ parentBlockNames.length - 2 ] === 'stackable/accordion' ) {
		return false
	}
	return enabled
} )

// Return default icon for accordion
addFilter( 'stackable.block-component.icon.default', 'stackable/accordion', starIcon => {
	const { clientId } = useBlockEditContext()
	const { parentTree, getBlock } = useSelect( select => {
		const { getBlock, getBlockParents } = select( 'core/block-editor' )
		const parentTree = getBlockParents( clientId ).map( parentClientId => ( { clientId: parentClientId, name: getBlock( parentClientId ).name } ) )
		return {
			getBlock,
			parentTree,
		}
	}, [ clientId ] )
	const { getActiveBlockVariation } = useSelect( 'core/blocks' )

	const accordionBlock = findLast( parentTree, pt => pt.name === 'stackable/accordion' )
	const accordionBlockDetails = getBlock( accordionBlock?.clientId )

	const columnBlock = findLast( parentTree, pt => pt.name === 'stackable/column' )
	const iconLabelBlock = findLast( parentTree, pt => pt.name === 'stackable/icon-label' )

	// an accordion icon must have accordion (0), column (1) and icon-label (2) as parent blocks (indicated by array index)
	// also parent column block (1) of an accordion icon must match with the first accordion block's innerblocks[0].clientId
	// as it should be the same block
	const isAccordionIcon = iconLabelBlock && accordionBlockDetails?.innerBlocks[ 0 ].clientId === columnBlock?.clientId

	if ( isAccordionIcon && accordionBlockDetails ) {
		const activeVariation = getActiveBlockVariation( accordionBlockDetails.name, accordionBlockDetails.attributes )
		return ( activeVariation?.name === 'plus' )
			? applyFilters( 'stackable.block-component.plus.icon-open' ) : defaultIcon
	}
	return starIcon
} )
