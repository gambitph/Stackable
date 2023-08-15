/**
 * Internal dependencies
 */
import { GlobalColorStyles } from './colors'
import { GlobalTypographyStyles } from './typography'
import './block-defaults'

/**
 * External dependencies
 */
import { SVGStackableIcon } from '~stackable/icons'
import { i18n, isContentOnlyMode } from 'stackable'
import { useDeviceType } from '~stackable/hooks'

/** WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins'
import { render, useEffect } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { applyFilters, addAction } from '@wordpress/hooks'
import {
	dispatch, select, useSelect,
} from '@wordpress/data'
import domReady from '@wordpress/dom-ready'

// Action used to toggle the global settings panel.
addAction( 'stackable.global-settings.toggle-sidebar', 'toggle', () => {
	const stackableSidebar = 'stackable-global-settings/sidebar'
	const currentlyOpenedSidebar = select( 'core/edit-post' ).getActiveGeneralSidebarName()

	if ( currentlyOpenedSidebar === stackableSidebar ) {
		dispatch( 'core/edit-post' ).closeGeneralSidebar( stackableSidebar )
	} else {
		dispatch( 'core/edit-post' ).openGeneralSidebar( stackableSidebar )
	}
} )

const GlobalSettings = () => {
	const deviceType = useDeviceType()
	const editorDom = useSelect( select => {
		return select( 'stackable/editor-dom' ).getEditorDom()
	} )

	/**
	 * Render the global colors and typography in Gutenberg
	 *
	 * WordPress 5.8 introduces block templates.
	 * When editing blocks inside a template window, the editor is mounted inside
	 * an `iframe` DOMElement. For the styles to work, we need to mount the styles inside
	 * the iframe document.
	 *
	 * @since 2.17.2
	 */
	useEffect( () => {
		const editorBody = editorDom?.closest( 'body' )
		if ( editorBody ) {
			editorBody.appendChild( globalTypographyWrapper )
			editorBody.appendChild( globalColorWrapper )
		}
	}, [ deviceType, editorDom ] )

	// We need to to this for both, because one might be disabled. E.g. in
	// WooCommerce, editSite is loaded and stops the sidebar from showing up.
	const SideEditorPluginSidebar = window.wp.editSite?.PluginSidebar
	const PostEditorPluginSidebar = window.wp.editPost?.PluginSidebar

	return (
		<>
			{ SideEditorPluginSidebar &&
				<SideEditorPluginSidebar
					name="sidebar"
					title={ __( 'Stackable Settings', i18n ) }
					className="ugb-global-settings__inspector"
					icon={ <SVGStackableIcon /> } >
					{ applyFilters( 'stackable.global-settings.inspector', null ) }
				</SideEditorPluginSidebar>
			}
			{ PostEditorPluginSidebar &&
				<PostEditorPluginSidebar
					name="sidebar"
					title={ __( 'Stackable Settings', i18n ) }
					className="ugb-global-settings__inspector"
					icon={ <SVGStackableIcon /> } >
					{ applyFilters( 'stackable.global-settings.inspector', null ) }
				</PostEditorPluginSidebar>
			}
		</>
	)
}

if ( ! isContentOnlyMode ) {
	registerPlugin( 'stackable-global-settings', {
		render: GlobalSettings,
	} )
}

const globalTypographyWrapper = document?.createElement( 'style' )
const globalColorWrapper = document?.createElement( 'style' )

domReady( () => {
	document?.body?.appendChild( globalTypographyWrapper )
	document?.body?.appendChild( globalColorWrapper )
	render( <GlobalTypographyStyles />, globalTypographyWrapper )
	render( <GlobalColorStyles />, globalColorWrapper )
} )
