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

			paddingTop={ props.blockAttributes[ getAttrName( 'PaddingTop' ) ] || '' }
			paddingRight={ props.blockAttributes[ getAttrName( 'PaddingRight' ) ] || '' }
			paddingBottom={ props.blockAttributes[ getAttrName( 'PaddingBottom' ) ] || '' }
			paddingLeft={ props.blockAttributes[ getAttrName( 'PaddingLeft' ) ] || '' }
			onChangePaddings={ paddings => {
				setAttributes( {
					[ getAttrName( 'PaddingTop' ) ]: paddings.top !== '' ? parseInt( paddings.top, 10 ) : '',
					[ getAttrName( 'PaddingRight' ) ]: paddings.right !== '' ? parseInt( paddings.right, 10 ) : '',
					[ getAttrName( 'PaddingBottom' ) ]: paddings.bottom !== '' ? parseInt( paddings.bottom, 10 ) : '',
					[ getAttrName( 'PaddingLeft' ) ]: paddings.left !== '' ? parseInt( paddings.left, 10 ) : '',
				} )
			} }

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
