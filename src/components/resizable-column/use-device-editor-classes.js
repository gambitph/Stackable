import { useEffect } from '@wordpress/element'
import { throttle } from 'lodash'
import { useDeviceType, useEditorDom } from '~stackable/hooks'

const addDeviceTypeClass = throttle( ( previewDeviceType = '', editorEl ) => {
	if ( editorEl && ! editorEl.classList.contains( `stk-preview-device-${ previewDeviceType.toLowerCase() }` ) ) {
		editorEl.classList.remove( 'stk-preview-device-desktop', 'stk-preview-device-tablet', 'stk-preview-device-mobile' )
		editorEl.classList.add( `stk-preview-device-${ previewDeviceType.toLowerCase() }` )
	}
}, 100 )

export const useDeviceEditorClasses = () => {
	const deviceType = useDeviceType()
	const editorDom = useEditorDom()
	useEffect( () => {
		addDeviceTypeClass( deviceType, editorDom )
	}, [ deviceType, editorDom ] )
}
