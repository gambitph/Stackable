import './editor-color-palette-change'
import './editor-loader'
import './store'

/**
 * Internal dependencies
 */
import { replaceGlobalColorAttributes, updateFallbackColorAttributes } from './util'
import ColorPicker from './color-picker'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { PanelAdvancedSettings } from '~stackable/components'
import {
	isEqual, omit, uniqBy, find,
} from 'lodash'
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

/**
 * We will update the block attributes of these blocks whenever
 * the Global Colors are modified (changing the fallback values).
 */
const blocksToUpdate = [
	'core',
	'ugb',
]

addFilter( 'stackable.util.hex-to-rgba', 'global-settings/colors', ( output, hexColor, opacity ) => {
	// Only do this for Stackable global colors.
	if ( ! hexColor.includes( '--stk-global-color' ) ) {
		return output
	}

	const colorVarID = hexColor.match( /--stk-global-color-(\S*?(?=,))/ )
	if ( colorVarID ) {
		const colorRegex = /( )(.*)/g
		const colorMatch = hexColor.match( colorRegex )[ 0 ].trim().slice( 0, -1 )
		if ( colorMatch[ 0 ] === '#' ) {
			const rgbaColor = rgba( colorMatch )
			rgbaColor.splice( 3, 1 )
			return `rgba(var(--stk-global-color-${ colorVarID[ 1 ] }-rgba, ${ rgbaColor.join( ', ' ) }), ${ opacity !== null ? opacity : 1 })`
		}

		if ( colorMatch.includes( 'var' ) ) {
			if ( colorMatch.match( /--(.*?(?=,))/g ) ) {
				const cssVar = colorMatch.match( /--(.*?(?=,))/g )[ 0 ]
				const rgbaColor = rgba( window.getComputedStyle( document.documentElement ).getPropertyValue( cssVar ).trim() )
				rgbaColor.splice( 3, 1 )
				return `rgba(var(--stk-global-color-${ colorVarID[ 1 ] }-rgba, ${ rgbaColor.join( ', ' ) }), ${ opacity !== null ? opacity : 1 })`
			} else if ( colorMatch.match( /--(.*?(?=\)))/g ) ) {
				const cssVar = colorMatch.match( /--(.*?(?=\)))/g )[ 0 ]
				const rgbaColor = rgba( window.getComputedStyle( document.documentElement ).getPropertyValue( cssVar ).trim() )
				rgbaColor.splice( 3, 1 )
				return `rgba(var(--stk-global-color-${ colorVarID[ 1 ] }-rgba, ${ rgbaColor.join( ', ' ) }), ${ opacity !== null ? opacity : 1 })`
			}
		}
	}

	return output
} )

addFilter( 'stackable.util.is-dark-color', 'global-settings/colors', color => {
	const rgbToHex = ( r, g, b ) => '#' + ( ( 1 << 24 ) + ( r << 16 ) + ( g << 8 ) + b ).toString( 16 ).slice( 1 ) // eslint-disable-line no-bitwise
	if ( color.match( /--stk-global-color/ ) ) {
		const colorVarID = color.match( /--stk-global-color-(\S*?(?=,))/ )
		if ( colorVarID ) {
			const colorRegex = /( )(.*)/g
			const colorMatch = color.match( colorRegex )[ 0 ].trim().slice( 0, -1 )
			if ( colorMatch[ 0 ] === '#' ) {
				return colorMatch
			}

			if ( colorMatch.includes( 'var' ) ) {
				if ( colorMatch.match( /--(.*?(?=,))/g ) ) {
					const cssVar = colorMatch.match( /--(.*?(?=,))/g )[ 0 ]
					const rgbaColor = rgba( window.getComputedStyle( document.documentElement ).getPropertyValue( cssVar ).trim() )
					rgbaColor.splice( 3, 1 )
					return rgbToHex( ...rgbaColor )
				} else if ( colorMatch.match( /--(.*?(?=\)))/g ) ) {
					const cssVar = colorMatch.match( /--(.*?(?=\)))/g )[ 0 ]
					const rgbaColor = rgba( window.getComputedStyle( document.documentElement ).getPropertyValue( cssVar ).trim() )
					rgbaColor.splice( 3, 1 )
					return rgbToHex( ...rgbaColor )
				}
			}
		}
	}

	return color
} )

addFilter( 'stackable.global-settings.inspector', 'global-settings/global-colors', output => {
	const { useStackableColorsOnly } = useSelect( select => select( 'stackable/global-colors' ).getSettings() )

	const onChangeUseStackableColorsOnly = value => {
		dispatch( 'stackable/global-colors' ).updateSettings( {
			useStackableColorsOnly: value,
		} )
		loadPromise.then( () => {
			const model = new models.Settings()
			model.fetch().then( res => {
				const settings = new models.Settings( { stackable_global_colors_palette_only: value } ) // eslint-disable-line camelcase
				settings.save()
				const { defaultColors } = select( 'stackable/global-colors' ).getSettings()
				dispatch( 'core/block-editor' ).updateSettings( {
					colors: value ? res.stackable_global_colors : uniqBy( [ ...defaultColors, ...res.stackable_global_colors ], 'slug' ),
				} )
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
				<ColorPicker />
				<ToggleControl
					label={ __( 'Use only Stackable colors', i18n ) }
					checked={ useStackableColorsOnly }
					onChange={ onChangeUseStackableColorsOnly }
				/>
			</PanelAdvancedSettings>
		</Fragment>
	)
} )

/**
 * Used for attributes compatibility when resetting the global colors.
 */
addAction( 'stackable.global-colors.reset-compatibility', 'color-reset', ( blocks, colorsBeforeReset, colorsAfterReset ) => {
	const stringifiedBlocks = JSON.stringify( blocks )
	const parsedClientIds = stringifiedBlocks.match( /"clientId":".+?(?=\")"/g )
	if ( ! parsedClientIds || ( parsedClientIds && ! Array.isArray( parsedClientIds ) ) ) {
		return
	}
	const clientIds = parsedClientIds.map( parsedClientId => {
		const { clientId } = JSON.parse( `{${ parsedClientId }}` )
		return clientId
	} )

	const { getBlock } = select( 'core/block-editor' )
	const { updateBlockAttributes } = dispatch( 'core/block-editor' )

	// Include innerBlocks.
	const allBlocks = clientIds.map( clientID => {
		const block = omit( getBlock( clientID ), 'innerBlocks' )
		return block
	} )

	/**
	 * Compatibility adjustments for stackable and other blocks.
	 */

	// Iterate through all blocks and update existing color attributes.
	allBlocks.forEach( block => {
		const { clientId, name } = block

		if ( name.includes( 'ugb/' ) ) {
			//
			/**
			 * For stackable blocks.
			 * We are retaining the color of blocks that uses
			 * the deleted global color. Otherwise, reset its color
			 * as well.
			 */
			const updatedAttributes = replaceGlobalColorAttributes( block.attributes, colorsBeforeReset, colorsAfterReset )

			// Update the block attributes.
			if ( ! isEqual( updatedAttributes, block.attributes ) ) {
				updateBlockAttributes( clientId, updatedAttributes )
			}
		} else if ( name.includes( 'core/' ) ) {
			//
			/**
			 * For core blocks.
			 * If a core block uses a color palette included in the theme,
			 * it uses the slug name as its attribute (e.g. textColor: "accent").
			 * Otherwise, textColor will be undefined and instead will add a style attribute
			 * (e.g. core/heading style: { color: "#123abc"}).
			 */
			if ( name.includes( 'heading' ) || name.includes( 'paragraph' ) ) {
				const newAttributes = { style: { color: {}, ...block.attributes.style } }
				const { backgroundColor, textColor } = block.attributes
				if ( backgroundColor ) {
					if ( backgroundColor.includes( 'stk-global-color-' ) ) {
						// Retain the color
						const colorVarMatch = backgroundColor.match( /stk-global-color-(\S*)/ )
						if ( colorVarMatch && Array.isArray( colorVarMatch ) && colorVarMatch.length >= 2 ) {
							const colorVarID = colorVarMatch[ 1 ]
							newAttributes.backgroundColor = undefined
							const appliedColor = find( colorsBeforeReset, color => color.slug === `stk-global-color-${ colorVarID }` )
							newAttributes.style.color.background = appliedColor ? appliedColor.color || '#000000' : '#000000'
						}
					}
				}

				if ( textColor ) {
					if ( textColor.includes( 'stk-global-color-' ) ) {
						// Retain the color
						const colorVarMatch = textColor.match( /stk-global-color-(\S*)/ )
						if ( colorVarMatch && Array.isArray( colorVarMatch ) && colorVarMatch.length >= 2 ) {
							const colorVarID = colorVarMatch[ 1 ]
							newAttributes.textColor = undefined
							const appliedColor = find( colorsBeforeReset, color => color.slug === `stk-global-color-${ colorVarID }` )
							newAttributes.style.color.text = appliedColor ? appliedColor.color || '#000000' : '#000000'
						}
					}
				}

				// Update the block attributes.
				updateBlockAttributes( clientId, newAttributes )
			}
		}
	} )
} )

// Convert hex colors to global colors in Stackable blocks.
addFilter( 'stackable.color-palette-control.change', 'stackable/global-settings/colors', ( value, colorObject ) => {
	if ( colorObject && colorObject.slug.match( /stk-global-color/ ) ) {
		return `var(${ colorObject.colorVar }, ${ colorObject.color })`
	}

	return value
} )

/**
 * Function used for updating the fallback values of
 * blocks in the editor using global colors.
 *
 * @param {{color: string, slug: string, name: string, colorVar: ?string, rgb: ?string}[]} updatedColors
 */
const updateFallbackBlockAttributesInEditor = updatedColors => {
	const { getBlock, getBlocks } = select( 'core/block-editor' )
	const { updateBlockAttributes } = dispatch( 'core/block-editor' )

	const stringifiedBlocks = JSON.stringify( getBlocks() )
	const parsedClientIds = stringifiedBlocks.match( /"clientId":".+?(?=\")"/g )

	if ( parsedClientIds && Array.isArray( parsedClientIds ) && parsedClientIds.length ) {
		const clientIds = parsedClientIds.map( parsedClientId => {
			const { clientId } = JSON.parse( `{${ parsedClientId }}` )
			return clientId
		} )

		// Include innerBlocks.
		const allBlocks = clientIds.map( clientID => {
			const block = omit( getBlock( clientID ), 'innerBlocks' )
			return block
		} )

		allBlocks.forEach( block => {
			const { clientId, name } = block
			if ( name && new RegExp( blocksToUpdate.map( block => `${ block }/` ).join( '|' ) ).test( name ) ) {
				const newAttributes = updateFallbackColorAttributes( block.attributes, updatedColors )
				if ( ! isEqual( newAttributes, block.attributes ) ) {
					updateBlockAttributes( clientId, newAttributes )
				}
			}
		} )
	}
}

/**
 * Action for saving the colors in models settings.
 */
addAction( 'stackable.global-colors.save-model-settings', 'color-save-settings', newColors => {
	const updatedColors = newColors.filter( color => color.colorVar ).map( newColor => {
		const rgbaColor = rgba( window.getComputedStyle( document.documentElement ).getPropertyValue( newColor.colorVar ).trim() )
		if ( Array.isArray( rgbaColor ) && rgbaColor.length !== 0 ) {
			rgbaColor.splice( 3, 1 )
			newColor.rgb = rgbaColor.join( ', ' )
			return newColor
		}
		return newColor
	} )

	updateFallbackBlockAttributesInEditor( updatedColors )

	// Make sure that we are saving the colors with colorVars.
	loadPromise.then( () => {
		const settings = new models.Settings( { stackable_global_colors: updatedColors } ) // eslint-disable-line camelcase
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
					colors: stackableColors,
				} )
			}

			dispatch( 'stackable/global-colors' ).updateSettings( {
				defaultColors,
				useStackableColorsOnly,
			} )
		} )
	} )
} )
