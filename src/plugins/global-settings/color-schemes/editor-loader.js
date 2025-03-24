/**
 * Internal dependencies
 */
import {
	convertToObj, getCSS, schemeHasValue,
} from './utils'

/**
 * External dependencies
 */
import { useBlockColorSchemes, useBlockHoverState } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element'

const renderGlobalStyles = (
	setStyles,
	colorSchemesArray,
	baseColorScheme,
	backgroundModeColorScheme,
	containerModeColorScheme,
	currentHoverState,
) => {
	let css = '',
		decls

	const rules = {
		background: [],
		container: [],
	}
	const colorSchemes = convertToObj( colorSchemesArray )

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
			bgcss += `.stk-block-background{ ${ [ ...decls.desktop, ...decls.desktopHover ].join( '' ) } }\n`
		}
		if ( decls.desktopParentHover.length ) {
			bgcss += `:where(.stk-hover-parent:hover) .stk-block-background{ ${ decls.desktopParentHover.join( '' ) } }\n`
		}
		css += bgcss
	}

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
	}

	Object.entries( colorSchemes ).forEach( ( [ key, scheme ] ) => {
		if ( ! schemeHasValue( scheme ) ) {
			return
		}

		decls = getCSS( scheme, currentHoverState, 'background' )
		if ( decls.desktop.length || decls.desktopHover.length ) {
			rules.background.push( `.background-${ key }{ ${ [ ...decls.desktop, ...decls.desktopHover ].join( '' ) } }` )
		}
		if ( decls.desktopParentHover.length ) {
			rules.background.push( `:where(.stk-hover-parent:hover) .background-${ key }{ ${ decls.desktopParentHover.join( '' ) } }` )
		}

		decls = getCSS( scheme, currentHoverState, 'container' )
		if ( decls.desktop.length || decls.desktopHover.length ) {
			rules.container.push( `.container-${ key }{ ${ [ ...decls.desktop, ...decls.desktopHover ].join( '' ) } }` )
		}
		if ( decls.desktopParentHover.length ) {
			rules.container.push( `.container-${ key }:where(:hover), :where(.stk-hover-parent:hover) .container-${ key }{ ${ decls.desktopParentHover.join( '' ) } }` )
		}
	} )

	css += `${ rules.background.join( '\n' ) }`
	css += `${ rules.container.join( '\n' ) }`

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

	useEffect( () => {
		if ( allColorSchemes && Array.isArray( allColorSchemes ) ) {
			renderGlobalStyles(
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

	return styles
}
