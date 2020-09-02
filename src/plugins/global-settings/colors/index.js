import './responsive-color-palette-change'

/**
 * Internal dependencies
 */
import { GlobalSettingsColorPicker } from '../components'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { PanelAdvancedSettings } from '~stackable/components'
import { isEqual } from 'lodash'

/**
 * Wordpress dependencies
 */
import {
	addFilter, addAction, doAction,
} from '@wordpress/hooks'
import {
	Fragment, useState, useEffect,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import domReady from '@wordpress/dom-ready'
import { loadPromise, models } from '@wordpress/api'
import {
	dispatch, useSelect, select,
} from '@wordpress/data'

addFilter( 'stackable.global-settings.inspector', 'global-settings/global-colors', output => {
	const [ isPanelOpen, setIsPanelOpen ] = useState( false )
	const [ showReset, setShowReset ] = useState( false )

	// We make sure that we are getting the latest state for default colors.
	const { defaultColors } = useSelect( select => select( 'core/block-editor' ).getSettings() )

	const handleToggle = () => {
		setIsPanelOpen( toggle => ! toggle )
	}

	// Show reset button if necessary.
	useEffect( () => {
		if ( ! showReset ) {
			const { colors } = select( 'core/block-editor' ).getSettings()
			if ( defaultColors && ! isEqual( defaultColors, colors ) ) {
				setShowReset( true )
			}
		}
	}, [ defaultColors ] )

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Global Color Palette', i18n ) }
				initialOpen={ false }
				opened={ isPanelOpen }
				onToggle={ handleToggle }
			>
				<p className="components-base-control__help">
					{ __( 'Change your color palette for all your blocks across your site.', i18n ) }
					&nbsp;
					<a href="https://docs.wpstackable.com/stackable-guides/advanced-guides/how-to-use-global-colors/?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
						{ __( 'Learn more about Global Colors', i18n ) }
					</a>
				</p>
				<GlobalSettingsColorPicker
					showReset={ showReset }
					setShowReset={ setShowReset }
				/>
			</PanelAdvancedSettings>
		</Fragment>
	)
} )

domReady( () => {
	// Mount a style in the document
	const globalStyleEl = document.createElement( 'style' )
	globalStyleEl.setAttribute( 'id', 'stackable-global-colors' )
	const editorEl = document.querySelector( '.edit-post-visual-editor' )
	if ( editorEl ) {
		editorEl.insertBefore( globalStyleEl, editorEl.firstChild )
	}

	// Update the global style values
	addAction( 'stackable.global-settings.global-styles', 'update', ( colors = [] ) => {
		const styleRules = colors.map( color => {
			if ( color.colorVar && color.fallback ) {
				return `${ color.colorVar }: ${ color.fallback };`
			}

			return ''
		} )

		const globalStyleEl = document.querySelector( '#stackable-global-colors' )
		if ( globalStyleEl ) {
			// Overwrite all the global styles inside this style tag.
			globalStyleEl.innerHTML = `:root { ${ styleRules.join( ' ' ) } }`
		}
	} )

	loadPromise.then( () => {
		const settings = new models.Settings()

		settings.fetch().then( response => {
			const { stackable_global_colors: globalColors } = response
			const { colors } = select( 'core/block-editor' ).getSettings()

			if ( Array.isArray( globalColors ) ) {
				if ( globalColors.length === 0 ) {
					// Get the initial editor colors on load.
					dispatch( 'core/block-editor' ).updateSettings( {
						defaultColors: colors,
					} )
				} else {
					// Fetch stackable global settings and dispatch to the curent colors
					loadPromise.then( () => {
						const settings = new models.Settings()
						settings.fetch().then( response => {
							// Dispatch the global colors to the current colors
							dispatch( 'core/block-editor' ).updateSettings( {
								colors: response.stackable_global_colors,
								defaultColors: colors,
							} )
						} )

						doAction( 'stackable.global-settings.global-styles', globalColors )
					} )
				}
			} else {
				// Get the initial editor colors on load.
				dispatch( 'core/block-editor' ).updateSettings( {
					defaultColors: colors,
				} )
			}
		} )
	} )
} )
