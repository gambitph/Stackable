/**
 * Internal dependencies
 */
import { GlobalSettingsPanel, GlobalSettingsColorPicker } from '../components'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import md5 from 'md5'

/**
 * Wordpress dependencies
 */
import {
	addFilter, addAction, doAction,
} from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import domReady from '@wordpress/dom-ready'
import { loadPromise, models } from '@wordpress/api'
import { dispatch, select } from '@wordpress/data'

addFilter( 'stackable.global-settings.inspector', 'global-settings/global-colors', output => {
	return (
		<Fragment>
			{ output }
			<GlobalSettingsPanel
				title={ __( 'Global Color Palette', i18n ) }
			>
				<p className="components-base-control__help">
					{ __( 'Change your color palette for all your blocks across your site.', i18n ) }
					&nbsp;
					<a href="https://docs.wpstackable.com/stackable-guides/advanced-guides/how-to-use-global-colors/?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
						{ __( 'Learn more about Global Colors', i18n ) }
					</a>
				</p>
				<GlobalSettingsColorPicker />
			</GlobalSettingsPanel>
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

		const updateToStackableGlobalColors = () => {
			const { colors } = select( 'core/block-editor' ).getSettings()
			const newColors = colors.map( color => {
				const { name, slug } = color
				const newColor = { name, slug }
				newColor.colorVar = `--stk-global-color-${ md5( Math.floor( Math.random() * new Date().getTime() ) ).substr( 0, 5 ) }`
				newColor.color = `var(${ newColor.colorVar }, ${ color.color })`
				newColor.fallback = color.color
				return newColor
			} )

			// Dispatch the newColors to the current colors
			dispatch( 'core/block-editor' ).updateSettings( {
				colors: newColors,
			} )

			// Save the settings
			loadPromise.then( () => {
				const model = new models.Settings( { stackable_global_colors: newColors } ) // eslint-disable-line camelcase
				model.save()
			} )

			doAction( 'stackable.global-settings.global-styles', newColors )
		}

		settings.fetch().then( response => {
			const { stackable_global_colors: globalColors } = response

			if ( Array.isArray( globalColors ) ) {
				if ( globalColors.length === 0 ) {
					updateToStackableGlobalColors()
				} else {
					// Fetch stackable global settings and dispatch to the curent colors
					loadPromise.then( () => {
						const settings = new models.Settings()
						settings.fetch().then( response => {
							// Dispatch the global colors to the current colors
							dispatch( 'core/block-editor' ).updateSettings( {
								colors: response.stackable_global_colors,
							} )
						} )

						doAction( 'stackable.global-settings.global-styles', globalColors )
					} )
				}
			} else {
				updateToStackableGlobalColors()
			}
		} )
	} )
} )
