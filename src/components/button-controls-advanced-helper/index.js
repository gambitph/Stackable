import { ButtonControlsAdvanced } from '@stackable/components'
import { camelCase } from 'lodash'
import { sprintf } from '@wordpress/i18n'

const ButtonControlsAdvancedHelper = props => {
	const { setAttributes } = props
	const getAttrName = attrName => camelCase( sprintf( props.attrNameTemplate, attrName ) )

	return (
		<ButtonControlsAdvanced
			design={ props.blockAttributes[ getAttrName( 'Design' ) ] || '' }

			noFollow={ props.blockAttributes[ getAttrName( 'NoFollow' ) ] || '' }
			onChangeNoFollow={ value => setAttributes( { [ getAttrName( 'NoFollow' ) ]: value } ) }

			{ ...props }
		/>
	)
}

ButtonControlsAdvancedHelper.defaultProps = {
	attrNameTemplate: '%s',
	setAttributes: () => {},
	blockAttributes: {},
}

export default ButtonControlsAdvancedHelper
