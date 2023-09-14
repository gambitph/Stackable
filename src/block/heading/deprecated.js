/**
 * Internal Dependencies
 */
import { Save } from './save'
import { attributes } from './schema'

/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import compareVersions from 'compare-versions'
import {
	deprecateBlockBackgroundColorOpacity, deprecateContainerBackgroundColorOpacity, deprecateTypographyGradientColor, getResponsiveClasses,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Version 3.6.1 Deprecations
addFilter( 'stackable.heading.save.blockClassNames', 'stackable/3.6.1', ( output, props ) => {
	if ( compareVersions( props.version, '3.6.1' ) === 1 ) { // Current version is greater than 3.6.1
		return output
	}

	const responsiveClass = getResponsiveClasses( props.attributes )
	return [
		props.className,
		'stk-block-heading',
		responsiveClass,
	]
} )

const deprecated = [
	// Support the new combined opacity and color.
	{
		attributes: attributes( '3.11.9' ),
		save: withVersion( '3.11.9' )( Save ),
		isEligible: attributes => {
			const hasContainerOpacity = deprecateContainerBackgroundColorOpacity.isEligible( attributes )
			const hasBlockOpacity = deprecateBlockBackgroundColorOpacity.isEligible( attributes )
			const hasTextGradient = deprecateTypographyGradientColor.isEligible( '%s' )( attributes )

			return hasContainerOpacity || hasBlockOpacity || hasTextGradient
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( '%s' )( newAttributes )

			return newAttributes
		},
	},
	// Support new margin-top/bottom classes.
	{
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
		migrate: attributes => {
			let newAttributes = deprecateContainerBackgroundColorOpacity.migrate( attributes )
			newAttributes = deprecateTypographyGradientColor.migrate( '%s' )( newAttributes )
			return deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
		},
	},
	{
		attributes: attributes( '3.5.0' ),
		save: withVersion( '3.5.0' )( Save ),
		migrate: attributes => {
			const {
				textRemoveTextMargins: _textRemoveTextMargins,
				...newAttributes
			} = attributes
			return {
				...newAttributes,
				useThemeTextMargins: attributes.textRemoveTextMargins ? false : true,
			}
		},
	},
]

export default deprecated
