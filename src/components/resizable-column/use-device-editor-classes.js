import { useEffect } from '@wordpress/element'
import { throttle } from 'lodash'
import { useDeviceType } from '~stackable/hooks'

const addDeviceTypeClass = throttle( previewDeviceType => {
	const editorEl = document.querySelector( '.editor-styles-wrapper' )
	if ( editorEl && ! editorEl.classList.contains( `stk-preview-device-${ previewDeviceType.toLowerCase() }` ) ) {
		editorEl.classList.remove( 'stk-preview-device-desktop', 'stk-preview-device-tablet', 'stk-preview-device-mobile' )
		editorEl.classList.add( `stk-preview-device-${ previewDeviceType.toLowerCase() }` )
	}
}, 100 )

export const useDeviceEditorClasses = () => {
	const deviceType = useDeviceType()
	useEffect( () => {
		addDeviceTypeClass( deviceType )
	}, [ deviceType ] )
}
