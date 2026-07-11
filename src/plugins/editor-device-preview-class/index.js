/**
 * Adds the stk-preview-device-desktop/tablet/mobile classes to the
 * .editor-styles-wrapper or iframe wrapper. This class is used to simulate
 * breakpoints.
 */

/**
 * External dependencies
 */
import { useDeviceType, useBlockHoverState } from '~stackable/hooks'
import { onClassChange } from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	useEffect, useLayoutEffect, useRef,
} from '@wordpress/element'
import { useSelect } from '@wordpress/data'
import { registerPlugin } from '@wordpress/plugins'
import { addFilter } from '@wordpress/hooks'

const THEME_REGEX = /stk--is-\w+-theme/gm
let themeFilterAdded = false

const applyEditorPreviewClasses = ( editorEl, deviceType, currentHoverState ) => {
	if ( ! editorEl ) {
		return
	}

	const deviceClass = `stk-preview-device-${ deviceType.toLowerCase() }`
	if ( ! editorEl.classList.contains( deviceClass ) ) {
		editorEl.classList.remove( 'stk-preview-device-desktop', 'stk-preview-device-tablet', 'stk-preview-device-mobile' )
		editorEl.classList.add( deviceClass )
	}

	const hoverClass = `stk-preview-state--${ currentHoverState }`
	if ( ! editorEl.classList.contains( hoverClass ) ) {
		editorEl.classList.remove( 'stk-preview-state--normal', 'stk-preview-state--hover', 'stk-preview-state--parent-hover', 'stk-preview-state--collapsed' )
		editorEl.classList.add( hoverClass )
	}

	const bodyClass = document.querySelector( 'body' )?.className || ''
	const bodyTheme = bodyClass.match( THEME_REGEX )
	if ( bodyTheme && ! editorEl.className.match( THEME_REGEX ) ) {
		const theme = bodyTheme[ 0 ]
		editorEl.classList.add( theme )
		if ( ! themeFilterAdded ) {
			themeFilterAdded = true
			addFilter( 'stackable.global-styles.classnames', 'stackable/theme-classname', styleIds => {
				styleIds.push( theme )
				return styleIds
			} )
		}
	}
}

const EditorPreviewClass = () => {
	const deviceType = useDeviceType()
	const [ currentHoverState ] = useBlockHoverState( { forceUpdateHoverState: true } )
	const editorEl = useSelect( select => {
		return select( 'stackable/editor-dom' ).getEditorDom()
	}, [] )

	const deviceTypeRef = useRef( deviceType )
	const hoverStateRef = useRef( currentHoverState )
	deviceTypeRef.current = deviceType
	hoverStateRef.current = currentHoverState

	// Apply classes before paint when the preview size or editor target changes.
	useLayoutEffect( () => {
		applyEditorPreviewClasses( editorEl, deviceType, currentHoverState )
	}, [ editorEl, deviceType, currentHoverState ] )

	// At first load of the editor, Gutenberg can strip our classes — re-add them.
	useEffect( () => {
		if ( ! editorEl ) {
			return undefined
		}

		const unsubscribe = onClassChange( editorEl, () => {
			applyEditorPreviewClasses( editorEl, deviceTypeRef.current, hoverStateRef.current )
		} )

		return unsubscribe
	}, [ editorEl ] )

	return null
}

registerPlugin( 'stackable-editor-device-preview-class', {
	render: EditorPreviewClass,
} )
