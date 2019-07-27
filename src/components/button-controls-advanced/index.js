import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import { i18n } from 'stackable'
import { ToggleControl } from '@wordpress/components'

const ButtonControls = props => {
	return (
		<Fragment>
			{ props.onChangeNoFollow && (
				<ToggleControl
					label={ __( 'Nofollow link', i18n ) }
					checked={ props.noFollow }
					onChange={ props.onChangeNoFollow }
				/>
			) }
		</Fragment>
	)
}

ButtonControls.defaultProps = {
	design: '',

	noFollow: '',
	onChangeNoFollow: () => {},

	paddingTop: '',
	paddingRight: '',
	paddingBottom: '',
	paddingLeft: '',
	onChangePaddings: () => {},
}

export default ButtonControls
