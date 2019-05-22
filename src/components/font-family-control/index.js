import { __ } from '@wordpress/i18n'
import { AdvancedAutosuggestControl } from '@stackable/components'
import fonts from './google-fonts.json'
import { loadGoogleFont } from '@stackable/util'

const fontOptions = fonts.map( font => {
	return { label: font.family, value: font.family }
} )

const FontFamilyControl = props => {
	return (
		<AdvancedAutosuggestControl
			options={ [
				{
					title: __( 'System Fonts' ),
					options: [
						{ label: __( 'Sans-Serif' ), value: 'Sans-Serif' },
						{ label: __( 'Serif' ), value: 'Serif' },
						{ label: __( 'Monospace' ), value: 'Monospace' },
					],
				},
				{
					title: __( 'Google Fonts' ),
					options: fontOptions,
				},
			] }
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
	label: __( 'Font Family' ),
	value: '',
}

export default FontFamilyControl
