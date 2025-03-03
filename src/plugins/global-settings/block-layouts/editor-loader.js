/**
 * Internal dependencies
 */
import { getDefault } from './utils'

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data'
import { useEffect, useState } from '@wordpress/element'

/**
 * External dependencies
 */
import { compact } from 'lodash'
import { useBlockHoverState } from '~stackable/hooks'

const renderGlobalStyles = ( blockLayouts, setStyles, currentHoverState, blockUniqueId, parentHoverBlock, breakDesktop = 1024, breakTablet = 768 ) => {
	if ( Object.keys( blockLayouts ).length === 0 ) {
		setStyles( '' )
		return
	}
	let css = ''

	const deviceCss = {
		desktop: [],
		tablet: [],
		mobile: [],
	}

	const getUnit = ( property, state ) => {
		return blockLayouts[ property ][ `${ state }Unit` ] ?? 'px'
	}

	const getValue = ( _property, device, state, value, unit ) => {
		let property = _property

		if ( state === 'parent-hover' && currentHoverState === 'parent-hover' && blockUniqueId && parentHoverBlock ) {
			property += '-hover'
		} else if ( state !== 'normal' ) {
			property += `-${ state }`
		}

		let style = ''
		if ( typeof value === 'string' ) {
			style = `${ property }: ${ value };`
		} else if ( typeof value === 'object' ) {
			const defaultValue = getDefault( _property, device )
			const top = value.top !== undefined ? value.top : defaultValue.top
			const right = value.right !== undefined ? value.right : defaultValue.right
			const bottom = value.bottom !== undefined ? value.bottom : defaultValue.bottom
			const left = value.left !== undefined ? value.left : defaultValue.left

			style = `${ property }: ${ top }${ unit } ${ right }${ unit } ${ bottom }${ unit } ${ left }${ unit };`
		} else {
			style = `${ property }: ${ value }${ unit };`
		}

		if ( currentHoverState === 'parent-hover' && state === 'parent-hover' && blockUniqueId && parentHoverBlock ) {
			style = `.stk--is-hovered.stk-${ blockUniqueId }{ ${ style } }`
		}

		return style
	}

	Object.keys( blockLayouts ).forEach( property => {
		const values = Object.keys( blockLayouts[ property ] )
			.filter( key => key.indexOf( 'Unit' ) === -1 )
			.reduce( ( _blockLayouts, key ) => {
		  return {
					..._blockLayouts,
					[ key ]: blockLayouts[ property ][ key ],
		  }
			}, {} )

		Object.entries( values ).forEach( ( [ state, value ] ) => {
			const unit = getUnit( property, state )

			const device = state.includes( 'desktop' ) ? 'desktop' : ( state.includes( 'tablet' ) ? 'tablet' : 'mobile' )
			const hoverState = state.includes( 'ParentHover' ) ? 'parent-hover' : ( state.includes( 'Hover' ) ? 'hover' : 'normal' )

			deviceCss[ device ].push( getValue( property, device, hoverState, value, unit ) )
		} )
	} )

	if ( deviceCss.desktop.length > 0 ) {
		css += `:root { ${ compact( deviceCss.desktop ).join( '' ) }}`
	}

	if ( deviceCss.tablet.length > 0 ) {
		css += `@media screen and (max-width: ${ breakDesktop - 1 }px){ :root { ${ compact( deviceCss.tablet ).join( '' ) }}}`
	}

	if ( deviceCss.mobile.length > 0 ) {
		css += `@media screen and (max-width: ${ breakTablet - 1 }px){:root { ${ compact( deviceCss.mobile ).join( '' ) }}}`
	}

	setStyles( css )
}

export const GlobalBlockLayoutStyles = () => {
	const {
		blockLayouts, selectedBlockUniqueId, SelectedParentHoverBlock,
	} = useSelect( select => ( {
		blockLayouts: select( 'stackable/global-block-layouts' ).getBlockLayouts() || [],
		selectedBlockUniqueId: select( 'core/block-editor' ).getSelectedBlock()?.attributes?.uniqueId,
		SelectedParentHoverBlock: select( 'stackable/hover-state' ).getSelectedParentHoverBlock(),
		SelectedParentHoverBlockChildren: select( 'stackable/hover-state' ).getSelectedParentHoverBlockChildren(),
		SelectedHoverChildren: select( 'stackable/hover-state' ).getSelectedHoverChildren(),
	} ), [] )

	const [ currentHoverState ] = useBlockHoverState( { forceUpdateHoverState: true } )
	const [ styles, setStyles ] = useState( '' )

	useEffect( () => {
		if ( blockLayouts && typeof blockLayouts === 'object' ) {
			renderGlobalStyles( blockLayouts, setStyles, currentHoverState, selectedBlockUniqueId, SelectedParentHoverBlock )
		}
	}, [ blockLayouts, currentHoverState, SelectedParentHoverBlock ] )

	return styles
}
