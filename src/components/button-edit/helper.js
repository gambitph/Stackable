/**
 * Internal dependencies
 */
import ButtonEdit from './index'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { camelCase } from 'lodash'
import { i18n } from 'stackable'

const ButtonEditHelper = props => {
	const { setAttributes } = props
	const getAttrName = attrName => camelCase( sprintf( props.attrNameTemplate, attrName ) )
	const getAttrValue = ( attrName, defaultValue = '' ) => {
		const value = props.blockAttributes[ getAttrName( attrName ) ]
		return value === 0 ? value : ( value || defaultValue )
	}

	return (
		<ButtonEdit
			design={ getAttrValue( 'Design', props.designDefault ) }
			size={ getAttrValue( 'Size', 'normal' ) }
			text={ getAttrValue( 'Text', __( 'Button text', i18n ) ) }
			shadow={ getAttrValue( 'Shadow' ) }
			hoverEffect={ getAttrValue( 'HoverEffect' ) }
			ghostToNormalEffect={ getAttrValue( 'HoverGhostToNormal' ) }
			icon={ getAttrValue( 'Icon' ) }
			iconPosition={ getAttrValue( 'IconPosition' ) }
			onChange={ value => setAttributes( { [ getAttrName( 'Text' ) ]: value } ) }

			url={ getAttrValue( 'Url' ) }
			newWindow={ getAttrValue( 'NewWindow' ) }
			noFollow={ getAttrValue( 'NoFollow' ) }
			onChangeUrl={ value => setAttributes( { [ getAttrName( 'Url' ) ]: value } ) }
			onChangeNewWindow={ value => setAttributes( { [ getAttrName( 'NewWindow' ) ]: value } ) }
			onChangeNoFollow={ value => setAttributes( { [ getAttrName( 'NoFollow' ) ]: value } ) }

			onChangeIcon={ value => setAttributes( { [ getAttrName( 'Icon' ) ]: value } ) }

			isSelected={ props.isSelected }
			{ ...props }
		/>
	)
}

ButtonEditHelper.defaultProps = {
	attrNameTemplate: '%s',
	setAttributes: () => {},
	blockAttributes: {},
	designDefault: 'basic',
}

ButtonEditHelper.Content = props => {
	const getAttrName = attrName => camelCase( sprintf( props.attrNameTemplate, attrName ) )
	const getAttrValue = ( attrName, defaultValue = '' ) => {
		const value = props.blockAttributes[ getAttrName( attrName ) ]
		return value === 0 ? value : ( value || defaultValue )
	}

	return (
		<ButtonEdit.Content
			design={ getAttrValue( 'Design', props.designDefault ) }
			size={ getAttrValue( 'Size', 'normal' ) }
			text={ getAttrValue( 'Text' ) }
			icon={ getAttrValue( 'Icon' ) }
			newTab={ getAttrValue( 'NewWindow' ) }
			url={ getAttrValue( 'Url' ) }
			noFollow={ getAttrValue( 'NoFollow' ) }
			hoverEffect={ getAttrValue( 'HoverEffect' ) }
			ghostToNormalEffect={ getAttrValue( 'HoverGhostToNormal' ) }
			shadow={ getAttrValue( 'Shadow' ) }
			iconPosition={ getAttrValue( 'IconPosition' ) }
			{ ...props }
		/>
	)
}

ButtonEditHelper.Content.defaultProps = {
	attrNameTemplate: '%s',
	blockAttributes: {},
	designDefault: 'basic',
}

export default ButtonEditHelper
