/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data'
import { useEffect, useState } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

/**
 * External dependencies
 */
import { compact } from 'lodash'
import { useBlockHoverState } from '~stackable/hooks'
/*
:root { --stk-container-border-radius: 10px 10px 10px 10px; :where(.stk--is-hovered, .stk-block:hover) {--stk-container-border-radius: 50px 50px 50px 50px;}}
 */

const transformToNested = ( _blockLayouts ) => {
	const devices = [ "desktop", "tablet", "mobile" ]

	const blockLayouts = {}

	for ( const property in _blockLayouts ) {
		blockLayouts[ property ] = {}

		devices.forEach( device => {
			blockLayouts[ property ][ device ] = {}

			if ( typeof blockLayouts[ property ][ `${ device }` ] !== undefined ) {
				blockLayouts[ property ][ device ][ 'normal' ] = blockLayouts[ property ][ `${ device }` ]
			}

			if ( typeof blockLayouts[ property ][ `${ device }Hover` ] !== undefined ) {
				blockLayouts[ property ][ device ][ 'hover' ] = blockLayouts[ property ][ `${ device }Hover` ]
			}

			if ( typeof blockLayouts[ property ][ `${ device }ParentHover` ] !== undefined ) {
				blockLayouts[ property ][ device ][ 'parent-hover' ] = blockLayouts[ property ][ `${ device }ParentHover` ]
			}
		} )
	}

	return blockLayouts
}

const renderGlobalStyles = ( blockLayouts, setStyles, currentHoverState, blockUniqueId, parentHoverBlock, breakDesktop = 1024, breakTablet = 768 ) => {
	if ( Object.keys( blockLayouts ).length === 0 ) {
		setStyles( '' )
		return
	}
	let css = ''

	const deviceCss = {
		'desktop': [],
		'tablet': [],
		'mobile': []
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
		if ( property.includes( 'shadow' ) ) {
			style = `${ property }: ${ value };`
		} else if ( typeof value === 'object' ) {
			style = `${ property }: ${ value.top }${ unit } ${ value.right }${ unit } ${ value.left }${ unit } ${ value.bottom }${ unit };`
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
		css += `@media screen and (max-width: ${ breakDesktop - 1 }px){ :root { ${ compact( deviceCss.tablet ).join( '' ) }} }`
	}

	if ( deviceCss.mobile.length > 0 ) {
		css += `@media screen and (max-width: ${ breakTablet - 1 }px){:root { ${ compact( deviceCss.mobile ).join( '' ) }}}`
	}

	setStyles( css )
}

export const GlobalBlockLayoutStyles = () => {
	const { blockLayouts, selectedBlockUniqueId, SelectedParentHoverBlock,SelectedParentHoverBlockChildren, SelectedHoverChildren } = useSelect( select => ( {
		blockLayouts: select( 'stackable/global-block-layouts' ).getBlockLayouts() || [],
		selectedBlockUniqueId: select( 'core/block-editor' ).getSelectedBlock()?.attributes?.uniqueId,
		SelectedParentHoverBlock: select( 'stackable/hover-state').getSelectedParentHoverBlock(),
		SelectedParentHoverBlockChildren: select( 'stackable/hover-state').getSelectedParentHoverBlockChildren(),
		SelectedHoverChildren: select( 'stackable/hover-state').getSelectedHoverChildren()
	} ), [] )

	const [ currentHoverState ] = useBlockHoverState( { globalControl: true } )
	const [ styles, setStyles ] = useState( '' )

	useEffect( () => {
		if ( blockLayouts && typeof blockLayouts === 'object' ) {
			renderGlobalStyles( blockLayouts, setStyles, currentHoverState, selectedBlockUniqueId, SelectedParentHoverBlock )
		}
	}, [ JSON.stringify( blockLayouts ), currentHoverState, SelectedParentHoverBlock ] )

	return styles
}
