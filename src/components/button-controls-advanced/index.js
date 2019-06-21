import { __ } from '@wordpress/i18n'
import { FourNumberControl } from '@stackable/components'
import { Fragment } from '@wordpress/element'
import { ToggleControl } from '@wordpress/components'

const ButtonControls = props => {
	const design = props.design ? props.design : 'basic'

	return (
		<Fragment>
			{ props.onChangeNoFollow && (
				<ToggleControl
					label={ __( 'Nofollow link' ) }
					checked={ props.noFollow }
					onChange={ props.onChangeNoFollow }
				/>
			) }

			{ props.onChangePaddings && design !== 'link' && design !== 'plain' &&
				<FourNumberControl
					label={ __( 'Button Paddings' ) }
					top={ props.paddingTop }
					bottom={ props.paddingBottom }
					right={ props.paddingRight }
					left={ props.paddingLeft }
					onChange={ props.onChangePaddings }
				/>
			}
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
