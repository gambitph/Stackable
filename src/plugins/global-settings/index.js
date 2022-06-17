/**
 * Internal dependencies
 */
import { GlobalColorStyles } from './colors'
import { GlobalTypographyStyles } from './typography'
import { DesignSystem } from './design-system'
import './block-defaults'
import { SVGStackableIcon } from '~stackable/icons'
import { useEditorFrame } from '~stackable/hooks'

/**
 * External dependencies
 */
import { i18n, isContentOnlyMode } from 'stackable'

/** WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins'
import domReady from '@wordpress/dom-ready'
import { render } from '@wordpress/element'
// TODO: @wordpress/edit-post isn't loaded in the Widget Editor. In the future,
// Gutenberg will add a @wordpress/edit-site, so we can use that instead when it
// arrives.
// @see https://github.com/WordPress/gutenberg/pull/34460
// import { PluginSidebar } from '@wordpress/edit-post'
import { __ } from '@wordpress/i18n'
import { applyFilters, addAction } from '@wordpress/hooks'
import { dispatch, select } from '@wordpress/data'

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
	// Attach the styles we need for the global settings.
	useEditorFrame( editorFrame => {
		editorFrame.body.appendChild( globalTypographyWrapperDiv )
		editorFrame.body.appendChild( globalColorWrapperDiv )
		editorFrame.body.appendChild( designSystemDiv )
	} )

	// TODO: PluginSidebar doesn't work in the Widget Editor since
	// @wordpress/edit-post isn't loaded in there. In the future, Gutenberg will
	// add a @wordpress/edit-site that will have a PluginSidebar, so we can use
	// that instead when it arrives.
	// @see https://github.com/WordPress/gutenberg/pull/34460
	// This is a workaround to make PluginSidebar work without @wordpress/edit-post.
	if ( ! window.wp.editPost?.PluginSidebar ) {
		return null
	}
	const PluginSidebar = window.wp.editPost.PluginSidebar

	return (
		<>
			<PluginSidebar
				name="sidebar"
				title={ __( 'Stackable Settings', i18n ) }
				className="ugb-global-settings__inspector"
				icon={ <SVGStackableIcon /> } >
				{ applyFilters( 'stackable.global-settings.inspector', null ) }
			</PluginSidebar>
		</> )
}

if ( ! isContentOnlyMode ) {
	registerPlugin( 'stackable-global-settings', {
		render: GlobalSettings,
	} )
}

// These tags will hold all our global styles in the editor.
const globalTypographyWrapperDiv = document.createElement( 'style' )
const globalColorWrapperDiv = document.createElement( 'style' )
const designSystemDiv = document.createElement( 'style' )

// Initialize rendering our global styles.
domReady( () => {
	designSystemDiv.setAttribute( 'id', 'stk-design-system' )
	globalTypographyWrapperDiv.setAttribute( 'id', 'stk-global-typography' )

	render( <GlobalTypographyStyles />, globalTypographyWrapperDiv )
	render( <GlobalColorStyles />, globalColorWrapperDiv )
	render( <DesignSystem />, designSystemDiv )
} )
