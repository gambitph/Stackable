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
import { isEqual, omit } from 'lodash'
import rgba from 'color-rgba'

/**
 * Wordpress dependencies
 */
import { addFilter, addAction } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { dispatch, select } from '@wordpress/data'
import domReady from '@wordpress/dom-ready'

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

domReady( () => {
	// Keep note of all the default colors.
	const colors = select( 'core/block-editor' ).getSettings().colors
	const defaultColors = ( colors || [] ).reduce( ( colors, colorObject ) => {
		if ( ! colorObject.slug.match( /^stk-/ ) ) {
			colors.push( colorObject )
		 }
		 return colors
	}, [] )

	dispatch( 'core/block-editor' ).updateSettings( {
		colors,
		defaultColors,
	} )
} )
