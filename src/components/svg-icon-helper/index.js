/**
 * External dependencies
 */
import { SvgIcon } from '~stackable/components'
import { __getValue } from '~stackable/util'
import { camelCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

const SvgIconHelper = props => {
	const getAttrName = attrName => camelCase( sprintf( props.attrNameTemplate, attrName ) )
	const getValue = __getValue( props.blockAttributes, getAttrName, '' )

	return (
		<SvgIcon
			value={ getValue( 'Value' ) }
			design={ getValue( 'Design' ) }
			colorType={ getValue( 'ColorType' ) }
			showBackgroundShape={ getValue( 'ShowBackgroundShape' ) }
			shadow={ getValue( 'Shadow' ) }
			backgroundShape={ getValue( 'BackgroundShape' ) }
			gradientColor1={ getValue( 'Color' ) }
			gradientColor2={ getValue( 'Color2' ) }
			gradientDirection={ getValue( 'ColorGradientDirection' ) }

			{ ...props }
		/>
	)
}

SvgIconHelper.defaultProps = {
	attrNameTemplate: '%s',
	blockAttributes: {},
}

SvgIconHelper.Content = props => {
	const getAttrName = attrName => camelCase( sprintf( props.attrNameTemplate, attrName ) )
	const getValue = __getValue( props.blockAttributes, getAttrName, '' )

	return (
		<SvgIcon.Content
			value={ getValue( 'Value' ) }
			design={ getValue( 'Design' ) }
			colorType={ getValue( 'ColorType' ) }
			showBackgroundShape={ getValue( 'ShowBackgroundShape' ) }
			shadow={ getValue( 'Shadow' ) }
			backgroundShape={ getValue( 'BackgroundShape' ) }
			gradientColor1={ getValue( 'Color' ) }
			gradientColor2={ getValue( 'Color2' ) }
			gradientDirection={ getValue( 'ColorGradientDirection' ) }

			{ ...props }
		/>
	)
}

SvgIconHelper.defaultProps = {
	attrNameTemplate: '%s',
	blockAttributes: {},
}

export default SvgIconHelper
