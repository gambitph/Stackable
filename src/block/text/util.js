/**
 * External dependencies
k*/
import { orderBy } from 'lodash'

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element'
import { createBlock, createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks'
import { __ } from '@wordpress/i18n'
import {
	BlockIcon,
} from '@wordpress/block-editor'
import { useSelect } from '@wordpress/data'

const SHOWN_BLOCK_TYPES = 9

/**
 * When adding a stackable/text block, typing
 * '/' now triggers the block appender dropdown.
 *
 * This function generates a `autocompleters` object which will
 * be passed iniside the block editor's `AutoComplete` component.
 *
 * We can then access the `editor.Autocomplete.completers` filter to
 * add these options.
 *
 * @see https://github.com/WordPress/gutenberg/blob/3da717b8d0ac7d7821fc6d0475695ccf3ae2829f/packages/block-editor/src/components/autocomplete/index.js
 * @see https://github.com/WordPress/gutenberg/blob/3da717b8d0ac7d7821fc6d0475695ccf3ae2829f/packages/block-editor/src/autocompleters/block.js
 */
export const createBlockCompleter = () => {
	return {
		name: 'blocks',
		className: 'block-editor-autocompleters__block',
		triggerPrefix: '/',

		useItems( filterValue ) {
			const { rootClientId, selectedBlockName } = useSelect(
				select => {
					const {
						getSelectedBlockClientId,
						getBlockName,
						getBlockInsertionPoint,
					} = select( 'core/block-editor' )
					const selectedBlockClientId = getSelectedBlockClientId()
					return {
						selectedBlockName: selectedBlockClientId
							? getBlockName( selectedBlockClientId )
							: null,
						rootClientId: getBlockInsertionPoint().rootClientId,
					}
				},
				[]
			)
			const {
				categories, collections, items,
			} = useSelect(
				select => {
					const { getInserterItems } = select( 'core/block-editor' )
					const { getCategories, getCollections } = select( 'core/blocks' )

					return {
						categories: getCategories(),
						collections: getCollections(),
						items: getInserterItems( rootClientId ),
					}
				},
				[ rootClientId ]
			)

			const filteredItems = useMemo( () => {
				let initialFilteredItems = orderBy( items, [ 'frecency' ], [ 'desc' ] )
				// Only include stackable and ugb blocks.
				initialFilteredItems = initialFilteredItems
					.filter( item => item.name !== selectedBlockName )
					.filter( item => item.name.startsWith( 'stackable/' ) || item.name.startsWith( 'ugb/' ) )

				// Filter based on keyword.
				initialFilteredItems = initialFilteredItems
					.filter( item => item.name.includes( filterValue ) || item.title.includes( filterValue ) )

				// Only show certain number of items.
				return initialFilteredItems
					.slice( 0, SHOWN_BLOCK_TYPES )
			}, [
				filterValue,
				selectedBlockName,
				items,
				categories,
				collections,
			] )

			const options = useMemo(
				() =>
					filteredItems.map( blockItem => {
						const {
							title, icon, isDisabled,
						} = blockItem
						return {
							key: `block-${ blockItem.id }`,
							value: blockItem,
							label: (
								<>
									<BlockIcon
										key="icon"
										icon={ icon }
										showColors
									/>
									{ title }
								</>
							),
							isDisabled,
						}
					} ),
				[ filteredItems ]
			)

			return [ options ]
		},
		allowContext( before, after ) {
			return ! ( /\S/.test( before ) || /\S/.test( after ) )
		},
		getOptionCompletion( inserterItem ) {
			const {
				name, initialAttributes, innerBlocks,
			} = inserterItem
			return {
				action: 'replace',
				value: createBlock(
					name,
					initialAttributes,
					createBlocksFromInnerBlocksTemplate( innerBlocks )
				),
			}
		},
	}
}
