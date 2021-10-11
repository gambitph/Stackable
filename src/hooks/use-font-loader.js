import { useEffect } from '@wordpress/element'
import { doAction } from '@wordpress/hooks'
import { loadGoogleFont } from '~stackable/util'

export const useFontLoader = fontFamilyValue => {
	useEffect( () => {
		loadGoogleFont( fontFamilyValue )
		doAction( 'stackable.font-loader.load', fontFamilyValue )
	}, [ fontFamilyValue ] )
}
