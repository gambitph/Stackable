/**
 * External dependencies
 */
import { SocialControls } from '~stackable/components'
import { camelCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

const SocialControlsHelper = props => {
	const { setAttributes } = props
	const getAttrName = attrName => camelCase( sprintf( props.attrNameTemplate, attrName ) )

	return (
		<SocialControls
			newTab={ props.blockAttributes[ getAttrName( 'NewTab' ) ] || '' }
			onChangeNewTab={ value => setAttributes( { [ getAttrName( 'NewTab' ) ]: value } ) }
			useSocialColors={ props.blockAttributes[ getAttrName( 'UseSocialColors' ) ] || '' }
			onChangeUseSocialColors={ value => setAttributes( { [ getAttrName( 'UseSocialColors' ) ]: value } ) }

			{ ...props }
		/>
	)
}

SocialControlsHelper.defaultProps = {
	attrNameTemplate: '%s',
	setAttributes: () => {},
	blockAttributes: {},
}

export default SocialControlsHelper
