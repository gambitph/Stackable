/**
 * External dependencies
 */
import { get } from 'lodash'
import { createUniqueClass } from '~stackable/block-components/block-div/use-unique-id'

/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data'
import { VariationPicker } from '~stackable/components'
import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks'

/**
 * The variation picker will automatically show up when the block doesn't have a
 * uniqueId yet.  Note: The BlockDiv component automatically adds a uniqueId
 * attribute, use `autoApplyUniqueId={ false }` to disable this feature or else
 * the variation picker will never show up.
 *
 * @param {string} clientId The block client id
 * @param {string} uniqueId The uniqueId attribute of the block
 */
export const useVariationPicker = ( clientId, uniqueId ) => {
	const {
		blockType, defaultVariation, variations,
	} = useSelect(
		select => {
			const {
				getBlockVariations,
				getBlockType,
				getDefaultBlockVariation,
			} = select( 'core/blocks' )
			const {
				getBlock,
			} = select( 'core/block-editor' )

			const name = getBlock( clientId ).name

			return {
				blockType: getBlockType( name ),
				defaultVariation: getDefaultBlockVariation( name, 'block' ),
				variations: getBlockVariations( name, 'block' ),
			}
		},
		[ clientId, uniqueId ]
	)
	const { replaceInnerBlocks, updateBlockAttributes } = useDispatch( 'core/block-editor' )

	return uniqueId ? null : (
		<VariationPicker
			icon={ get( blockType, [ 'icon', 'src' ] ) }
			label={ get( blockType, [ 'title' ] ) }
			variations={ variations }
			onSelect={ ( nextVariation = defaultVariation ) => {
				// When selecting a variation, add a unique Id, this will
				// indicate not to show the variation picker afterwards.
				updateBlockAttributes( clientId, {
					...( nextVariation.attributes || {} ),
					uniqueId: createUniqueClass( clientId ),
				} )

				// Apply the variation.
				if ( nextVariation.innerBlocks ) {
					replaceInnerBlocks(
						clientId,
						createBlocksFromInnerBlocksTemplate(
							nextVariation.innerBlocks
						),
						true
					)
				}
			} }
			allowSkip
		/>
	)
}
