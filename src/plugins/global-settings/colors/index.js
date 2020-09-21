import './editor-color-palette-change'
import './editor-loader'
import './store'

/**
 * Internal dependencies
 */
import {
	updateFallbackBlockAttributes, resetBlockColorAttributes,
} from './util'
import ColorPicker from './color-picker'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { PanelAdvancedSettings } from '~stackable/components'
import { uniqBy } from 'lodash'
import rgba from 'color-rgba'

/**
 * Wordpress dependencies
 */
import { addFilter, addAction } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import {
	dispatch, select, useSelect,
} from '@wordpress/data'
import domReady from '@wordpress/dom-ready'
import { loadPromise, models } from '@wordpress/api'
import { ToggleControl } from '@wordpress/components'

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
	const { useStackableColorsOnly } = useSelect( select => select( 'stackable/global-colors' ).getSettings() )

	const onChangeUseStackableColorsOnly = ( value, updateColors = true ) => {
		dispatch( 'stackable/global-colors' ).updateSettings( {
			useStackableColorsOnly: value,
		} )
		loadPromise.then( () => {
			const model = new models.Settings()
			model.fetch().then( res => {
				const settings = new models.Settings( { stackable_global_colors_palette_only: value } ) // eslint-disable-line camelcase
				settings.save()
				if ( updateColors ) {
					const { defaultColors } = select( 'stackable/global-colors' ).getSettings()
					dispatch( 'core/block-editor' ).updateSettings( {
						colors: value ? res.stackable_global_colors[ 0 ] || [] : uniqBy( [ ...defaultColors, ...res.stackable_global_colors[ 0 ] || [] ], 'slug' ),
					} )
				}
			} )
		} )
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
					<a href="https://docs.wpstackable.com/stackable-guides/advanced-guides/how-to-use-global-colors/?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
						{ __( 'Learn more about Global Colors', i18n ) }
					</a>
				</p>
				<ColorPicker
					onReset={ () => onChangeUseStackableColorsOnly( false, false ) }
				/>
				<ToggleControl
					label={ __( 'Use only Stackable colors', i18n ) }
					checked={ !! useStackableColorsOnly }
					onChange={ value => onChangeUseStackableColorsOnly( value ) }
				/>
			</PanelAdvancedSettings>
		</Fragment>
	)
} )

/**
 * When a color is deleted, iterate through all blocks and update the color
 * attribute affected, turn them from slugs into the hex equivalent.
 */
addAction( 'stackable.global-colors.reset-compatibility', 'stackable/global-colors', colorsBeforeReset => {
	const resetBlockColorAttributesRecursive = blocks => {
		blocks.forEach( block => {
			resetBlockColorAttributes( block, colorsBeforeReset )

			// Also adjust the inner blocks.
			if ( block.innerBlocks && block.innerBlocks.length ) {
				resetBlockColorAttributesRecursive( block.innerBlocks )
			}
		} )
	}

	resetBlockColorAttributesRecursive( select( 'core/block-editor' ).getBlocks() )
} )

// Convert hex colors to global colors in Stackable blocks.
addFilter( 'stackable.color-palette-control.change', 'stackable/global-colors', ( value, colorObject ) => {
	if ( colorObject && colorObject.slug.match( /stk-global-color/ ) ) {
		return `var(--${ colorObject.slug }, ${ colorObject.color })`
	}

	return value
} )

/**
 * Action for saving the colors in models settings.
 */
addAction( 'stackable.global-colors.save-model-settings', 'stackable/global-colors', newColors => {
	const updatedColors = newColors.filter( color => color.slug.match( /^stk-global-color/ ) ).map( newColor => {
		const rgbaColor = rgba( window.getComputedStyle( document.documentElement ).getPropertyValue( `--${ newColor.slug }` ).trim() )
		if ( Array.isArray( rgbaColor ) && rgbaColor.length !== 0 ) {
			rgbaColor.splice( 3, 1 )
			newColor.rgb = rgbaColor.join( ', ' )
			return newColor
		}
		return newColor
	} )

	updateFallbackBlockAttributes( updatedColors )

	loadPromise.then( () => {
		const settings = new models.Settings( { stackable_global_colors: [ updatedColors ] } ) // eslint-disable-line camelcase
		settings.save()
	} )
} )

domReady( () => {
	// Keep note of all the default colors.
	const colors = select( 'core/block-editor' ).getSettings().colors
	const defaultColors = colors.filter( ( { slug } ) => ! slug.match( /^stk-/ ) )
	const stackableColors = colors.filter( ( { slug } ) => slug.match( /^stk-/ ) )

	loadPromise.then( () => {
		const settings = new models.Settings()

		settings.fetch().then( response => {
			const { stackable_global_colors_palette_only: useStackableColorsOnly } = response

			if ( useStackableColorsOnly ) {
				dispatch( 'core/block-editor' ).updateSettings( {
					colors: stackableColors || [],
				} )
			}

			dispatch( 'stackable/global-colors' ).updateSettings( {
				defaultColors,
				useStackableColorsOnly,
			} )
		} )
	} )
} )
