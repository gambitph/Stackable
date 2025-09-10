import { wpGlobalStylesInlineCss } from 'stackable'
import { getAdditionalStylesForPreview } from './util'

import { useEffect, useRef } from '@wordpress/element'
import { useSelect } from '@wordpress/data'
import { applyFilters } from '@wordpress/hooks'

export const useShadowRoot = () => {
	const hostRef = useRef( null )
	const shadowRoot = useRef( null )

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
	  if ( hostRef.current ) {
			const shadow = hostRef.current.shadowRoot || hostRef.current.attachShadow( { mode: 'open' } )

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
			const globalStylesNode = document.createElement( 'style' )
			globalStylesNode.setAttribute( 'id', 'global-styles-inline-css' )
			globalStylesNode.innerHTML = wpGlobalStylesInlineCss
			styleNodes.push( globalStylesNode )

			const hostStyles = document.createElement( 'style' )
			hostStyles.setAttribute( 'id', 'stk-design-library-styles' )

			// Additional styles for blocks to render properly in the preview
			hostStyles.innerHTML += getAdditionalStylesForPreview()

			styleNodes.push( hostStyles )

			styleNodes.forEach( node => {
				if ( node.textContent ) {
					// we use :host in the shadow DOM to target the root
					node.textContent = node.textContent.replace( /:root/g, ':host' )
				}
				shadow.appendChild( node )
			} )

			shadowRoot.current = shadow
	  }
	}, [] )

	return { hostRef, shadowRoot: shadowRoot.current }
}
