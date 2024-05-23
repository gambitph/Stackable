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
	deprecateBlockBackgroundColorOpacity,
	deprecateContainerBackgroundColorOpacity,
	getAlignmentClasses, getContentAlignmentClasses, getRowClasses,
	deprecateBlockShadowColor, deprecateContainerShadowColor, deprecateShadowColor,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'
import { semverCompare } from '~stackable/util'

// Version 3.0.2 Deprecations
addFilter( 'stackable.feature.save.contentClassNames', 'stackable/3.0.2', ( output, props ) => {
	if ( compareVersions( props.version, '3.0.2' ) === 1 ) {
		return output
	}

	const contentAlignmentClasses = getContentAlignmentClasses( props.attributes )
	const rowClass = props.attributes.alignVertical ? undefined : getRowClasses( props.attributes )
	return {
		[ rowClass ]: rowClass,
		[ contentAlignmentClasses ]: contentAlignmentClasses,
	}
} )

addFilter( 'stackable.feature.save.innerClassNames', 'stackable/3.0.2', ( output, props ) => {
	if ( compareVersions( props.version, '3.0.2' ) === 1 ) {
		return output
	}

	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	return {
		'stk-inner-blocks': true,
		[ blockAlignmentClass ]: blockAlignmentClass,
		'stk-block-content': true,
	}
} )

addFilter( 'stackable.feature.save.innerClassNames', 'stackable/3.8.0', ( output, props ) => {
	if ( semverCompare( props.version, '<', '3.8.0' ) ) {
		return {
			...output,
			'stk--has-column-order': props.attributes.columnArrangementMobile || props.attributes.columnArrangementTablet,
		}
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
			const hasTopSeparatorShadow = deprecateShadowColor.isEligible( 'topSeparator%s' )( attributes )
			const hasBottomSeparatorShadow = deprecateShadowColor.isEligible( 'bottomSeparator%s' )( attributes )
			const isNotV4 = attributes.version < 2 || typeof attributes.version === 'undefined'

			return hasBlockShadow || hasContainerShadow || hasTopSeparatorShadow || hasBottomSeparatorShadow || isNotV4
		},
		migrate: attributes => {
			let newAttributes = {
				...attributes,
				version: 2,
			}

			// Update the old column fit into flexbox
			const hasOldColumnFit = !! attributes.columnFit
			if ( hasOldColumnFit ) {
				newAttributes = {
					...newAttributes,
					columnFit: '',
					columnFitAlign: '',
					columnJustify: attributes.columnFitAlign,
				}
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
			const isNotV4 = attributes.version < 2 || typeof attributes.version === 'undefined'

			return hasContainerOpacity || hasBlockOpacity || isNotV4
		},
		migrate: attributes => {
			let newAttributes = {
				...attributes,
				version: 2,
			}

			// Update the old column fit into flexbox
			const hasOldColumnFit = !! attributes.columnFit
			if ( hasOldColumnFit ) {
				newAttributes = {
					...newAttributes,
					columnFit: '',
					columnFitAlign: '',
					columnJustify: attributes.columnFitAlign,
				}
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
		// This deprecation entry is for the New UI where we changed how the
		// layout & containers work.
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
		isEligible: attributes => {
			const isNotV4 = attributes.version < 2 || typeof attributes.version === 'undefined'

			return isNotV4
		},
		migrate: attributes => {
			let newAttributes = {
				...attributes,
				version: 2,
			}

			// Update the old column fit into flexbox
			const hasOldColumnFit = !! attributes.columnFit
			if ( hasOldColumnFit ) {
				newAttributes = {
					...newAttributes,
					columnFit: '',
					columnFitAlign: '',
					columnJustify: attributes.columnFitAlign,
				}
			}

			// Container borders while the container was turned off was allowed
			// before, now it's not allowed. Turn on the container to mimic the
			// effect. This goes first before the container paddings check below
			// because we need to set the paddings to zero for this to work.
			const hasContainerBorders = !! attributes.containerBorderType ||
				( typeof attributes.containerBorderRadius !== 'undefined' && attributes.containerBorderRadius !== '' ) ||
				!! attributes.containerShadow

			if ( ! attributes.hasContainer && hasContainerBorders ) {
				newAttributes = {
					...newAttributes,
					hasContainer: true,
					containerPadding: {
						top: 0, right: 0, bottom: 0, left: 0,
					},
					containerBackgroundColor: 'transparent',
				}
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
		attributes: attributes( '3.0.2' ),
		save: withVersion( '3.0.2' )( Save ),
	},
]

export default deprecated
