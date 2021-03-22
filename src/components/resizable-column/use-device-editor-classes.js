import { useEffect } from '@wordpress/element'
import { throttle } from 'lodash'

let editorEl = null

const addDeviceTypeClass = throttle( previewDeviceType => {
	if ( ! editorEl ) {
		editorEl = document.querySelector( '#editor' )
	}
	if ( editorEl && ! editorEl.classList.contains( `stk-preview-device-${ previewDeviceType.toLowerCase() }` ) ) {
		editorEl.classList.remove( 'stk-preview-device-desktop', 'stk-preview-device-tablet', 'stk-preview-device-mobile' )
		editorEl.classList.add( `stk-preview-device-${ previewDeviceType.toLowerCase() }` )
	}
}, 100 )

export const useDeviceEditorClasses = previewDeviceType => {
	useEffect( () => {
		addDeviceTypeClass( previewDeviceType )
	}, [ previewDeviceType ] )
}
