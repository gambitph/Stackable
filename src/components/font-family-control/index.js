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
				options: [
					{ label: __( 'Sans-Serif', i18n ), value: 'Sans-Serif' },
					{ label: __( 'Serif', i18n ), value: 'Serif' },
					{ label: __( 'Serif Alternative', i18n ), value: 'Serif-Alt' },
					{ label: __( 'Monospace', i18n ), value: 'Monospace' },
				],
			},
			{
				id: 'modern-font-stacks',
				title: __( 'Modern Font Stacks', i18n ),
				options: [
					{ label: __( 'System UI', i18n ), value: 'system-ui' },
					{ label: __( 'Transitional', i18n ), value: 'transitional' },
					{ label: __( 'Old Style', i18n ), value: 'old-style' },
					{ label: __( 'Humanist', i18n ), value: 'humanist' },
					{ label: __( 'Geometric Humanist', i18n ), value: 'geometric-humanist' },
					{ label: __( 'Classical Humanist', i18n ), value: 'classical-humanist' },
					{ label: __( 'Neo-Grotesque', i18n ), value: 'neo-grotesque' },
					{ label: __( 'Monospace Slab Serif', i18n ), value: 'monospace-slab-serif' },
					{ label: __( 'Monospace Code', i18n ), value: 'monospace-code' },
					{ label: __( 'Industrial', i18n ), value: 'industrial' },
					{ label: __( 'Rounded Sans', i18n ), value: 'rounded-sans' },
					{ label: __( 'Slab Serif', i18n ), value: 'slab-serif' },
					{ label: __( 'Antique', i18n ), value: 'antique' },
					{ label: __( 'Didone', i18n ), value: 'didone' },
					{ label: __( 'Handwritten', i18n ), value: 'handwritten' },
				],
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
