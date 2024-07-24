import { useState, useEffect } from '@wordpress/element'
import apiFetch from '@wordpress/api-fetch'

export const useThemeFonts = () => {
	const [ themeFonts, setThemeFonts ] = useState( [] )
	const [ loading, setLoading ] = useState( true )

	useEffect( () => {
		setLoading( true )
		apiFetch( {
			path: `/stackable/v3/get_theme_fonts/`,
			method: 'GET',
		} ).then( font => {
			if ( font ) {
				setThemeFonts( font )
			}
			setLoading( false )
		} )
	}, [] )

	return {
		loadingThemeFont: loading,
		themeFonts,
		themeFontOptions: themeFonts.map( fontFamily => {
			return { label: fontFamily, value: fontFamily }
		} ),
	}
}
