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
	const tabletCss = []
	const mobileCss = []

	const getUnit = ( property, state ) => {
		return blockLayouts[ property ][ `${ state }Unit` ] ?? 'px'
	}

	const getValue = ( _property, state, value, unit ) => {
		let property = _property

		if ( state.indexOf( 'ParentHover' ) !== -1 ) {
			property += '-parent-hover'
		} else if ( state.indexOf( 'Hover' ) !== -1 ) {
			property += '-hover'
		}

		if ( property.indexOf( 'shadow' ) !== -1 ) {
			return `${ property }: ${ value };`
		}

		if ( typeof value === 'object' ) {
			return `${ property }: ${ value.top }${ unit } ${ value.right }${ unit } ${ value.left }${ unit } ${ value.bottom }${ unit };`
		}

		return `${ property }: ${ value }${ unit };`
	}

	Object.keys( blockLayouts ).forEach( property => {
		const values = Object.keys( blockLayouts[ property ] )
			.filter( key => key.indexOf( 'Unit' ) === -1 )
			.reduce( ( obj, key ) => {
		  return {
					...obj,
					[ key ]: blockLayouts[ property ][ key ],
		  }
			}, {} )

		Object.entries( values ).forEach( ( [ state, value ] ) => {
			const unit = getUnit( property, state )

			if ( state.indexOf( 'desktop' ) !== -1 ) {
				desktopCss.push( getValue( property, state, value, unit ) )
			}

			if ( state.indexOf( 'tablet' ) !== -1 ) {
				tabletCss.push( getValue( property, state, value, unit ) )
			}

			if ( state.indexOf( 'mobile' ) !== -1 ) {
				mobileCss.push( getValue( property, state, value, unit ) )
			}
		} )
	} )

	css += `:root { ${ compact( desktopCss ).join( '' ) }}`

	if ( tabletCss.length > 0 ) {
		css += `@media screen and (max-width: ${ breakDesktop - 1 }px){ :root { ${ compact( tabletCss ).join( '' ) }} }`
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
