/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * Internal dependencies
 */
import fonts from './google-fonts.json'
import { loadGoogleFont } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import {
	useMemo, useEffect, useState,
} from '@wordpress/element'
import apiFetch from '@wordpress/api-fetch'
import AdvancedAutosuggestControl from '../advanced-autosuggest-control'

const fontOptions = fonts.map( font => {
	return { label: font.family, value: font.family }
} )

const FontFamilyControl = props => {
	const [ themeFonts, setThemeFonts ] = useState( [] )

	useEffect( () => {
		apiFetch( {
			path: `/stackable/v3/get_theme_fonts/`,
			method: 'GET',
		} ).then( font => {
			if ( font ) {
				setThemeFonts( font )
			}
		} )
	}, [] )

	const options = useMemo( () => {
		return applyFilters( 'stackable.font-family-control.options', [
			{
				id: 'theme-fonts',
				title: __( 'Theme Fonts', i18n ),
				options: themeFonts || [],
			},
			{
				id: 'system-fonts',
				title: __( 'System Fonts', i18n ),
				options: [
					{ label: __( 'Sans-Serif', i18n ), value: 'Sans-Serif' },
					{ label: __( 'Serif', i18n ), value: 'Serif' },
					{ label: __( 'Serif Alternative', i18n ), value: 'Serif-Alt' },
					{ label: __( 'Monospace', i18n ), value: 'Monospace' },
				],
			},
			{
				id: 'google-fonts',
				title: __( 'Google Fonts', i18n ),
				options: fontOptions,
			},
		] )
	}, [ themeFonts ] )

	return (
		<AdvancedAutosuggestControl
			options={ themeFonts.length ? options : options.filter( option => option.id !== 'theme-fonts' ) }
			highlightValueOnFocus={ true }
			{ ...props }
			onChange={ fontFamily => {
				// Load font if it's a Google font.
				fontOptions.some( font => {
					if ( font.value === fontFamily ) {
						loadGoogleFont( fontFamily )
						return true
					}
					return false
				} )
				props.onChange( fontFamily )
			} }
		/>
	)
}

FontFamilyControl.defaultProps = {
	onChange: () => {},
	label: __( 'Font Family', i18n ),
	value: '',
}

export default FontFamilyControl
