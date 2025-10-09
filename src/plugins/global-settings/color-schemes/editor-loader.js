/**
 * Internal dependencies
 */
import './deprecated'
import {
	convertToObj, getCSS, schemeHasValue, getDefaultColors,
	unsetDefaultColors,
} from './utils'

import { onClassChange } from '../utils'

/**
 * External dependencies
 */
import { useBlockColorSchemes, useBlockHoverState } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element'
import { useSelect } from '@wordpress/data'
import { applyFilters, addFilter } from '@wordpress/hooks'

export const renderGlobalColorSchemeStyles = (
	setStyles,
	colorSchemesArray,
	baseColorScheme,
	backgroundModeColorScheme,
	containerModeColorScheme,
	currentHoverState,
	returnCss = false,
) => {
	let css = '',
		decls

	const rules = {
		background: [],
		container: [],
	}
	const colorSchemes = convertToObj( colorSchemesArray )

	/**
	 * The following order should be followed to ensure that blocks use the correct color scheme:
	 * 1. Base color scheme
	 * 2. Default Background color scheme
	 * 3. Default Container color scheme
	 * 4. Background color schemes (used by blocks that opt to use non-default background schemes)
	 * 5. Container color schemes (used by blocks that opt to use non-default container schemes)
	 */

	const unsetDefaults = unsetDefaultColors()

	if ( baseColorScheme in colorSchemes && schemeHasValue( colorSchemes[ baseColorScheme ] ) ) {
		decls = getCSS( colorSchemes[ baseColorScheme ], currentHoverState )
		if ( decls.desktop.length || decls.desktopHover.length ) {
			css += `:root{ ${ [ ...decls.desktop, ...decls.desktopHover ].join( '' ) } }\n`
		}
	}

	if ( backgroundModeColorScheme in colorSchemes && schemeHasValue( colorSchemes[ backgroundModeColorScheme ] ) ) {
		decls = getCSS( colorSchemes[ backgroundModeColorScheme ], currentHoverState, 'background' )
		let bgcss = ''
		if ( decls.desktop.length || decls.desktopHover.length ) {
			bgcss += `.stk-block-background{ ${ [ ...decls.desktop, ...decls.desktopHover, unsetDefaults ].join( '' ) } }\n`
		}
		if ( decls.desktopParentHover.length ) {
			bgcss += `:where(.stk-hover-parent:hover) .stk-block-background{ ${ [ ...decls.desktopParentHover, unsetDefaults ].join( '' ) } }\n`
		}
		css += bgcss
	}

	// This fixes the issue wherein if there is a background scheme and no container/base scheme, the container inherits the background scheme which may cause the text to be unreadable
	const addContainerSchemeDefaultColors = containerModeColorScheme in colorSchemes && ! schemeHasValue( colorSchemes[ containerModeColorScheme ] ) &&
		(
			// Add default container scheme if background scheme has value
			( backgroundModeColorScheme in colorSchemes && schemeHasValue( colorSchemes[ backgroundModeColorScheme ] ) ) ||
			// Add default container scheme if there are color schemes other than the default scheme and background scheme
			( colorSchemesArray.length !== 2 )
		)

	if ( containerModeColorScheme in colorSchemes && schemeHasValue( colorSchemes[ containerModeColorScheme ] ) ) {
		decls = getCSS( colorSchemes[ containerModeColorScheme ], currentHoverState, 'container' )
		let containercss = ''
		if ( decls.desktop.length || decls.desktopHover.length ) {
			containercss += `.stk-container:where(:not(.stk--no-background)){ ${ [ ...decls.desktop, ...decls.desktopHover ].join( '' ) } }\n`
		}
		if ( decls.desktopParentHover.length ) {
			containercss += `.stk-container:where(:not(.stk--no-background):hover), :where(.stk-hover-parent:hover) .stk-container:where(:not(.stk--no-background)){ ${ decls.desktopParentHover.join( '' ) } }\n`
		}
		css += containercss
	} else if ( addContainerSchemeDefaultColors	) {
		const containercss = `.stk-container:where(:not(.stk--no-background)){ ${ getDefaultColors() } }\n`

		css += applyFilters( 'stackable.global-settings.global-color-schemes.default-container-scheme', containercss )
	}

	Object.entries( colorSchemes ).forEach( ( [ key, scheme ] ) => {
		if ( ! schemeHasValue( scheme ) ) {
			return
		}

		decls = getCSS( scheme, currentHoverState, 'background' )
		if ( decls.desktop.length || decls.desktopHover.length ) {
			rules.background.push( `.stk--background-scheme--${ key }{ ${ [ ...decls.desktop, ...decls.desktopHover, unsetDefaults ].join( '' ) } }` )
		}
		if ( decls.desktopParentHover.length ) {
			rules.background.push( `:where(.stk-hover-parent:hover) .stk--background-scheme--${ key }{ ${ [ ...decls.desktopParentHover, unsetDefaults ].join( '' ) } }` )
		}

		decls = getCSS( scheme, currentHoverState, 'container' )
		if ( decls.desktop.length || decls.desktopHover.length ) {
			rules.container.push( `.stk--container-scheme--${ key }{ ${ [ ...decls.desktop, ...decls.desktopHover ].join( '' ) } }` )
		}
		if ( decls.desktopParentHover.length ) {
			rules.container.push( `.stk--container-scheme--${ key }:where(:hover), :where(.stk-hover-parent:hover) .stk--container-scheme--${ key }{ ${ decls.desktopParentHover.join( '' ) } }` )
		}
	} )

	css += `${ rules.background.join( '\n' ) }`
	css += `${ rules.container.join( '\n' ) }`

	if ( returnCss ) {
		return css
	}

	setStyles( css )
}

export const GlobalColorSchemeStyles = () => {
	const {
		allColorSchemes,
		baseColorScheme,
		backgroundModeColorScheme,
		containerModeColorScheme,
	} = useBlockColorSchemes()

	const [ styles, setStyles ] = useState( '' )
	const [ currentHoverState ] = useBlockHoverState( { forceUpdateHoverState: true } )
	const editorEl = useSelect( select => {
		return select( 'stackable/editor-dom' ).getEditorDom()
	}, [] )

	useEffect( () => {
		if ( allColorSchemes && Array.isArray( allColorSchemes ) ) {
			renderGlobalColorSchemeStyles(
				setStyles,
				allColorSchemes,
				baseColorScheme,
				backgroundModeColorScheme,
				containerModeColorScheme,
				currentHoverState,
			)
		}
	}, [ allColorSchemes,
		baseColorScheme,
		backgroundModeColorScheme,
		containerModeColorScheme,
		currentHoverState,
	 ] )

	// Adds a class to the editor body DOM to indicate that there are global styles for `color schemes`.
	useEffect( () => {
		if ( editorEl ) {
			const addClassNames = editor => {
				const classNamesToAdd = []
				const classNamesToRemove = []
				if ( styles === '' ) {
					editor.classList.remove( 'stk--has-base-scheme', 'stk--has-background-scheme', 'stk--has-container-scheme' )
				} else {
					if ( ! styles.includes( ':root' ) ) {
						classNamesToRemove.push( 'stk--has-base-scheme' )
					} else if ( editor.classList.contains( 'stk--has-base-scheme' ) === false ) {
						classNamesToAdd.push( 'stk--has-base-scheme' )
					}

					if ( ! styles.includes( '.stk-block-background' ) ) {
						classNamesToRemove.push( 'stk--has-background-scheme' )
					} else if ( editor.classList.contains( 'stk--has-background-scheme' ) === false ) {
						classNamesToAdd.push( 'stk--has-background-scheme' )
					}

					if ( ! styles.includes( '.stk-container:where(:not(.stk--no-background))' ) ) {
						classNamesToRemove.push( 'stk--has-container-scheme' )
					} else if ( editor.classList.contains( 'stk--has-container-scheme' ) === false ) {
						classNamesToAdd.push( 'stk--has-container-scheme' )
					}

					editor.classList.add( ...classNamesToAdd )
					editor.classList.remove( ...classNamesToRemove )

					addFilter( 'stackable.global-styles.classnames', `stackable/global-settings.color-schemes`, classnames => {
					// Remove any classNamesToRemove from classnames
						const updatedClassnames = classnames.filter( name => ! classNamesToRemove.includes( name ) )
						// Add classNamesToAdd if not already present
						classNamesToAdd.forEach( name => {
							if ( ! updatedClassnames.includes( name ) ) {
								updatedClassnames.push( name )
							}
						} )
						return updatedClassnames
					} )
				}
			}

			addClassNames( editorEl )

			// At first load of the editor, the color scheme classnames removed, so we have to re-add it.
			const mo = onClassChange( editorEl, () => {
				addClassNames( editorEl )
			} )

			return () => mo.disconnect()
		}
	}, [ editorEl, styles ] )

	return styles
}
