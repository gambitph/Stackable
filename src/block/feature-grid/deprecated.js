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
	deprecateBlockBackgroundColorOpacity, deprecateContainerBackgroundColorOpacity,
	getResponsiveClasses, getSeparatorClasses,
	deprecateBlockShadowColor, deprecateContainerShadowColor, deprecateShadowColor,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Version 3.1.0 Deprecations
addFilter( 'stackable.feature-grid.save.blockClassNames', 'stackable/3.1.0', ( output, props ) => {
	if ( compareVersions( props.version, '3.1.0' ) === 1 ) {
		return output
	}

	const separatorClass = getSeparatorClasses( props.attributes )
	const responsiveClass = getResponsiveClasses( props.attributes )

	return [
		props.className,
		'stk-block-feature-grid',
		responsiveClass,
		separatorClass,
	]
} )

const deprecated = [
	{
		// Support the new shadow color.
		attributes: attributes( '3.12.11' ),
		save: withVersion( '3.12.11' )( Save ),
		isEligible: attributes => {
			const hasBlockShadow = deprecateBlockShadowColor.isEligible( attributes )
			const hasContainerShadow = deprecateContainerShadowColor.isEligible( attributes )
			const hasTopSeparatorShadow = deprecateShadowColor.isEligible( 'topSeparator%s' )( attributes )
			const hasBottomSeparatorShadow = deprecateShadowColor.isEligible( 'bottomSeparator%s' )( attributes )
			const hasColumnFit = !! attributes.columnFit

			return hasBlockShadow || hasContainerShadow || hasTopSeparatorShadow || hasBottomSeparatorShadow || hasColumnFit
		},
		migrate: attributes => {
			let newAttributes = {
				...attributes,
				columnFit: '',
				columnFitAlign: '',
				columnJustify: !! attributes.columnFit ? ( attributes.columnFitAlign || 'flex-start' ) : '',
			}

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'topSeparator%s' )( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'bottomSeparator%s' )( newAttributes )

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
			const hasColumnFit = !! attributes.columnFit

			return hasContainerOpacity || hasBlockOpacity || hasColumnFit
		},
		migrate: attributes => {
			let newAttributes = {
				...attributes,
				columnFit: '',
				columnFitAlign: '',
				columnJustify: !! attributes.columnFit ? ( attributes.columnFitAlign || 'flex-start' ) : '',
			}

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'topSeparator%s' )( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'bottomSeparator%s' )( newAttributes )

			return newAttributes
		},
	},
	{
		attributes: attributes( '3.7.3' ),
		save: withVersion( '3.7.3' )( Save ),
		isEligible: attributes => !! attributes.columnFit,
		migrate: attributes => {
			let newAttributes = {
				...attributes,
				columnFit: '',
				columnFitAlign: '',
				columnJustify: !! attributes.columnFit ? ( attributes.columnFitAlign || 'flex-start' ) : '',
			}

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'topSeparator%s' )( newAttributes )
			newAttributes = deprecateShadowColor.migrate( 'bottomSeparator%s' )( newAttributes )

			return newAttributes
		},
	},
	{
		attributes: attributes( '3.1.0' ),
		save: withVersion( '3.1.0' )( Save ),
	},
]

export default deprecated
