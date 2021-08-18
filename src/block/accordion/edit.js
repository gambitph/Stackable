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
} from '~stackable/block-components'
import {
	useAttributeEditHandlers, useBlockHoverClass,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { InnerBlocks, useBlockEditContext } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { useSelect } from '@wordpress/data'
import { useState, useEffect } from '@wordpress/element'
import { addFilter } from '@wordpress/hooks'

const defaultIcon = '<svg data-prefix="fas" data-icon="chevron-down" class="svg-inline--fa fa-chevron-down fa-w-14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>'

const TEMPLATE = [
	[ 'stackable/column', {
		templateLock: 'insert', hasContainer: true, htmlTag: 'summary',
		className: 'stk--container-small stk-block-accordion__heading',
	}, [
		[ 'stackable/icon-label', {}, [
			[ 'stackable/heading', {
				text: __( 'Accordion Title' ), hasP: true, textTag: 'h4',
			} ],
			[ 'stackable/icon', {
				icon: defaultIcon,
			} ],
		] ],
	] ],
	[ 'stackable/column', { templateLock: false, className: 'stk-block-accordion__content' }, [
		[ 'stackable/text', {
			text: 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.',
		} ],
	] ],
]

const Edit = props => {
	const {
		clientId,
		className,
	} = props

	const [ isOpen, setIsOpen ] = useState( true )

	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockHoverClass = useBlockHoverClass()

	// Opens or closes the accordion when the heading is clicked.
	useEffect( () => {
		const headerEl = document.querySelector( `[data-block="${ clientId }"] [data-type="stackable/column"]` )
		const onClick = ev => {
			// Dom't open the accordion if the user is clicking on the icon.
			if ( ! ev.target.closest( '[data-type="stackable/icon"]' ) ) {
				setIsOpen( ! isOpen )
			}
		}
		headerEl.addEventListener( 'click', onClick )
		return () => {
			headerEl.removeEventListener( 'click', onClick )
		}
	}, [ clientId, isOpen, setIsOpen ] )

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

			<BlockDiv className={ blockClassNames } renderHtmlTag={ false }>
				<InnerBlocks
					template={ TEMPLATE }
					templateLock="insert"
				/>
			</BlockDiv>
			<MarginBottom />
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
