/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data'
import { useEffect, useState } from '@wordpress/element'

/**
 * External dependencies
 */
import { useBlockColorSchemes } from '~stackable/hooks'

const extractModeScheme = className => {
	const match = className.match( /^([a-zA-Z]+)-(.+)$/ )

	return match ? { mode: match[ 1 ], key: match[ 2 ] } : false
}

const convertToObj = colorSchemes => {
	const obj = {}

	colorSchemes.forEach( scheme => {
		obj[ scheme.key ] = scheme.colorScheme
	} )

	return obj
}

const renderGlobalStyles = ( colorSchemesArray, colorSchemesInUse, setStyles ) => {
	let css = ''

	const colorSchemes = convertToObj( colorSchemesArray )

	colorSchemesInUse.forEach( className => {
		const { mode, key } = extractModeScheme( className )
		const scheme = colorSchemes[ key ]

		if ( scheme?.backgroundColor ) {
			const varname = mode === 'background' ? 'block' : 'container'
			const decl = `--stk-${ varname }-background-color: ${ scheme.backgroundColor.desktop };`
			css += `.${ className } { ${ decl } }`
		}
	} )

	setStyles( css )
}

export const GlobalColorSchemeStyles = () => {
	const {
		allColorSchemes, colorSchemesInUse, initializeColorSchemesInUse,
	} = useBlockColorSchemes()
	const initClientIds = select( 'core/block-editor' ).getClientIdsWithDescendants()

	const [ styles, setStyles ] = useState( '' )

	useEffect( () => {
		if ( initClientIds && initClientIds.length > 0 ) {
			initializeColorSchemesInUse( initClientIds )
		}
	}, [ initClientIds ] )

	useEffect( () => {
		if ( allColorSchemes && Array.isArray( allColorSchemes ) && allColorSchemes.length ) {
			renderGlobalStyles( allColorSchemes, colorSchemesInUse, setStyles )
		}
	}, [ allColorSchemes, colorSchemesInUse ] )

	return styles
}
