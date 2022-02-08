import { useEffect } from '@wordpress/element'
import { useSelect } from '@wordpress/data'
import { throttle } from 'lodash'
import { useDeviceType } from '~stackable/hooks'

const addDeviceTypeClass = throttle( ( previewDeviceType = '', editorEl ) => {
	if ( editorEl && ! editorEl.classList.contains( `stk-preview-device-${ previewDeviceType.toLowerCase() }` ) ) {
		editorEl.classList.remove( 'stk-preview-device-desktop', 'stk-preview-device-tablet', 'stk-preview-device-mobile' )
		editorEl.classList.add( `stk-preview-device-${ previewDeviceType.toLowerCase() }` )
	}
}, 100 )

export const useDeviceEditorClasses = () => {
	const deviceType = useDeviceType()
	const { getEditorDom } = useSelect( 'stackable/editor-dom' )

	useEffect( () => {
		addDeviceTypeClass( deviceType, getEditorDom() )
	}, [ deviceType, getEditorDom ] )
}
