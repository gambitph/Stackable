/**
 * Handles the saving of global color palette to
 * backend.
 */

/**
 * Wordpress dependencies
 */
import {
	select, dispatch, useSelect,
} from '@wordpress/data'
import { loadPromise, models } from '@wordpress/api'
import { registerPlugin } from '@wordpress/plugins'
import { useEffect } from '@wordpress/element'

/**
 * External dependencies
 */
import { omit, isEqual } from 'lodash'
import rgba from 'color-rgba'

/**
 * Internal dependencies
 */
import { updateFallbackColorAttributes } from './util'

const SaveModelSettings = () => {
	const { colors, defaultColors } = useSelect( select => ( {
		 colors: select( 'core/block-editor' ).getSettings().colors,
		 defaultColors: select( 'core/block-editor' ).getSettings().defaultColors,
	} ) )

	const saveModelSettings = newColors => {
		const { getBlock, getBlocks } = select( 'core/block-editor' )
		const { updateBlockAttributes } = dispatch( 'core/block-editor' )

		const stringifiedBlocks = JSON.stringify( getBlocks() )
		const parsedClientIds = stringifiedBlocks.match( /"clientId":".+?(?=\")"/g )
		if ( ! parsedClientIds || ( parsedClientIds && ! Array.isArray( parsedClientIds ) ) ) {
			return
		}
		const clientIds = parsedClientIds.map( parsedClientId => {
			const { clientId } = JSON.parse( `{${ parsedClientId }}` )
			return clientId
		} )

		// Include innerBlocks.
		const allBlocks = clientIds.map( clientID => {
			const block = omit( getBlock( clientID ), 'innerBlocks' )
			return block
		} )

		const updatedColors = newColors.filter( color => color.colorVar ).map( newColor => {
			const rgbaColor = rgba( window.getComputedStyle( document.documentElement ).getPropertyValue( newColor.colorVar ).trim() )
			if ( Array.isArray( rgbaColor ) && rgbaColor.length !== 0 ) {
				rgbaColor.splice( 3, 1 )
				newColor.rgb = rgbaColor.join( ', ' )
				return newColor
			}
			return newColor
		} )

		allBlocks.forEach( block => {
			const { clientId, name } = block
			if ( name && name.includes( 'ugb/' ) ) {
				const newAttributes = updateFallbackColorAttributes( block.attributes, updatedColors )
				if ( ! isEqual( newAttributes, block.attributes ) ) {
					updateBlockAttributes( clientId, newAttributes )
				}
			}
		} )

		// Make sure that we are saving the colors with colorVars.
		loadPromise.then( () => {
			const settings = new models.Settings( { stackable_global_colors: updatedColors } ) // eslint-disable-line camelcase
			settings.save()
		} )
	}

	useEffect( () => {
		const saveModelSettingsTimeout = setTimeout( () => {
			if ( defaultColors && Array.isArray( defaultColors ) && defaultColors.length ) {
				saveModelSettings( colors )
			}
		}, 100 )
		return () => clearTimeout( saveModelSettingsTimeout )
	}, [ colors, defaultColors ] )

	// We don't want to render anything here.
	return null
}

// Only do this for WP 5.5
if ( select( 'core/edit-post' ).__experimentalGetPreviewDeviceType ) {
	registerPlugin( 'stackable-global-color-save-model-settings', { render: SaveModelSettings } )
}

