/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION, i18n } from 'stackable'
import { nth } from 'lodash'
import {
	AdvancedToggleControl, IconControl, InspectorStyleControls, InspectorTabs, PanelAdvancedSettings,
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
	useAttributeEditHandlers, useBlockHoverClass, useBlockContext,
} from '~stackable/hooks'

/**
 * Internal dependencies
 */
import variations from './variations'

/**
 * WordPress dependencies
 */
import { InnerBlocks, useBlockEditContext } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { useSelect } from '@wordpress/data'
import { useState, useEffect } from '@wordpress/element'
import { addFilter } from '@wordpress/hooks'

// Use the default template from the block variations.
const TEMPLATE = variations[ 0 ].innerBlocks

const Edit = props => {
	const {
		clientId,
		className,
	} = props

	const [ isOpen, setIsOpen ] = useState( true )
	const { hasInnerBlocks } = useBlockContext()
	const [ hasInitClickHandler, setHasInitClickHandler ] = useState( false )

	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockHoverClass = useBlockHoverClass()

	// Opens or closes the accordion when the heading is clicked.
	useEffect( () => {
		if ( ! hasInitClickHandler ) {
			return
		}
		const headerEl = document.querySelector( `[data-block="${ clientId }"] [data-type="stackable/column"]` )
		const onClick = ev => {
			// Dom't open the accordion if the user is clicking on the icon.
			console.log( 'clicked' )
			if ( ! ev.target.closest( '[data-type="stackable/icon"]' ) ) {
				setIsOpen( ! isOpen )
			}
		}
		headerEl.addEventListener( 'click', onClick )
		return () => {
			headerEl.removeEventListener( 'click', onClick )
		}
	}, [ clientId, isOpen, setIsOpen, hasInitClickHandler ] )

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
		blockHoverClass,
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	], {
		'stk--is-open': isOpen, // This opens the accordion in the editor.
	} )

	return (
		<>

			<InspectorTabs />

			<Alignment.InspectorControls hasRowAlignment={ true } />
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

export default Edit

// Add another icon picker to the Icon block for picking the icon for the opened accordion.
addFilter( 'stackable.block-component.icon.after', 'stackable/blockquote', output => {
	const { clientId } = useBlockEditContext()

	const {
		getAttribute,
		updateAttributeHandler,
	} = useAttributeEditHandlers()

	const isAccordionIcon = useSelect(
		select => {
			const { getBlock, getBlockParents } = select( 'core/block-editor' )
			const parents = getBlockParents( clientId )
			const iconLabelClientId = nth( parents, -1 )
			const columnClientId = nth( parents, -2 )
			const accordionClientId = nth( parents, -3 )
			if ( ! iconLabelClientId || ! columnClientId || ! accordionClientId ) {
				return false
			}
			if ( getBlock( iconLabelClientId ).name !== 'stackable/icon-label' ||
				getBlock( columnClientId ).name !== 'stackable/column' ||
				getBlock( accordionClientId ).name !== 'stackable/accordion' ) {
				return false
			}
			if ( getBlock( accordionClientId ).innerBlocks[ 0 ].clientId !== columnClientId ) {
				return false
			}
			return true
		},
		[ clientId ]
	)

	if ( isAccordionIcon ) {
		return (
			<>
				{ output }
				<IconControl
					label={ __( 'Open Icon', i18n ) }
					value={ getAttribute( 'icon2' ) }
					onChange={ updateAttributeHandler( 'icon2' ) }
					help={ __( 'The open icon will appear when the accordion is opened', i18n ) }
				/>
			</>
		)
	}
	return output
} )
