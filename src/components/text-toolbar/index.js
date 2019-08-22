/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { Toolbar } from '@wordpress/components'

const OPTION_DEFAULTS = {
	value: '',
	title: __( 'Option', i18n ),
	onClick: () => {},
	isActive: false,
}

const TextToolbar = props => {
	return (
		<Toolbar
			className="ugb-text-toolbar"
			{ ...props }
			controls={
				props.controls.map( option => {
					return {
						...OPTION_DEFAULTS,
						extraProps: {
							children: <span className="ugb-text-toolbar__label">{ option.title }</span>,
						},
						...option,
						icon: undefined,
					}
				} )
			}
		/>
	)
}

TextToolbar.defaultProps = {
	controls: [],
}

export default TextToolbar
