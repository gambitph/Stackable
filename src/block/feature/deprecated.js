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
	getAlignmentClasses, getContentAlignmentClasses, getRowClasses,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'
import { values } from 'lodash'

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

const deprecated = [
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

			// Container paddings while the container was turned off was allowed
			// before, now it's not allowed. Turn on the container to mimic the
			// effect.
			const hasContainerPaddings = values( attributes.containerPadding ).some( padding => padding !== '' )

			if ( ! attributes.hasContainer && hasContainerPaddings ) {
				const newContainerPadding = Object.keys( attributes.containerPadding ).reduce( ( paddings, key ) => {
					paddings[ key ] = attributes.containerPadding[ key ] || 0
					return paddings
				}, {} )

				newAttributes = {
					...newAttributes,
					hasContainer: true,
					containerPadding: newContainerPadding,
					containerBackgroundColor: 'transparent',
					containerShadow: newAttributes.containerShadow || 'none',
				}
			}

			return newAttributes
		},
	},
	{
		attributes: attributes(),
		save: withVersion( '3.8.0' )( Save ),
		isEligible: attributes => !! attributes.columnFit,
		migrate: attributes => {
			return {
				...attributes,
				columnFit: '',
				columnFitAlign: '',
				columnJustify: attributes.columnFitAlign,
			}
		},
	},
	{
		attributes: attributes( '3.0.2' ),
		save: withVersion( '3.0.2' )( Save ),
	},
]

export default deprecated
