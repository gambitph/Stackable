import { __ } from '@wordpress/i18n'
import { BaseControl } from '@wordpress/components'
import { omit } from 'lodash'
import { URLInput } from '@wordpress/block-editor'

const URLInputControl = props => {
	return (
		<BaseControl label={ props.label } help={ props.help }>
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
	label: __( 'URL' ),
	help: null,
	value: '',
	onChange: () => {},
}

export default URLInputControl
