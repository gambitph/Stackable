/**
 * Loads all the typography styles for the blocks in the editor.
 */

/**
 * External dependencies
 */
import {
	createTypographyStyles, loadGoogleFont,
} from '~stackable/util'
import { generateStyles } from '~stackable/block-components'
import deepmerge from 'deepmerge'
import { head } from 'lodash'

/**
 * WordPress dependencies
 */
import { loadPromise, models } from '@wordpress/api'
import {
	useEffect, useState,
} from '@wordpress/element'
import {
	addAction, removeAction, applyFilters, doAction,
} from '@wordpress/hooks'
import { useSelect } from '@wordpress/data'

export const GlobalTypographyStyles = () => {
	const [ typographySettings, setTypographySettings ] = useState( [] )
	const [ applySettingsTo, setApplySettingsTo ] = useState( '' )

	// These are for debouncing the style generation to make things faster.
	const [ styles, setStyles ] = useState( '' )
	const [ styleTimeout, setStyleTimeout ] = useState( null )

	const { device } = useSelect(
		select => {
			const device = select( 'core/edit-post' )?.__experimentalGetPreviewDeviceType() || 'Desktop'
			return {
				device,
			}
		},
		[]
	)

	useEffect( () => {
		// Get settings.
		loadPromise.then( () => {
			const settings = new models.Settings()
			settings.fetch().then( response => {
				setTypographySettings( ( head( response.stackable_global_typography ) ) || {} )
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

	// Debounced style generation.
	useEffect( () => {
		addAction( 'stackable.global-settings.typography-update-global-styles', 'stackable/typography-styles', typographySettings => {
			// Generate all the typography styles.
			const styleObject = Object.keys( typographySettings ).map( tag => {
				const selectors = formSelectors( tag, applySettingsTo )

				// Build our selector, target h2.block or .block h2.
				// Some blocks may output the heading tag right away.
				return deepmerge.all( selectors.map( selector => {
					const typographyStyles = typographySettings[ tag ]

					// Load our Google Font is necessary.
					if ( typographyStyles.fontFamily ) {
						loadGoogleFont( typographyStyles.fontFamily )
					}

					// Force styles only for Stackable blocks.
					let important = selector.includes( 'stackable/' )
					important = applyFilters( 'stackable.global-settings.typography.selector-is-stackable', important, selector )

					// Generate our styles for this tag.
					const tagStyles = {
						[ selector ]: createTypographyStyles( '%s', 'desktop', typographyStyles, { important } ),
						tablet: {
							[ selector ]: createTypographyStyles( '%s', 'tablet', typographyStyles, { important } ),
						},
						mobile: {
							[ selector ]: createTypographyStyles( '%s', 'mobile', typographyStyles, { important } ),
						},
					}

					// If the device preview is not a desktop, render our styles for that preview.
					if ( device && ( device === 'Tablet' || device === 'Mobile' ) ) {
						tagStyles[ selector ] = {
							...tagStyles[ selector ],
							...createTypographyStyles( '%s', device.toLowerCase(), typographyStyles, { important } ),
						}
					}

					// Allow others to also adjust typography styles.
					return applyFilters( 'stackable.global-settings.typography.editor-styles', tagStyles, tag, selector, typographyStyles, important )
				} ) )
			} )

			setStyles( generateStyles( deepmerge.all( styleObject ) ).join( '' ) )
		} )

		clearTimeout( styleTimeout )
		setStyleTimeout( setTimeout( () => doAction( 'stackable.global-settings.typography-update-global-styles', typographySettings ), 200 ) )

		return () => removeAction( 'stackable.global-settings.typography-update-global-styles', 'stackable/typography-styles' )
	}, [ JSON.stringify( typographySettings ), applySettingsTo, device ] )

	return styles
}

export const formSelectors = ( selector, applyTo ) => {
	if ( [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ].includes( selector ) || selector.startsWith( '.' ) ) {
		return formClassOrTagSelectors( selector, applyTo )
	}
	return formParagraphSelectors( applyTo )
}

export const formClassOrTagSelectors = ( selector, applyTo ) => {
	const selectors = []
	const isClassSelector = selector.startsWith( '.' )

	// Include Stackable blocks.
	selectors.push( `[data-type^="stackable/"] ${ selector }` )

	// Include native blocks.
	if ( isClassSelector || applyTo !== 'blocks-stackable' ) {
		selectors.push( `.editor-styles-wrapper [data-type^="core/"] ${ selector }` )
		selectors.push( `.editor-styles-wrapper ${ selector }[data-type^="core/"]` )
	}

	// Include all other blocks.
	if ( isClassSelector || applyTo === 'blocks-all' ) {
		selectors.push( `.editor-styles-wrapper [data-type] ${ selector }` )
		selectors.push( `.editor-styles-wrapper ${ selector }[data-type]` )
	}

	return applyFilters( 'stackable.global-settings.typography-selectors', selectors, selector )
}

export const formParagraphSelectors = applyTo => {
	return [
		...formClassOrTagSelectors( 'p', applyTo ),
		...formClassOrTagSelectors( 'li', applyTo ),
		`.editor-styles-wrapper p.block-editor-block-list__block[data-type^="core/"]`,
		`.editor-styles-wrapper .block-editor-block-list__block[data-type^="core/"] p`,
		`.editor-styles-wrapper .block-editor-block-list__block[data-type^="core/"] li`,
		`.editor-styles-wrapper .block-editor-block-list__block[data-type^="core/"] td`,
	]
}
