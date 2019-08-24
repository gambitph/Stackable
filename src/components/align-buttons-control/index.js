/**
 * Internal dependencies
 */
import BaseControlMultiLabel from '../base-control-multi-label'

/**
 * WordPress dependencies
 */
import { BaseControl, Toolbar } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

// TODO: Change to AdvancedToolbarControl
const ALIGN_OPTIONS = [
	{
		value: 'left',
		title: __( 'Align Left', i18n ),
		icon: 'editor-alignleft',
	},
	{
		value: 'center',
		title: __( 'Align Center', i18n ),
		icon: 'editor-aligncenter',
	},
	{
		value: 'right',
		title: __( 'Align Right', i18n ),
		icon: 'editor-alignright',
	},
	{
		value: 'justify',
		title: __( 'Justified', i18n ),
		icon: 'editor-justify',
	},
]

const AlignButtonsControl = props => {
	const {
		label,
		help,
		value,
		onChange,
		justified,
		screens,
	} = props

	return (
		<BaseControl
			className="ugb-align-buttons-control"
			help={ help }
		>
			<BaseControlMultiLabel
				label={ label }
				screens={ screens }
			/>
			<Toolbar
				className="ugb-toolbar-full-width"
				controls={
					ALIGN_OPTIONS.filter( option => {
						return ! justified ? option.value !== 'justify' : true
					} ).map( option => {
						return {
							...option,
							onClick: () => onChange( value !== option.value ? option.value : '' ),
							isActive: value === option.value,
						}
					} )
				}
			/>
		</BaseControl>
	)
}

AlignButtonsControl.defaultProps = {
	label: __( 'Align', i18n ),
	help: '',
	value: ALIGN_OPTIONS[ 0 ].value,
	onChange: () => {},
	justified: false,
	screens: [ 'desktop' ],
}

export default AlignButtonsControl
