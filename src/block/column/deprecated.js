/**
 * Internal dependencies
 */
import { Save } from './save'
import { attributes } from './schema'

/**
 * External dependencies
 */
import { values } from 'lodash'
import { withVersion } from '~stackable/higher-order'
import compareVersions from 'compare-versions'
import classnames from 'classnames/dedupe'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Version 3.8 added horizontal flex, this changes the stk--block-orientation-* to stk--block-horizontal-flex.
addFilter( 'stackable.column.save.innerClassNames', 'stackable/3.8.0', ( output, props ) => {
	if ( compareVersions( props.version, '3.8.0' ) >= 0 ) {
		return output
	}

	return classnames( output, {
		'stk--block-horizontal-flex': false,
		[ `stk--block-orientation-${ props.attributes.innerBlockOrientation }` ]: props.attributes.innerBlockOrientation,
	} )
} )

// Version 3.7 Deprecations, we now have a stk-block-column--v3 class and removed the --v2 class
addFilter( 'stackable.column.save.blockClassNames', 'stackable/3.7.0', ( output, props ) => {
	if ( compareVersions( props.version, '3.7.0' ) >= 0 ) {
		return output
	}

	return output.filter( s => s !== 'stk-block-column--v3' )
} )

// Version 3.4.3 Deprecations, we now have a stk-block-column--v2 class.
addFilter( 'stackable.column.save.blockClassNames', 'stackable/3.4.3', ( output, props ) => {
	if ( compareVersions( props.version, '3.4.3' ) >= 0 ) {
		output.push( 'stk-block-column--v2' )
		return output
	}

	return output.filter( s => s !== 'stk-block-column--v2' )
} )

// Version 3.4.3 Deprecations, we now have a stk-123abc-inner-blocks class.
addFilter( 'stackable.column.save.innerClassNames', 'stackable/3.4.3', ( output, props ) => {
	if ( compareVersions( props.version, '3.4.3' ) >= 0 ) {
		return output
	}

	return classnames( output, {
		[ `stk--${ props.attributes.uniqueId }-inner-blocks` ]: false,
	} )
} )

// Version 3.8 Deprecations, we now don't have any --v2 --v3 classes anymore.
addFilter( 'stackable.column.save.blockClassNames', 'stackable/3.8.0', ( output, props ) => {
	if ( compareVersions( props.version, '3.8.0' ) >= 0 ) {
		output.push( {
			'stk-block-column--v2': false,
			'stk-block-column--v3': false,
		} )
		return output
	}

	return output
} )

const deprecated = [
	{
		// This deprecation entry is for the New UI where we changed how the
		// layout & containers work.
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
		isEligible: attributes => {
			const isNotV4 = attributes.version < 4 || typeof attributes.version === 'undefined'

			return isNotV4
		},
		migrate: ( attributes, innerBlocks ) => {
			let newAttributes = {
				...attributes,
				version: 4,
				className: classnames( attributes.className, {
					'stk-block-column--v2': false,
					'stk-block-column--v3': false,
				} ),
			}

			// Update the vertical align into flexbox
			const hasOldVerticalAlign = !! attributes.containerVerticalAlign // Column only, this was changed to flexbox

			if ( hasOldVerticalAlign ) {
				newAttributes = {
					...newAttributes,
					containerVerticalAlign: '',
					innerBlockAlign: attributes.containerVerticalAlign,
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

			// If the inner blocks are horizontal, adjust to accomodate the new
			// column gap, it will modify blocks because people used block
			// margins before instead of a proper column gap.
			if ( attributes.innerBlockOrientation === 'horizontal' ) {
				innerBlocks.forEach( ( block, index ) => {
					if ( index ) {
						if ( ! block.attributes.blockMargin ) {
							block.attributes.blockMargin = {
								top: '',
								right: '',
								bottom: '',
								left: '',
							}
						}
						if ( block.attributes.blockMargin.left === '' ) {
							block.attributes.blockMargin.left = 24
						}
					}
				} )

				newAttributes = {
					...newAttributes,
					innerBlockColumnGap: 0,
				}
			}

			return [ newAttributes, innerBlocks ]
		},
	},
	{
		attributes: attributes(),
		save: withVersion( '3.6.6' )( Save ),
	},
	{
		attributes: attributes(),
		save: withVersion( '3.4.2' )( Save ),
	},
]

export default deprecated
