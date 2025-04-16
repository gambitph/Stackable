/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * Internal dependencies
 */
import {
	loadGoogleFont,
	MODERN_FONT_STACKS,
	SYSTEM_FONT_STACKS,
} from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import {
	useMemo, useState, useEffect,
} from '@wordpress/element'
import AdvancedAutosuggestControl from '../advanced-autosuggest-control'

import { select } from '@wordpress/data'

const loadGoogleFonts = async () => {
	const { default: fonts } =
		await import( /* webpackChunkName: "data/google-fonts" */ './google-fonts.json' )
	return fonts.map( font => ( { label: font.family, value: font.family } ) )
}

const FontFamilyControl = props => {
	const {
		loadingThemeFont, themeFonts, themeFontOptions,
	} = select( 'stackable/theme-fonts' ).getThemeFonts()

	const [ googleFontOptions, setGoogleFontOptions ] = useState( [] )

	useEffect( () => {
		loadGoogleFonts().then( fontOptions => {
			setGoogleFontOptions( fontOptions )
		} )
	}, [] )

	const options = useMemo( () => {
		const allFontOptions = [
			{
				id: 'system-fonts',
				title: __( 'System Fonts', i18n ),
				options: Object.keys( SYSTEM_FONT_STACKS ).map( key => {
					const font = SYSTEM_FONT_STACKS[ key ]
					return { label: font.label, value: key }
				} ),
			},
			{
				id: 'modern-font-stacks',
				title: __( 'Modern Font Stacks', i18n ),
				options: Object.keys( MODERN_FONT_STACKS ).map( key => {
					const font = MODERN_FONT_STACKS[ key ]
					return { label: font.label, value: key }
				} ),
			},
			{
				id: 'google-fonts',
				title: __( 'Google Fonts', i18n ),
				options: googleFontOptions,
			},
		]
		if ( themeFonts.length ) {
			allFontOptions.unshift( {
				id: 'theme-fonts',
				title: __( 'Theme Fonts', i18n ),
				options: themeFontOptions,
			} )
		}
		return applyFilters( 'stackable.font-family-control.options', allFontOptions )
	}, [ loadingThemeFont, googleFontOptions ] )

	return (
		<AdvancedAutosuggestControl
			options={ options }
			highlightValueOnFocus={ true }
			{ ...props }
			onChange={ fontFamily => {
				if ( ! themeFonts.includes( fontFamily ) ) {
					// Load font if it's a Google font.
					googleFontOptions.some( font => {
						if ( font.value === fontFamily ) {
							loadGoogleFont( fontFamily )
							return true
						}
						return false
					} )
				}

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
