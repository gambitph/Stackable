/**
 * Wordpress dependencies
 */
import {
	useSelect, select, dispatch,
} from '@wordpress/data'
import {
	useEffect, useState, render,
} from '@wordpress/element'
import domReady from '@wordpress/dom-ready'
import { loadPromise, models } from '@wordpress/api'

/**
 * External dependencies
 */
import rgba from 'color-rgba'
import md5 from 'md5'
import { omit, isEqual } from 'lodash'

/**
 * Internal dependencies
 */
import { updateFallbackColorAttributes } from './util'

const GlobalColorStyles = () => {
	const { colors } = useSelect( select => ( { colors: select( 'core/block-editor' ).getSettings().colors } ) )
	const [ styles, setStyles ] = useState( '' )

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

		const updatedColors = newColors.map( newColor => {
			const rgbaColor = rgba( window.getComputedStyle( document.documentElement ).getPropertyValue( newColor.colorVar ).trim() )
			rgbaColor.splice( 3, 1 )
			newColor.rgb = rgbaColor.join( ', ' )
			return newColor
		} )

		allBlocks.forEach( block => {
			const { clientId } = block
			const newAttributes = updateFallbackColorAttributes( block.attributes, updatedColors )
			if ( ! isEqual( newAttributes, block.attributes ) ) {
				updateBlockAttributes( clientId, newAttributes )
			}
		} )

		// Make sure that we are saving the colors with colorVars.
		loadPromise.then( () => {
			const settings = new models.Settings( { stackable_global_colors: updatedColors } ) // eslint-disable-line camelcase
			settings.save()
		} )
	}

	const renderGlobalStyles = newColors => {
		const styleRules = newColors.map( color => {
			if ( color.colorVar && color.fallback ) {
				return `${ color.colorVar || '' }: ${ color.fallback || '' };`
			}

			return ''
		} )

		setStyles( `:root { ${ styleRules.join( '' ) }}` )

		const rgbaStyleRules = newColors.map( color => {
			if ( color.colorVar ) {
				const rgbaColor = rgba( window.getComputedStyle( document.documentElement ).getPropertyValue( color.colorVar ).trim() )
				if ( Array.isArray( rgbaColor ) && rgbaColor.length !== 0 ) {
					rgbaColor.splice( 3, 1 )
					return `${ color.colorVar || '' }-rgba: ${ rgbaColor.join( ', ' ) };`
				}
			}

			return ''
		} )

		setStyles( styles => `${ styles } :root { ${ rgbaStyleRules.join( ' ' ) }}` )
	}

	useEffect( () => {
		const timeout = setTimeout( () => {
			renderGlobalStyles( colors )
			saveModelSettings( colors )
		}, 100 )
		return () => clearTimeout( timeout )
	}, [ colors ] )

	return <style>{ styles }</style>
}

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
		defaultColors: colors,
	} )
}

domReady( () => {
	const { colors } = select( 'core/block-editor' ).getSettings()
	const wrapper = document.createElement( 'div' )
	document.body.appendChild( wrapper )
	render( <GlobalColorStyles />, wrapper )

	loadPromise.then( () => {
		const settings = new models.Settings()

		settings.fetch().then( response => {
			const { stackable_global_colors: globalColors } = response

			if ( ! Array.isArray( globalColors ) || ! globalColors.length ) {
				updateToStackableGlobalColors()
			} else {
				dispatch( 'core/block-editor' ).updateSettings( {
					colors: globalColors,
					defaultColors: colors,
				} )
			}
		} )
	} )
} )
