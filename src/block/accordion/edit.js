/**
 * Internal dependencies
 */
import BlockStyles from './style'

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
} from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
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
import { useAttributeEditHandlers, useBlockContext } from '~stackable/hooks'
import {
	withBlockAttributeContext, withBlockWrapper, withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * Internal dependencies
 */
import variations, { defaultIcon } from './variations'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'
import { useSelect } from '@wordpress/data'
import { useState, useEffect } from '@wordpress/element'
import { addFilter, applyFilters } from '@wordpress/hooks'

// Use the default template from the block variations.
const TEMPLATE = variations[ 0 ].innerBlocks

const Edit = props => {
	const {
		clientId,
		className,
	} = props

	useGeneratedCss( props.attributes )

	const [ isOpen, setIsOpen ] = useState( true )
	const { hasInnerBlocks } = useBlockContext()
	const [ hasInitClickHandler, setHasInitClickHandler ] = useState( false )

	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	// Opens or closes the accordion when the heading is clicked.
	useEffect( () => {
		if ( ! hasInitClickHandler ) {
			return
		}
		const headerEl = document.querySelector( `[data-block="${ clientId }"] [data-type="stackable/column"]` )
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
	}, [ clientId, isOpen, setIsOpen, hasInitClickHandler ] )

	// If the className changes (e.g. layout switch), we need to re-apply the
	// Accordion open/close click handler.
	useEffect( () => {
		if ( hasInitClickHandler ) {
			setHasInitClickHandler( false )
		}
	}, [ props.className ] )

	// When first adding an accordion, the inner blocks may not be rendered yet, wait for it.
	if ( ! hasInitClickHandler ) {
		const headerEl = document.querySelector( `[data-block="${ clientId }"] [data-type="stackable/column"]` )
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

	return (
		<>

			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-accordion" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

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
						className="ugb--help-tip-accordion-adjacent-open"
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<InspectorStyleControls>
				<InspectorBottomTip />
			</InspectorStyleControls>

			<BlockStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-accordion" />

			<BlockDiv className={ blockClassNames } renderHtmlTag={ false } enableVariationPicker={ true }>
				<InnerBlocks
					template={ TEMPLATE }
					templateLock="insert"
				/>
			</BlockDiv>
			{ hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

export default compose(
	withBlockWrapper,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )

// Add another icon picker to the Icon block for picking the icon for the opened accordion.
addFilter( 'stackable.block-component.icon.after', 'stackable/blockquote', output => {
	const { parentTree } = useBlockContext()
	const { getBlock } = useSelect( 'core/block-editor' )
	const { getActiveBlockVariation } = useSelect( 'core/blocks' )
	const { getAttribute, updateAttributeHandler } = useAttributeEditHandlers()

	const accordionBlock = parentTree.find( pt => pt.name === 'stackable/accordion' )
	const accordionBlockDetails = getBlock( accordionBlock?.clientId )

	if ( accordionBlockDetails ) {
		const activeVariation = getActiveBlockVariation( accordionBlockDetails.name, accordionBlockDetails.attributes )
		const defaultValue = activeVariation.name === 'plus' ? applyFilters( 'stackable.block-component.plus.icon-close' ) : undefined
		return (
			<>
				{ output }
				<IconControl
					label={ __( 'Open Icon', i18n ) }
					value={ getAttribute( 'icon2' ) }
					defaultValue={ defaultValue }
					onChange={ updateAttributeHandler( 'icon2' ) }
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
	const { parentTree } = useBlockContext()
	const { getBlock } = useSelect( 'core/block-editor' )
	const { getActiveBlockVariation } = useSelect( 'core/blocks' )

	const accordionBlock = parentTree.find( pt => pt.name === 'stackable/accordion' )
	const accordionBlockDetails = getBlock( accordionBlock?.clientId )

	if ( accordionBlockDetails ) {
		const activeVariation = getActiveBlockVariation( accordionBlockDetails.name, accordionBlockDetails.attributes )
		return ( activeVariation.name === 'plus' )
			? applyFilters( 'stackable.block-component.plus.icon-open' ) : defaultIcon
	}
	return starIcon
} )
