/**
 * Internal dependencies
 */
import { hoverState } from '../utils'

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element'

/**
 * External dependencies
 */
import { useBlockColorSchemes } from '~stackable/hooks'

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
	return property?.[ currentState ] || property?.desktop
}

const generateRules = ( scheme, currentHoverState = 'normal', mode = '', appendSuffix = false ) => {
	const decls = []
	const state = `desktop${ hoverState[ currentHoverState ] }`
	let suffix = ''
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

	if ( appendSuffix ) {
		suffix = currentHoverState !== 'normal' ? `-${ currentHoverState }` : ''
	}

	properties.forEach( property => {
		if ( property === 'backgroundColor' ) {
			if ( mode && scheme[ property ]?.desktop ) {
				const varname = mode === 'background' ? 'block' : 'container'
				decls.push( `--stk-${ varname }-background-color${ suffix }: ${ getInheritedValue( scheme[ property ], state ) };` )
			}
			return
		}

		if ( scheme[ property ]?.desktop ) {
			const customProperty = camelToKebab( property )
			decls.push( `${ customProperty }${ suffix }: ${ getInheritedValue( scheme[ property ], state ) };` )
		}
	} )

	return decls.join( ' ' )
}

const renderGlobalStyles = (
	setStyles,
	colorSchemesArray,
	baseColorScheme,
	backgroundModeColorScheme,
	containerModeColorScheme,
	currentHoverState = 'normal',
) => {
	let css = ''

	const rules = {
		background: [],
		container: [],
	}
	const colorSchemes = convertToObj( colorSchemesArray )

	let decls,
		scheme

	if ( baseColorScheme in colorSchemes ) {
		scheme = colorSchemes[ baseColorScheme ]
		decls = generateRules( scheme, currentHoverState )
		css += `:root { ${ decls } }`
	}

	if ( backgroundModeColorScheme in colorSchemes ) {
		scheme = colorSchemes[ backgroundModeColorScheme ]
		decls = generateRules( scheme, currentHoverState, 'background' )
		css += `.stk-block-background { ${ decls } }`
	}

	if ( containerModeColorScheme in colorSchemes ) {
		scheme = colorSchemes[ containerModeColorScheme ]
		decls = generateRules( scheme, currentHoverState, 'container' )
		css += `.stk-container:where(:not(.stk--no-background)) { ${ decls } }`
	}

	Object.entries( colorSchemes ).forEach( ( [ key, scheme ] ) => {
		const backgrounds = generateRules( scheme, currentHoverState, 'background' )
		rules.background.push( `.background-${ key }{ ${ backgrounds } }` )

		const containers = generateRules( scheme, currentHoverState, 'container' )
		rules.container.push( `.container-${ key }{ ${ containers } }` )
	} )

	css += `${ rules.background.join( ' ' ) }`
	css += `${ rules.container.join( ' ' ) }`

	setStyles( css )
}

export const GlobalColorSchemeStyles = () => {
	const {
		allColorSchemes,
		baseColorScheme,
		backgroundModeColorScheme,
		containerModeColorScheme,
	} = useBlockColorSchemes()

	// const [ currentHoverState ] = useBlockHoverState( { forceUpdateHoverState: true } )

	const [ styles, setStyles ] = useState( '' )

	useEffect( () => {
		if ( allColorSchemes && Array.isArray( allColorSchemes ) && allColorSchemes.length ) {
			renderGlobalStyles(
				setStyles,
				allColorSchemes,
				baseColorScheme,
				backgroundModeColorScheme,
				containerModeColorScheme,
				// currentHoverState
			)
		}
	}, [ allColorSchemes,
		baseColorScheme,
		backgroundModeColorScheme,
		containerModeColorScheme,
		// currentHoverState,
	 ] )

	return styles
}
