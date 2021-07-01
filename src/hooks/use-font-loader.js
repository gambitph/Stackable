import { doAction } from '@wordpress/hooks'
import { loadGoogleFont } from '~stackable/util'

export const useFontLoader = fontFamilyValue => {
	loadGoogleFont( fontFamilyValue )

	doAction( 'stackable.font-loader.load', fontFamilyValue )
}
