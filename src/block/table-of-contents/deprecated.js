/**
 * Internal dependencies
 */
import { attributes } from './schema'
import { Save } from './save'

/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import compareVersions from 'compare-versions'
import {
	deprecateBlockBackgroundColorOpacity, deprecateContainerBackgroundColorOpacity, deprecateTypographyGradientColor,
	deprecateBlockShadowColor, deprecateContainerShadowColor,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.table-of-contents.save.blockClasses', 'stackable/classesNotRendered', ( output, textClasses, props ) => {
	if ( compareVersions( props.version, '3.6.2' ) === 0 ) {
		output.push( textClasses )
		return output
	}

	return output
} )

addFilter( 'stackable.table-of-contents.save.tableOfContentsClasses', 'stackable/classesNotRendered', ( output, props ) => {
	if ( compareVersions( props.version, '3.6.2' ) === 0 ) {
		return 'stk-table-of-contents__table'
	}
	return output
} )

const deprecated = [
	{
		// Support the new shadow color.
		attributes: attributes( '3.12.11' ),
		save: withVersion( '3.12.11' )( Save ),
		isEligible: attributes => {
			const hasBlockShadow = deprecateBlockShadowColor.isEligible( attributes )
			const hasContainerShadow = deprecateContainerShadowColor.isEligible( attributes )

			return hasBlockShadow || hasContainerShadow
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( '%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'title%s' )( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )

			return newAttributes
		},
	},
	// Support the new combined opacity and color.
	{
		attributes: attributes( '3.11.9' ),
		save: withVersion( '3.11.9' )( Save ),
		isEligible: attributes => {
			const hasContainerOpacity = deprecateContainerBackgroundColorOpacity.isEligible( attributes )
			const hasBlockOpacity = deprecateBlockBackgroundColorOpacity.isEligible( attributes )
			const hasTextGradient = deprecateTypographyGradientColor.isEligible( '%s' )( attributes )
			const hasTitleGradient = deprecateTypographyGradientColor.isEligible( 'title%s' )( attributes )

			return hasContainerOpacity || hasBlockOpacity || hasTextGradient || hasTitleGradient
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( '%s' )( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( 'title%s' )( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )

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
			newAttributes = deprecateTypographyGradientColor.migrate( 'title%s' )( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			return deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
		},
	},
	 {
		 attributes: attributes( '3.6.2' ),
		 migrate: attributes => {
			return {
				 ...attributes,
				 titleShow: false,
			 }
		 },
		 save: withVersion( '3.6.2' )( Save ),
	 },
]

export default deprecated

