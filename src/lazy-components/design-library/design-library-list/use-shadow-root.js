import { wpGlobalStylesInlineCss } from 'stackable'
import { getAdditionalStylesForPreview } from '../util'

import {
	useEffect, useRef, useState,
} from '@wordpress/element'
import { useSelect } from '@wordpress/data'
import { applyFilters } from '@wordpress/hooks'

export const useShadowRoot = shouldRender => {
	const hostRef = useRef( null )
	const [ shadowRoot, setShadowRoot ] = useState( null )
	const [ stylesLoaded, setStylesLoaded ] = useState( 0 )

	const { getEditorDom } = useSelect( 'stackable/editor-dom' )
	const editorDom = getEditorDom()

	const STYLE_IDS = applyFilters( 'stackable.global-styles.ids', [
		'ugb-dep-native-global-style-css-nodep-inline-css',
		'ugb-style-css-css',
		'ugb-style-css-responsive-css',
		'ugb-block-style-inheritance-nodep-inline-css',
		'ugb-style-css-premium-css',
	] )

	useEffect( () => {
		if ( ! shouldRender || ! hostRef.current ) {
			return
		}

		const hadShadow = !! hostRef.current.shadowRoot
		const shadow = hostRef.current.shadowRoot || hostRef.current.attachShadow( { mode: 'open' } )

		if ( ! hadShadow ) {
			setStylesLoaded( 0 )

			// Track existing style/link nodes in the shadow root to avoid duplicates
			const existingIds = new Set(
				Array.from( shadow.querySelectorAll( 'style[id],link[id]' ) ).map( n => n.id )
			)

			const styleNodes = STYLE_IDS.map( id => {
				let style = null
				let node = null

				if ( document && document.head ) {
					node = document.head.querySelector( `#${ id }` )
				}

				if ( ! node && editorDom ) {
					const editorBody = editorDom?.closest( 'body' )
					const editorHead = editorBody?.ownerDocument?.head
					node = editorHead.querySelector( `#${ id }` )
				}

				if ( node ) {
					style = node.cloneNode( true )
				}

				return style
			} ).filter( node => node !== null )

			// Add global and theme styles
			if ( ! existingIds.has( 'global-styles-inline-css' ) ) {
				const globalStylesNode = document.createElement( 'style' )
				globalStylesNode.setAttribute( 'id', 'global-styles-inline-css' )
				globalStylesNode.innerHTML = wpGlobalStylesInlineCss
				styleNodes.push( globalStylesNode )
			}

			if ( ! existingIds.has( 'stk-design-library-styles' ) ) {
				const hostStyles = document.createElement( 'style' )
				hostStyles.setAttribute( 'id', 'stk-design-library-styles' )

				// Additional styles for blocks to render properly in the preview
				hostStyles.innerHTML += getAdditionalStylesForPreview()
				styleNodes.push( hostStyles )
			}

			styleNodes.forEach( node => {
				if ( node.id && existingIds.has( node.id ) ) {
					return
				}

				if ( node.href ) {
					node.onload = () => {
						setStylesLoaded( prev => prev + 1 )
					}
					node.onerror = () => {
						setStylesLoaded( prev => prev + 1 )
					}
				}

				if ( node.textContent ) {
					// we use :host in the shadow DOM to target the root
					node.textContent = node.textContent.replace( /:root/g, ':host' )
				}
				shadow.appendChild( node )

				if ( node.id ) {
					existingIds.add( node.id )
				}
			} )
		}

		setShadowRoot( shadow )
	}, [ shouldRender ] )

	return {
		hostRef, shadowRoot, stylesLoaded,
	}
}
