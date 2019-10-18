/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { camelCase, upperFirst } from 'lodash'
import { SOCIAL_SITES } from '~stackable/util'
import { SocialButtonEdit } from '~stackable/components'

const SocialButtonEditHelper = props => {
	const { setAttributes } = props
	const getAttrName = attrName => camelCase( sprintf( props.attrNameTemplate, attrName ) )
	const getAttrValue = ( attrName, defaultValue = '' ) => {
		const value = props.blockAttributes[ getAttrName( attrName ) ]
		return value === 0 ? value : ( value || defaultValue )
	}

	const socialProps = Object.keys( SOCIAL_SITES ).reduce( ( propsToPass, socialId ) => {
		return {
			...propsToPass,
			[ `${ socialId }Url` ]: getAttrValue( `${ socialId }Url` ),
			[ `onChange${ upperFirst( socialId ) }Url` ]: value => setAttributes( { [ getAttrName( `${ socialId }Url` ) ]: value } ),
		}
	}, {} )

	return (
		<SocialButtonEdit
			design={ getAttrValue( 'Design', props.designDefault ) }
			size={ getAttrValue( 'Size', 'normal' ) }
			shadow={ getAttrValue( 'Shadow' ) }
			hoverEffect={ getAttrValue( 'HoverEffect' ) }
			ghostToNormalEffect={ getAttrValue( 'HoverGhostToNormal' ) }
			useSocialColors={ getAttrValue( 'UseSocialColors' ) }
			newTab={ getAttrValue( 'NewTab' ) }
			onChangeNewTab={ value => setAttributes( { [ getAttrName( 'NewTab' ) ]: value } ) }

			isSelected={ props.isSelected }
			{ ...socialProps }
			{ ...props }
		/>
	)
}

SocialButtonEditHelper.defaultProps = {
	attrNameTemplate: '%s',
	setAttributes: () => {},
	blockAttributes: {},
	designDefault: 'basic',
}

SocialButtonEditHelper.Content = props => {
	const getAttrName = attrName => camelCase( sprintf( props.attrNameTemplate, attrName ) )
	const getAttrValue = ( attrName, defaultValue = '' ) => {
		const value = props.blockAttributes[ getAttrName( attrName ) ]
		return value === 0 ? value : ( value || defaultValue )
	}

	const socialProps = Object.keys( SOCIAL_SITES ).reduce( ( propsToPass, socialId ) => {
		return {
			...propsToPass,
			[ `${ socialId }Url` ]: getAttrValue( `${ socialId }Url` ),
		}
	}, {} )

	return (
		<SocialButtonEdit.Content
			design={ getAttrValue( 'Design', props.designDefault ) }
			size={ getAttrValue( 'Size', 'normal' ) }
			newTab={ getAttrValue( 'NewTab' ) }
			hoverEffect={ getAttrValue( 'HoverEffect' ) }
			useSocialColors={ getAttrValue( 'UseSocialColors' ) }
			ghostToNormalEffect={ getAttrValue( 'HoverGhostToNormal' ) }
			shadow={ getAttrValue( 'Shadow' ) }

			{ ...socialProps }
			{ ...props }
		/>
	)
}

SocialButtonEditHelper.Content.defaultProps = {
	attrNameTemplate: '%s',
	blockAttributes: {},
	designDefault: 'basic',
}

export default SocialButtonEditHelper
