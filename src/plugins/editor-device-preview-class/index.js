/**
 * Adds the stk-preview-device-desktop/tablet/mobile classes to the
 * .editor-styles-wrapper or iframe wrapper. This class is used to simulate
 * breakpoints.
 */

/**
 * External dependencies
 */
import { useDeviceType, useBlockHoverState } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element'
import { useSelect } from '@wordpress/data'
import { registerPlugin } from '@wordpress/plugins'
import { addFilter } from '@wordpress/hooks'

const EditorPreviewClass = () => {
	const deviceType = useDeviceType()
	const [ currentHoverState ] = useBlockHoverState( { forceUpdateHoverState: true } )
	const editorEl = useSelect( select => {
		return select( 'stackable/editor-dom' ).getEditorDom()
	}, [] )

	// Update the editor class when the preview size changes.
	useEffect( () => {
		const themeRegex = /stk--is-\w+-theme/gm

		if ( editorEl ) {
			// Add device class
			if ( editorEl && editorEl.classList.contains( `stk-preview-device-${ deviceType.toLowerCase() }` ) === false ) {
				editorEl.classList.remove( 'stk-preview-device-desktop', 'stk-preview-device-tablet', 'stk-preview-device-mobile' )
				editorEl.classList.add( `stk-preview-device-${ deviceType.toLowerCase() }` )
			}

			// Add hover state class
			// Dev note: This allows us to easily add CSS rules for each hover state in global styles.
			if ( editorEl && editorEl.classList.contains( `stk-preview-state--${ currentHoverState }` ) === false ) {
				editorEl.classList.remove( 'stk-preview-state--normal', 'stk-preview-state--hover', 'stk-preview-state--parent-hover', 'stk-preview-state--collapsed' )
				editorEl.classList.add( `stk-preview-state--${ currentHoverState }` )
			}

			// Add theme class
			if ( document.querySelector( 'body' ).className.match( themeRegex ) && ! editorEl.className.match( themeRegex ) ) {
				const theme = document.querySelector( 'body' ).className.match( themeRegex )[ 0 ]
				editorEl.classList.add( theme )
				addFilter( 'stackable.global-styles.classnames', 'stackable/theme-classname', styleIds => {
					styleIds.push( theme )
					return styleIds
				} )
			}

			// At first load of the editor, the `stk-preview-device-*` and `stk--is-*-theme` are removed, so we have to re-add it.
			const mo = onClassChange( editorEl, () => {
				if ( editorEl?.classList.contains( `stk-preview-device-${ deviceType.toLowerCase() }` ) === false ) {
					editorEl.classList.remove( 'stk-preview-device-desktop', 'stk-preview-device-tablet', 'stk-preview-device-mobile' )
					editorEl.classList.add( `stk-preview-device-${ deviceType.toLowerCase() }` )
				}
				if ( editorEl?.classList.contains( `stk-preview-state--${ currentHoverState }` ) === false ) {
					editorEl.classList.remove( 'stk-preview-state--normal', 'stk-preview-state--hover', 'stk-preview-state--parent-hover', 'stk-preview-state--collapsed' )
					editorEl.classList.add( `stk-preview-state--${ currentHoverState }` )
				}
				if ( document.querySelector( 'body' ).className.match( themeRegex ) && ! editorEl.className.match( themeRegex ) ) {
					const theme = document.querySelector( 'body' ).className.match( themeRegex )[ 0 ]
					editorEl.classList.add( theme )
					addFilter( 'stackable.global-styles.classnames', 'stackable/theme-classname', styleIds => {
						styleIds.push( theme )
						return styleIds
					} )
				}
			} )

			return () => mo.disconnect()
		}
	}, [ editorEl, deviceType, currentHoverState ] )

	return null
}

registerPlugin( 'stackable-editor-device-preview-class', {
	render: EditorPreviewClass,
} )

// Listener when a class is changed on an element.
const onClassChange = ( node, callback ) => {
	let lastClassString = node.classList.toString()

	const mutationObserver = new MutationObserver( mutationList => {
		for ( const item of mutationList ) {
			if ( item.attributeName === 'class' ) {
				const classString = node.classList.toString()
				if ( classString !== lastClassString ) {
					callback( mutationObserver )
					lastClassString = classString
					break
				}
			}
	  }
	} )

	mutationObserver.observe( node, { attributes: true } )

	return mutationObserver
}
