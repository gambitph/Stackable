import { __ } from '@wordpress/i18n'
import { AdvancedAutosuggestControl } from '@stackable/components'
import fonts from './google-fonts.json'

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
		/>
	)
}

FontFamilyControl.defaultProps = {
	onChange: () => {},
	label: __( 'Font Family' ),
	value: '',
}

export default FontFamilyControl
