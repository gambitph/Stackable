/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * Internal dependencies
 */
import fonts from './google-fonts.json'
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
import { useMemo } from '@wordpress/element'
import AdvancedAutosuggestControl from '../advanced-autosuggest-control'

import { select } from '@wordpress/data'

const fontOptions = fonts.map( font => {
	return { label: font.family, value: font.family }
} )

const FontFamilyControl = props => {
	const {
		loadingThemeFont, themeFonts, themeFontOptions,
	} = select( 'stackable/theme-fonts' ).getThemeFonts()

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
				options: fontOptions,
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
	}, [ loadingThemeFont ] )

	return (
		<AdvancedAutosuggestControl
			options={ options }
			highlightValueOnFocus={ true }
			{ ...props }
			onChange={ fontFamily => {
				if ( ! themeFonts.includes( fontFamily ) ) {
					// Load font if it's a Google font.
					fontOptions.some( font => {
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
