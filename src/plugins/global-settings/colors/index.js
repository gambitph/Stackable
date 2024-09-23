import './store'

/**
 * Internal dependencies
 */
import ColorPicker from './color-picker'
import { GlobalColorStyles } from './editor-loader'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { PanelAdvancedSettings } from '~stackable/components'
import rgba from 'color-rgba'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { dispatch, useSelect } from '@wordpress/data'
import { models } from '@wordpress/api'
import { ToggleControl } from '@wordpress/components'

export { GlobalColorStyles }

// TODO: Do we still need this because opacity is now included in the picker???
addFilter( 'stackable.util.hex-to-rgba', 'stackable/global-colors', ( output, hexColor, opacity ) => {
	// Only do this for Stackable global colors.
	if ( ! hexColor.includes( '--stk-global-color' ) ) {
		return output
	}

	const colorVarID = hexColor.match( /--stk-global-color-(\S*?(?=,))/ )
	if ( colorVarID ) {
		const colorRegex = /( )(.*)/g

		// Get the fallback value of the global color.
		const colorMatch = hexColor.match( colorRegex )[ 0 ].trim().slice( 0, -1 )

		// If the fallback value is a hex, convert to rgba.
		if ( colorMatch && colorMatch[ 0 ] === '#' ) {
			const rgbaColor = rgba( colorMatch )
			if ( rgbaColor ) {
				rgbaColor.splice( 3, 1 )
				return `rgba(var(--stk-global-color-${ colorVarID[ 1 ] }-rgba, ${ rgbaColor.join( ', ' ) }), ${ opacity !== null ? opacity : 1 })`
			}
		}
	}

	return output
} )

addFilter( 'stackable.util.is-dark-color', 'stackable/global-colors', color => {
	if ( color.match( /--stk-global-color/ ) ) {
		const colorVarID = color.match( /--stk-global-color-(\S*?(?=,))/ )
		if ( colorVarID ) {
			const colorRegex = /( )(.*)/g
			// Get the fallback value of the global color.
			const colorMatch = color.match( colorRegex )[ 0 ].trim().slice( 0, -1 )
			if ( colorMatch && colorMatch[ 0 ] === '#' ) {
				return colorMatch
			}
		}
	}

	return color
} )

addFilter( 'stackable.global-settings.inspector', 'stackable/global-colors', output => {
	const {
		hideThemeColors,
		hideDefaultColors,
		hideSiteEditorColors,
	} = useSelect( select => select( 'stackable/global-colors' ).getSettings() )

	const onChangeHideThemeColors = value => {
		dispatch( 'stackable/global-colors' ).updateSettings( {
			hideThemeColors: value,
		} )

		const settings = new models.Settings( { stackable_global_hide_theme_colors: value } ) // eslint-disable-line camelcase
		settings.save()
	}

	const onChangeHideDefaultColors = value => {
		dispatch( 'stackable/global-colors' ).updateSettings( {
			hideDefaultColors: value,
		} )

		const settings = new models.Settings( { stackable_global_hide_default_colors: value } ) // eslint-disable-line camelcase
		settings.save()
	}

	const onChangeHideSiteEditorColors = value => {
		dispatch( 'stackable/global-colors' ).updateSettings( {
			hideSiteEditorColors: value,
		} )

		const settings = new models.Settings( { stackable_global_hide_site_editor_colors: value } ) // eslint-disable-line camelcase
		settings.save()
	}

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Global Color Palette', i18n ) }
				initialOpen={ true }
			>
				<p className="components-base-control__help">
					{ __( 'Change your color palette for all your blocks across your site.', i18n ) }
					&nbsp;
					<a href="https://docs.wpstackable.com/article/362-how-to-use-global-colors?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
						{ __( 'Learn more about Global Colors', i18n ) }
					</a>
				</p>
				<ColorPicker label={ __( 'Global Colors', i18n ) } />
				{ /* <ColorPicker
					label={ __( 'Global Gradients', i18n ) }
					onReset={ () => onChangeUseStackableColorsOnly( false ) }
				/> */ }
				<ToggleControl
					label={ __( 'Show Theme Colors', i18n ) }
					checked={ ! hideThemeColors }
					onChange={ value => onChangeHideThemeColors( ! value ) }
				/>
				<ToggleControl
					label={ __( 'Show Default Colors', i18n ) }
					checked={ ! hideDefaultColors }
					onChange={ value => onChangeHideDefaultColors( ! value ) }
				/>
				<ToggleControl
					label={ __( 'Show Site Editor Custom Colors', i18n ) }
					checked={ ! hideSiteEditorColors }
					onChange={ value => onChangeHideSiteEditorColors( ! value ) }
				/>
			</PanelAdvancedSettings>
		</Fragment>
	)
} )

// Convert hex colors to global colors in Stackable blocks.
addFilter( 'stackable.color-palette-control.change', 'stackable/global-colors', ( value, colorObject ) => {
	if ( colorObject && colorObject.slug.includes( 'stk-global-color' ) ) {
		return `var(--${ colorObject.slug })`
	}

	return value
} )
