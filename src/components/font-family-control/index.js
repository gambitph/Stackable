/**
 * External dependencies
 */
import { AdvancedAutosuggestControl } from '~stackable/components'

/**
 * Internal dependencies
 */
import fonts from './google-fonts.json'
import { loadGoogleFont } from '~stackable/util'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { useMemo } from '@wordpress/element'

const fontOptions = fonts.map( font => {
	return { label: font.family, value: font.family }
} )

const FontFamilyControl = props => {
	const options = useMemo( () => {
		return applyFilters( 'stackable.font-family-control.options', [
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
	}, [] )

	return (
		<AdvancedAutosuggestControl
			options={ options }
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
