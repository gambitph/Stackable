/**
 * External dependencies
 */
import { SocialControls } from '..'
import { camelCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'
import { getPropsWithDefaults } from '../../../../util/props'

const SocialControlsHelper = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, SOCIAL_CONTROLS_HELPER_DEFAULT_PROPS )
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

const SOCIAL_CONTROLS_HELPER_DEFAULT_PROPS = {
	attrNameTemplate: '%s',
	setAttributes: () => {},
	blockAttributes: {},
}

export default SocialControlsHelper
