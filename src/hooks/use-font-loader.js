import { useEffect } from '@wordpress/element'
import { doAction } from '@wordpress/hooks'
import { loadGoogleFont } from '~stackable/util'

import { useThemeFonts } from './use-theme-fonts'

export const useFontLoader = fontFamilyValue => {
	const { loadingThemeFont, themeFonts } = useThemeFonts()
	useEffect( () => {
		if ( ! loadingThemeFont ) {
			if ( ! themeFonts.includes( fontFamilyValue ) ) {
				loadGoogleFont( fontFamilyValue )
				doAction( 'stackable.font-loader.load', fontFamilyValue )
			}
		}
	}, [ loadingThemeFont, fontFamilyValue ] )
}
