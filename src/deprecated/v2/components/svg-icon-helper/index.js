/**
 * External dependencies
 */
import { __getValue } from '~stackable/util'
import { getPropsWithDefaults } from '../../../../util/props'
import { camelCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import SvgIcon from '../svg-icon'

const SvgIconHelper = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, SVG_ICON_HELPER_DEFAULT_PROPS )
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

const SVG_ICON_HELPER_DEFAULT_PROPS = {
	attrNameTemplate: '%s',
	blockAttributes: {},
}

export default SvgIconHelper
