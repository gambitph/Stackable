/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data'
import { useEffect, useState } from '@wordpress/element'

/**
 * External dependencies
 */
import { compact } from 'lodash'
/*
:root { --stk-container-border-radius: 10px 10px 10px 10px; :where(.stk--is-hovered, .stk-block:hover) {--stk-container-border-radius: 50px 50px 50px 50px;}}
 */
const renderGlobalStyles = ( blockLayouts, setStyles, breakDesktop = 1024, breakTablet = 768 ) => {
	if ( Object.keys( blockLayouts ).length === 0 ) {
		setStyles( '' )
		return
	}
	let css = ''

	const desktopCss = []
	const tabletMobileCss = []
	const tabletCss = []
	const mobileCss = []

	const getDeclaration = ( property, value ) => {
		if ( typeof value === 'object' ) {
			return `${ property }: ${ value.top }px ${ value.right }px ${ value.left }px ${ value.bottom }px;`
		}

		return `${ property }: ${ value };`
	}

	Object.keys( blockLayouts ).forEach( property => {
		const desktop = blockLayouts[ property ].desktop
		const tablet = blockLayouts[ property ].tablet
		const mobile = blockLayouts[ property ].mobile

		if ( desktop ) {
			desktopCss.push( getDeclaration( property, desktop ) )
		}

		if ( tablet && mobile ) {
			tabletCss.push( getDeclaration( property, tablet ) )
		} else if ( tablet && ! mobile ) {
			tabletMobileCss.push( getDeclaration( property, tablet ) )
		}

		if ( mobile ) {
			mobileCss.push( getDeclaration( property, mobile ) )
		}
	} )

	css += `:root { ${ compact( desktopCss ).join( '' ) }}`

	if ( tabletMobileCss.length > 0 ) {
		css += `@media screen and (max-width: ${ breakDesktop - 1 }px){ :root { ${ compact( tabletMobileCss ).join( '' ) }} }`
	}

	if ( tabletCss.length > 0 ) {
		css += `@media screen and (min-width: ${ breakTablet }px) and (max-width: ${ breakDesktop - 1 }px){:root { ${ compact( tabletCss ).join( '' ) }}}`
	}

	if ( mobileCss.length > 0 ) {
		css += `@media screen and (max-width: ${ breakTablet - 1 }px){:root { ${ compact( mobileCss ).join( '' ) }}}`
	}

	setStyles( css )
}

export const GlobalBlockLayoutStyles = () => {
	const { blockLayouts } = useSelect( select => ( {
		blockLayouts: select( 'stackable/global-block-layouts' ).getBlockLayouts() || [],
	} ), [] )

	const [ styles, setStyles ] = useState( '' )

	useEffect( () => {
		if ( blockLayouts && typeof blockLayouts === 'object' ) {
			renderGlobalStyles( blockLayouts, setStyles )
		}
	}, [ JSON.stringify( blockLayouts ) ] )

	return styles
}
