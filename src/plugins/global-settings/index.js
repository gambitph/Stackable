/**
 * Internal dependencies
 */
import { GlobalColorStyles } from './colors'
import { GlobalTypographyStyles } from './typography'

/**
 * External dependencies
 */
import { SVGStackableIcon } from '~stackable/icons'
import { i18n, isContentOnlyMode } from 'stackable'

/** WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins'
import {
	Fragment, render, unmountComponentAtNode, useEffect,
} from '@wordpress/element'
// TODO: @wordpress/edit-post isn't loaded in the Widget Editor. In the future,
// Gutenberg will add a @wordpress/edit-site, so we can use that instead when it
// arrives.
// @see https://github.com/WordPress/gutenberg/pull/34460
// import { PluginSidebar } from '@wordpress/edit-post'
import { __ } from '@wordpress/i18n'
import {
	applyFilters, addAction,
} from '@wordpress/hooks'
import {
	dispatch, select, useSelect,
} from '@wordpress/data'

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
	const isEditingTemplate = useSelect( select => select( 'core/edit-post' )?.isEditingTemplate?.() )

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
		const globalTypographyWrapperDiv = document.createElement( 'style' )
		const globalColorWrapperDiv = document.createElement( 'style' )

		const timeout = setTimeout( () => {
			const selector = isEditingTemplate
				? document.querySelector( 'iframe[name="editor-canvas"]' ).contentWindow.document.body
				: document.body

			selector.appendChild( globalTypographyWrapperDiv )
			render( <GlobalTypographyStyles />, globalTypographyWrapperDiv )

			selector.appendChild( globalColorWrapperDiv )
			render( <GlobalColorStyles />, globalColorWrapperDiv )
		}, 300 )

		return () => {
			clearTimeout( timeout )
			unmountComponentAtNode( globalTypographyWrapperDiv )
			unmountComponentAtNode( globalColorWrapperDiv )

			globalTypographyWrapperDiv.remove()
			globalColorWrapperDiv.remove()
		}
	}, [ isEditingTemplate ] )

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
		<Fragment>
			<PluginSidebar
				name="sidebar"
				title={ __( 'Stackable Settings', i18n ) }
				className="ugb-global-settings__inspector"
				icon={ <SVGStackableIcon /> } >
				{ applyFilters( 'stackable.global-settings.inspector', null ) }
			</PluginSidebar>
		</Fragment> )
}

if ( ! isContentOnlyMode ) {
	registerPlugin( 'stackable-global-settings', {
		render: GlobalSettings,
	} )
}
