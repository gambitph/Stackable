/**
 * Internal dependencies
 */
import { Save } from './save'
import { attributes } from './schema'

/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import compareVersions from 'compare-versions'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { addFilter } from '@wordpress/hooks'
import { getAlignmentClasses } from '~stackable/block-components'
import { values } from 'lodash'

// Version 3.8 added horizontal flex, this changes the stk--block-orientation-* to stk--block-horizontal-flex.
addFilter( 'stackable.card.save.innerClassNames', 'stackable/3.8.0', ( output, props ) => {
	if ( compareVersions( props.version, '3.8.0' ) >= 0 ) {
		return output
	}

	output.push( {
		[ `stk-${ props.attributes.uniqueId }-inner-blocks` ]: false,
		'stk--block-horizontal-flex': false,
		[ `stk--block-orientation-${ props.attributes.innerBlockOrientation }` ]: props.attributes.innerBlockOrientation,
	} )

	return output
} )

// Version 3.0.2 Deprecations
addFilter( 'stackable.card.save.container-div.content', 'stackable/3.0.2', ( output, props, innerClassNames ) => {
	if ( compareVersions( props.version, '3.0.2' ) === 1 ) {
		return output
	}

	return (
		<div className={ innerClassNames }>
			<InnerBlocks.Content />
		</div>
	)
} )

addFilter( 'stackable.card.save.contentClassNames', 'stackable/3.0.2', ( output, props ) => {
	if ( compareVersions( props.version, '3.0.2' ) === 1 ) {
		return output
	}

	return {
		'stk-block-card__content': true,
		'stk--no-padding': true,
	}
} )

addFilter( 'stackable.card.save.wrapperClassNames', 'stackable/3.0.2', ( output, props ) => {
	if ( compareVersions( props.version, '3.0.2' ) === 1 ) {
		return output
	}

	return {}
} )

addFilter( 'stackable.card.save.innerClassNames', 'stackable/3.0.2', ( output, props ) => {
	if ( compareVersions( props.version, '3.0.2' ) === 1 ) {
		return output
	}

	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	output.push( {
		'stk-block-content': true,
		'stk-inner-blocks': true,
		[ blockAlignmentClass ]: blockAlignmentClass,
		'stk-container-padding': props.attributes.hasContainer,
	} )

	return output
} )

const deprecated = [
	{
		// This deprecation entry is for the New UI where we changed how the
		// layout & containers work.
		attributes: attributes(),
		save: withVersion( '3.7.9' )( Save ),
		isEligible: attributes => {
			const hasOldColumnFit = !! attributes.columnFit

			const hasOldVerticalAlign = !! attributes.containerVerticalAlign // Column only, this was changed to flexbox

			const hasContainerPaddings = values( attributes.containerPadding ).some( padding => padding !== '' )

			const hasContainerBorders = !! attributes.containerBorderType ||
				( typeof attributes.containerBorderRadius !== 'undefined' && attributes.containerBorderRadius !== '' ) ||
				!! attributes.containerShadow

			return hasOldColumnFit ||
				hasOldVerticalAlign ||
				( ! attributes.hasContainer && hasContainerPaddings ) ||
				( ! attributes.hasContainer && hasContainerBorders )
		},
		migrate: ( attributes, innerBlocks ) => {
			let newAttributes = { ...attributes }

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
		save: withVersion( '3.0.2' )( Save ),
	},
]

export default deprecated
