import { useEffect } from '@wordpress/element'
import { doAction } from '@wordpress/hooks'
import { loadGoogleFont } from '~stackable/util'

import { select } from '@wordpress/data'

export const useFontLoader = fontFamilyValue => {
	const { loadingThemeFont, themeFonts } = select( 'stackable/theme-fonts' ).getThemeFonts()
	useEffect( () => {
		if ( ! loadingThemeFont ) {
			if ( ! themeFonts.includes( fontFamilyValue ) ) {
				loadGoogleFont( fontFamilyValue )
				doAction( 'stackable.font-loader.load', fontFamilyValue )
			}
		}
	}, [ loadingThemeFont, fontFamilyValue ] )
}
