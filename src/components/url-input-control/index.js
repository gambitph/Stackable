/**
 * Internal, dependencies
 */
import { BaseControl } from '..'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { omit } from 'lodash'
import { URLInput } from '@wordpress/block-editor'

const URLInputControl = props => {
	return (
		<BaseControl
			label={ props.label }
			id="url-input-control"
			help={ props.help }
			allowReset={ props.allowReset }
			value={ props.value }
			onChange={ props.onChange }
		>
			<URLInput
				className="ugb-url-input-control__input"
				value={ props.value }
				onChange={ props.onChange }
				autoFocus={ false } // eslint-disable-line
				{ ...omit( props, [ 'label', 'help' ] ) }
			/>
		</BaseControl>
	)
}

URLInputControl.defaultProps = {
	label: __( 'URL', i18n ),
	help: null,
	value: '',
	onChange: () => {},
	allowReset: true,
}

export default URLInputControl
