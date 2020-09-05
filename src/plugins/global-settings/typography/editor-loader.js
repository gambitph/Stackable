/**
 * Loads all the typography styles for the blocks in the editor.
 */

/**
 * External dependencies
 */
import { createTypographyStyles, loadGoogleFont } from '~stackable/util'
import { generateStyles } from '~stackable/components/block-styles'
import deepmerge from 'deepmerge'

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'
import { loadPromise, models } from '@wordpress/api'
import {
	render, useEffect, useState,
} from '@wordpress/element'
import { addAction, removeAction } from '@wordpress/hooks'
import { useSelect } from '@wordpress/data'

export const GlobalTypographyStyles = () => {
	const [ typographySettings, setTypographySettings ] = useState( [] )
	const [ applySettingsTo, setApplySettingsTo ] = useState( '' )
	const { device } = useSelect(
		select => ( {
			device: select(
				'core/edit-post'
			).__experimentalGetPreviewDeviceType(),
		} ),
		[]
	)

	useEffect( () => {
		// Get settings.
		loadPromise.then( () => {
			const settings = new models.Settings()
			settings.fetch().then( response => {
				setTypographySettings( ( response.stackable_global_typography && response.stackable_global_typography[ 0 ] ) || {} )
				setApplySettingsTo( response.stackable_global_typography_apply_to || 'blocks-stackable-native' )
			} )
		} )

		// Allow actions to trigger styles to update.
		addAction( 'stackable.global-settings.typography.update-trigger', 'stackable/typography-styles', ( newTypographySettings, newAapplySettingsTo ) => {
			setTypographySettings( newTypographySettings )
			setApplySettingsTo( newAapplySettingsTo )
		} )
		return () => {
			removeAction( 'stackable.global-settings.typography.update-trigger', 'stackable/typography-styles' )
		}
	}, [] )

	// The selector will depend on what blocks are allowed to have the global styles.
	const selectors = []
	if ( applySettingsTo === 'blocks-stackable-native' ) {
		selectors.push( '[data-type^="core/"]' )
		selectors.push( '[data-type^="ugb/"]' )
	} else if ( applySettingsTo === 'blocks-stackable' ) {
		selectors.push( '[data-type^="ugb/"]' )
	} else if ( applySettingsTo === 'blocks-all' ) {
		selectors.push( '[data-type]' )
		selectors.push( '[data-type^="core/"]' )
		selectors.push( '[data-type^="ugb/"]' )
	} else { // Entire site.
		// It's just the editor since we're in Gutenberg.
		selectors.push( '[data-type]' )
		selectors.push( '[data-type^="core/"]' )
		selectors.push( '[data-type^="ugb/"]' )
	}

	// Generate all the typography styles.
	const styles = Object.keys( typographySettings ).map( tag => {
		// Build our selector, target h2.block or .block h2.
		// Some blocks may output the heading tag right away.
		return deepmerge.all( selectors.map( selector => {
			const typographyStyles = typographySettings[ tag ]

			// Load our Google Font is necessary.
			if ( typographyStyles.fontFamily ) {
				loadGoogleFont( typographyStyles.fontFamily )
			}

			// Force styles only for Stackable blocks.
			const important = selector === '[data-type^="ugb/"]'

			// Generate our styles for this tag.
			const fullSelector = `${ selector } ${ tag }, ${ tag }${ selector }`
			const tagStyles = {
				[ fullSelector ]: createTypographyStyles( '%s', 'desktop', typographyStyles, { important } ),
				tablet: {
					[ fullSelector ]: createTypographyStyles( '%s', 'tablet', typographyStyles, { important } ),
				},
				mobile: {
					[ fullSelector ]: createTypographyStyles( '%s', 'mobile', typographyStyles, { important } ),
				},
			}

			// If the device preview is not a desktop, render our styles for that preview.
			if ( device === 'Tablet' || device === 'Mobile' ) {
				tagStyles[ fullSelector ] = {
					...tagStyles[ fullSelector ],
					...createTypographyStyles( '%s', device.toLowerCase(), typographyStyles, { important } ),
				}
			}

			return tagStyles
		} ) )
	} )

	return <style>{ generateStyles( deepmerge.all( styles ) ) }</style>
}

domReady( () => {
	const wrapper = document.createElement( 'div' )
	document.body.appendChild( wrapper )
	render( <GlobalTypographyStyles />, wrapper )
} )
