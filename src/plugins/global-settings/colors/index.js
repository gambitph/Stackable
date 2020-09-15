import './editor-color-palette-change'
import './editor-loader'
import './save-model-settings'

/**
 * Internal dependencies
 */
import { replaceGlobalColorAttributes } from './util'
import ColorPicker from './color-picker'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { PanelAdvancedSettings } from '~stackable/components'
import {
	isEqual, find, omit, cloneDeep,
} from 'lodash'
import rgba from 'color-rgba'
import md5 from 'md5'

/**
 * Wordpress dependencies
 */
import { addFilter, addAction } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { dispatch, select } from '@wordpress/data'
import domReady from '@wordpress/dom-ready'
import { loadPromise, models } from '@wordpress/api'

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

addFilter( 'stackable.global-settings.inspector', 'global-settings/global-colors', output => (
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
		</PanelAdvancedSettings>
	</Fragment>
) )

/**
 * Used for attributes compatibility when resetting the global colors.
 */
addAction( 'stackable.global-settings.reset-compatibility', 'color-reset', ( blocks, colorsBeforeReset, colorsAfterReset ) => {
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
				const newAttributes = { style: { ...block.attributes.style } }
				const { backgroundColor, textColor } = block.attributes
				if ( backgroundColor ) {
					if ( backgroundColor.includes( 'stk-global-color-' ) ) {
						// Retain the color
						const colorVarMatch = backgroundColor.match( /stk-global-color-(\S*)/ )
						if ( colorVarMatch && Array.isArray( colorVarMatch ) && colorVarMatch.length >= 2 ) {
							const colorVarID = colorVarMatch[ 1 ]
							newAttributes.backgroundColor = undefined
							const appliedColor = find( colorsBeforeReset, color => color.slug === `stk-global-color-${ colorVarID }` )
							newAttributes.style.color.background = appliedColor ? appliedColor.fallback || '#000000' : '#000000'
						}
					}
				}

				if ( textColor ) {
					if ( textColor.includes( 'stk-global-color-' ) ) {
						// Retain the color
						const colorVarMatch = backgroundColor.match( /stk-global-color-(\S*)/ )
						if ( colorVarMatch && Array.isArray( colorVarMatch ) && colorVarMatch.length >= 2 ) {
							const colorVarID = colorVarMatch[ 1 ]
							newAttributes.textColor = undefined
							const appliedColor = find( colorsBeforeReset, color => color.slug === `stk-global-color-${ colorVarID }` )
							newAttributes.style.color.text = appliedColor ? appliedColor.fallback || '#000000' : '#000000'
						}
					}
				}

				// Update the block attributes.
				updateBlockAttributes( clientId, newAttributes )
			} else {
				const updatedAttributes = replaceGlobalColorAttributes( block.attributes, colorsBeforeReset, colorsAfterReset )

				// This is used for pullquote compatibility.
				if ( updatedAttributes.textColor ) {
					const defaultColor = find( colorsAfterReset, updatedColor => updatedColor.slug === updatedAttributes.textColor )
					if ( ! defaultColor ) {
						const appliedColor = find( colorsBeforeReset, color => color.slug === updatedAttributes.textColor )
						updatedAttributes.customTextColor = appliedColor ? appliedColor.fallback || '#000000' : '#000000'
						updatedAttributes.textColor = undefined
					} else {
						updatedAttributes.customTextColor = defaultColor.color || '#000000'
						updatedAttributes.textColor = undefined
					}
				}

				// Update the block attributes.
				if ( ! isEqual( updatedAttributes, block.attributes ) ) {
					updateBlockAttributes( clientId, updatedAttributes )
				}
			}
		}
	} )
} )

const updateToStackableGlobalColors = colors => {
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
		defaultColors: colors,
	} )
}

domReady( () => {
	const { colors } = cloneDeep( select( 'core/block-editor' ).getSettings() )
	loadPromise.then( () => {
		const settings = new models.Settings()

		settings.fetch().then( response => {
			const { stackable_global_colors: globalColors, stackable_global_colors_has_modified: hasModified } = response

			if ( ! Array.isArray( globalColors ) || ! globalColors.length || ! hasModified ) {
				updateToStackableGlobalColors( colors )
			} else {
				dispatch( 'core/block-editor' ).updateSettings( {
					colors: globalColors,
					defaultColors: colors,
				} )
			}
		} )
	} )
} )
