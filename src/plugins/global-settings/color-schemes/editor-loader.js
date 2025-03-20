/**
 * Internal dependencies
 */
// import { hoverState } from '../utils'

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element'

/**
 * External dependencies
 */
import { useBlockColorSchemes, useBlockHoverState } from '~stackable/hooks'

const convertToObj = colorSchemes => {
	const obj = {}

	colorSchemes.forEach( scheme => {
		obj[ scheme.key ] = scheme.colorScheme
	} )

	return obj
}

const camelToKebab = property => {
	const result = property.replace( /([a-z0-9])([A-Z])/g, '$1-$2' )

	// Convert the result to lowercase and return with '--stk-' prefix
	return '--stk-' + result.toLowerCase()
}

const getInheritedValue = ( property, currentState ) => {
	let value = property?.[ currentState ]

	if ( ! value && currentState === 'desktopHover' ) {
		value = property?.desktopParentHover
	}

	if ( ! value && currentState !== 'desktop' ) {
		value = property?.desktop
	}

	return value
}

const isGradient = value => value?.startsWith( 'linear-' ) || value?.startsWith( 'radial-' )

const getCSS = ( scheme, mode = '' ) => {
	const states = [ 'desktop', 'desktopHover', 'desktopParentHover' ]
	const properties = [
		'backgroundColor',
		'headingColor',
		'textColor',
		'linkColor',
		'accentColor',
		'buttonBackgroundColor',
		'buttonTextColor',
		'buttonOutlineColor',
	]

	const decls = {
		desktop: [],
		desktopHover: [],
		desktopParentHover: [],
	}

	states.forEach( state => {
		const suffix = state === 'desktopHover' ? '-hover' : ''
		properties.forEach( property => {
			const varname = mode === 'background' ? 'block' : 'container'
			const customProperty = property === 'backgroundColor'
				? `--stk-${ varname }-background-color` : camelToKebab( property )
			if ( property === 'backgroundColor' && ! mode ) {
				return
			}

			if ( scheme[ property ]?.[ state ] ) {
				decls[ state ].push( `${ customProperty }${ suffix }: ${ scheme[ property ]?.[ state ] };` )
				return
			}

			const inheritedValue = getInheritedValue( scheme[ property ], state )
			if ( state === 'desktopHover' && ! scheme[ property ]?.[ state ] && inheritedValue ) {
				decls[ state ].push( `${ customProperty }${ suffix }: ${ inheritedValue };` )
			}

			if ( property === 'buttonBackgroundColor' && isGradient( scheme[ property ]?.[ state ] ) ) {
				decls[ state ].push( `:where(.is-style-plain){ --stk-button-plain-text-color${ suffix }: var(--stk-button-outline-color${ suffix }); }` )
			}
		} )
	} )

	if ( isGradient( scheme.buttonBackgroundColor?.desktop ) && ! scheme.buttonBackgroundColor?.desktopHover ) {
		decls.desktopHover.push( `:where(.is-style-plain){ --stk-button-plain-text-color-hover: var(--stk-button-outline-color-hover); }` )
	}

	if ( isGradient( scheme.buttonBackgroundColor?.desktopParentHover ) && ! scheme.buttonBackgroundColor?.desktopHover ) {
		decls.desktopParentHover.push( `:where(.is-style-plain){ --stk-button-plain-text-color-hover: var(--stk-button-outline-color-hover); }` )
	}

	if ( isGradient( scheme.buttonBackgroundColor?.desktop ) &&
		scheme.buttonBackgroundColor?.desktopParentHover && ! isGradient( scheme.buttonBackgroundColor?.desktopParentHover ) ) {
		decls.desktopParentHover.push( `:where(.is-style-plain){ --stk-button-plain-text-color: unset;--stk-button-plain-text-color-hover:unset; }` )
	}

	return decls
}

const renderGlobalStyles = (
	setStyles,
	colorSchemesArray,
	baseColorScheme,
	backgroundModeColorScheme,
	containerModeColorScheme,
	// currentHoverState = 'normal',
) => {
	let css = '',
		decls

	const rules = {
		background: [],
		container: [],
	}
	const colorSchemes = convertToObj( colorSchemesArray )

	if ( baseColorScheme in colorSchemes ) {
		decls = getCSS( colorSchemes[ baseColorScheme ] )
		if ( decls.desktop.length || decls.desktopHover.length ) {
			css += `:root{ ${ [ ...decls.desktop, ...decls.desktopHover ].join( '' ) } }\n`
		}
	}

	if ( backgroundModeColorScheme in colorSchemes ) {
		decls = getCSS( colorSchemes[ backgroundModeColorScheme ], 'background' )
		let bgcss = ''
		if ( decls.desktop.length || decls.desktopHover.length ) {
			bgcss += `.stk-block-background{ ${ [ ...decls.desktop, ...decls.desktopHover ].join( '' ) } }\n`
		}
		if ( decls.desktopParentHover.length ) {
			bgcss += `:where(.stk-hover-parent:hover) .stk-block-background{ ${ decls.desktopParentHover.join( '' ) } }\n`
		}
		css += bgcss
	}

	if ( containerModeColorScheme in colorSchemes ) {
		decls = getCSS( colorSchemes[ containerModeColorScheme ], 'container' )
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
		decls = getCSS( scheme, 'background' )
		if ( decls.desktop.length || decls.desktopHover.length ) {
			rules.background.push( `.background-${ key }{ ${ [ ...decls.desktop, ...decls.desktopHover ].join( '' ) } }` )
		}
		if ( decls.desktopParentHover.length ) {
			rules.background.push( `:where(.stk-hover-parent:hover) .background-${ key }{ ${ decls.desktopParentHover.join( '' ) } }` )
		}

		decls = getCSS( scheme, 'container' )
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

	const [ currentHoverState ] = useBlockHoverState( { forceUpdateHoverState: true } )

	const [ styles, setStyles ] = useState( '' )

	useEffect( () => {
		if ( allColorSchemes && Array.isArray( allColorSchemes ) && allColorSchemes.length ) {
			renderGlobalStyles(
				setStyles,
				allColorSchemes,
				baseColorScheme,
				backgroundModeColorScheme,
				containerModeColorScheme,
				currentHoverState
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
