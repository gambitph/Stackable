/**
 * Internal dependncies
 */
import { loadGoogleFontInAttributes } from './font'
import { moveArrayIndex } from '.'
import { SVGStackableCategoryIcon } from '~stackable/icons'

/**
 * External dependencies
 */
import {
	omit,
	orderBy,
	last,
} from 'lodash'
import {
	blockCategoryIndex,
	i18n,
	settings as stackableSettings,
} from 'stackable'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
	getCategories,
	setCategories,
	registerBlockType as _registerBlockType,
} from '@wordpress/blocks'
import {
	dispatch, select, useSelect,
} from '@wordpress/data'
import { useMemo } from '@wordpress/element'
import { BlockIcon } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'

/**
 * Enum for disabling and hiding blocks.
 */
export const BLOCK_STATE = Object.freeze( {
	ENABLED: 1,
	HIDDEN: 2,
	DISABLED: 3,
} )

/**
 * Converts the registered block name into a block name string that can be used in hook names or ids.
 *
 * @param {string} name The block name
 */
export const getBlockName = name => {
	return name.replace( /\//g, '-' )
}

const ignoreAttributes = [
	'uniqueClass',
]

// DEPRECATED: Not used anymore since calls to this can be pretty expensive.
// Checks whether a block is modified or not.
const cachedDefaultAttributes = {}
export function isUnmodifiedBlock( block ) {
	if ( ! cachedDefaultAttributes[ block.name ] ) {
		cachedDefaultAttributes[ block.name ] = createBlock( block.name ).attributes
	}
	return Object.keys( cachedDefaultAttributes[ block.name ] ).every( attrName => {
		if ( ignoreAttributes.includes( attrName ) ) {
			return true
		}
		return cachedDefaultAttributes[ block.name ][ attrName ] === block.attributes[ attrName ]
	} )
}

export const applyBlockDesign = ( attributes, clientId = null ) => {
	const {
		getBlockName, getSelectedBlockClientId, getBlockAttributes, hasMultiSelection, getMultiSelectedBlockClientIds,
	} = select( 'core/block-editor' )
	const { updateBlockAttributes } = dispatch( 'core/block-editor' )
	const { getBlockType } = select( 'core/blocks' )

	// If multiple blocks are selected, apply the block design to them all.
	if ( ! clientId && hasMultiSelection() ) {
		getMultiSelectedBlockClientIds().forEach( clientId => {
			applyBlockDesign( attributes, clientId )
		} )
		return
	}

	const blockClientId = clientId ? clientId : getSelectedBlockClientId()
	if ( ! blockClientId ) {
		return
	}

	const currentBlockAttributes = getBlockAttributes( blockClientId )
	const blockName = getBlockName( blockClientId ).replace( /^\w+\//g, '' )
	const attributeDefinition = getBlockType( getBlockName( blockClientId ) ).attributes
	const defaultAttributes = Object.keys( attributeDefinition ).reduce( ( attrs, attrName ) => {
		return {
			...attrs,
			[ attrName ]: attributeDefinition[ attrName ] ? attributeDefinition[ attrName ].default : '',
		}
	}, {} )
	// Omit the attributes which should not be overridden, for example: urls,
	// media ids, open in new tabs, etc.
	const blockAttributesFiltered = applyFilters( `stackable.${ blockName }.design.filtered-block-attributes`, { ...defaultAttributes, ...attributes }, currentBlockAttributes )

	// When applying attributes to a block, we assume that there's already text
	// inputted in the block, so we shouldn't apply all the text attributes of
	// the design.
	const blockAttributes = applyFilters( `stackable.${ blockName }.design.no-text-attributes`, blockAttributesFiltered, currentBlockAttributes )

	// Check for any Fonts that we need to load.
	loadGoogleFontInAttributes( blockAttributes )

	updateBlockAttributes( blockClientId, omit( blockAttributes, [ 'uniqueClass' ] ) ) // eslint-disable-line stackable/no-update-block-attributes
}

/**
 * Moves an innerBlock to a new index.
 *
 * @param {string} clientId The block to modify
 * @param {number} fromIndex innerBlock old index
 * @param {number} toIndex innerBlock new index
 */
export const moveInnerBlock = ( clientId, fromIndex, toIndex ) => {
	const { getBlock } = select( 'core/block-editor' )
	const { replaceInnerBlocks } = dispatch( 'core/block-editor' )
	const currentBlock = getBlock( clientId )
	const newInnerBlocks = moveArrayIndex( currentBlock.innerBlocks, fromIndex, toIndex )

	replaceInnerBlocks( clientId, newInnerBlocks, false )
}

const SHOWN_BLOCK_TYPES = 9

/**
 * When adding a stackable block, typing
 * '/' can now trigger the block appender dropdown.
 *
 * This function generates a `autocompleters` object which will
 * be passed iniside the block editor's `AutoComplete` component.
 *
 * We can then access the `editor.Autocomplete.completers` filter to
 * add these options.
 *
 * @since 3.0.0
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
				// initialFilteredItems = initialFilteredItems
				// 	.filter( item => item.name !== selectedBlockName )
				// 	.filter( item => item.name.startsWith( 'stackable/' ) || item.name.startsWith( 'ugb/' ) )

				// Filter based on keyword.
				initialFilteredItems = initialFilteredItems
					.filter( item => item.name.toLowerCase().includes( filterValue?.toLowerCase() ) || item.title.toLowerCase().includes( filterValue?.toLowerCase() ) )

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

/**
 * Generates a structure object based on the clientId (up to the parent clientId).
 * Used by Block Linking.
 *
 * A structure object looks like this:
 * [
 *   {
 *     type: 'stackable/card',
 *   },
 *   {
 *     type: 'stackable/columns',
 *     nthOfType: 1,
 *     numOfType: 1,
 *   },
 *   {
 *     type: 'stackable/column',
 *     nthOfType: 1,
 *     numOfType: 2,
 *   },
 *   {
 *     type: 'stackable/heading',
 *     nthOfType: 1,
 *     numOfType: 1,
 *     attributes: {
 *       color: red,
 *     },
 *   }
 * ]
 *
 * @param {string} clientId The main block
 * @param {string} rootClientId The root parent block
 */
export const extractBlockStyleStructure = ( clientId, rootClientId ) => {
	let currentClientId = clientId
	const structureArray = []

	while ( currentClientId !== null ) {
		const { getBlock, getBlockParents } = select( 'core/block-editor' )
		const block = getBlock( currentClientId )
		const currentBlockName = block.name
		const parentClientId = last( getBlockParents( currentClientId ) ) // eslint-disable-line stackable/no-get-block-parents

		if ( ! parentClientId || parentClientId === currentClientId ) {
			structureArray.unshift( {
				type: block.name,
				nthOfType: 1,
				numOfType: 1,
			} )
			break
		}

		// Get nthOfType and numOfType
		const childBlocks = getBlock( parentClientId ).innerBlocks
		const { nthOfType, numOfType } = childBlocks.reduce( ( blockData, { name, clientId } ) => {
			if ( name === currentBlockName ) {
				blockData.numOfType++
				if ( ! blockData.foundClientId ) {
					blockData.nthOfType++
					if ( clientId === currentClientId ) {
						blockData.foundClientId = true
					}
				}
			}
			return blockData
		}, {
			nthOfType: 0, numOfType: 0, foundClientId: false,
		} )

		structureArray.unshift( {
			type: block.name,
			nthOfType,
			numOfType,
		} )

		// Go back one parent.
		if ( currentClientId === rootClientId ) {
			currentClientId = null
		} else {
			currentClientId = last( select( 'core/block-editor' ).getBlockParents( currentClientId ) ) // eslint-disable-line stackable/no-get-block-parents
		}
	}

	return structureArray
}

/**
 * Gets the list of blocks which the styleStructure is applicable to.
 *
 * This method tries to match/paste to a block and its nested contents.
 *
 * The styleStructure explains the attributes to be applied, the styles can be
 * applied to multiple nested blocks. Here's an example styleStructure:
 *
 * [
 *   {
 *     type: 'stackable/card',
 *   },
 *   {
 *     type: 'stackable/columns',
 *     nthOfType: 1,
 *     numOfType: 1,
 *   },
 *   {
 *     type: 'stackable/column',
 *     nthOfType: 1,
 *     numOfType: 2,
 *   },
 *   {
 *     type: 'stackable/heading',
 *     nthOfType: 1,
 *     numOfType: 1,
 *     attributes: {
 *       color: red,
 *     },
 *   }
 * ]
 *
 * @param {number} clientId The block to apply the styles to
 * @param {Object} styleStructure An object explaining the style/attributes to
 * apply
 *
 * @return {Array} Array of block client Ids which the styleStructure should be
 * applied to.
 */
export const getBlocksToStyle = ( clientId, styleStructure ) => {
	const clientIds = []
	if ( ! styleStructure.length ) {
		return clientIds
	}

	// Don't match the type of the very first entry since it's the main one.
	styleStructure[ 0 ].nthOfType = 1
	styleStructure[ 0 ].numOfType = 1

	let currentBlocks = [ select( 'core/block-editor' ).getBlock( clientId ) ]
	styleStructure.forEach( ( currentStructure, i ) => {
		const matchingBlocks = currentBlocks.filter( block => {
			if ( currentStructure.type !== block.name ) {
				return false
			}

			// The first block should always match.
			if ( i === 0 ) {
				return true
			}

			// Match if it's the same child type.
			const nthOfType = getNthTypeOfBlock( block.clientId )
			if ( nthOfType === currentStructure.nthOfType ) {
				return true
			}

			const lastInStructure = currentStructure.nthOfType === currentStructure.numOfType
			if ( lastInStructure && nthOfType > currentStructure.nthOfType && nthOfType >= currentStructure.numOfType ) {
				return true
			}

			return false
		} )

		// All the client Id for updating.
		if ( currentStructure.attributes ) {
			matchingBlocks.forEach( ( { clientId } ) => {
				clientIds.push( clientId )
			} )
		}

		// Go through the next level of inner blocks.
		currentBlocks = matchingBlocks.reduce( ( allInnerBlocks, matchingBlock ) => {
			return [
				...allInnerBlocks,
				...matchingBlock.innerBlocks,
			]
		}, [] )
	} )

	return clientIds
}

const getNthTypeOfBlock = currentClientId => {
	const { getBlock, getBlockParents } = select( 'core/block-editor' )
	const block = getBlock( currentClientId )
	const currentBlockName = block.name
	const parentClientId = last( getBlockParents( currentClientId ) ) // eslint-disable-line stackable/no-get-block-parents

	if ( ! parentClientId || parentClientId === currentClientId ) {
		return 1
	}

	// Get nthOfType and numOfType
	const childBlocks = getBlock( parentClientId ).innerBlocks
	let nthOfType = 0
	childBlocks.some( ( { name, clientId } ) => {
		if ( name === currentBlockName ) {
			nthOfType++
			return clientId === currentClientId
		}
		return false
	} )

	return nthOfType
}

// Register our block category. Not a collection since our blocks would appear
// as "Uncategorized"
export const addStackableBlockCategory = () => {
	if ( ! getCategories().some( category => category.slug === 'stackable' ) ) {
		const stackableCategory = {
			slug: 'stackable',
			title: __( 'Stackable', i18n ),
			icon: SVGStackableCategoryIcon,
		}
		const categoryIndex = blockCategoryIndex || 0

		// Add our category based on the categoryIndex
		const newCategories = [ ...getCategories() ]
		newCategories.splice( categoryIndex, 0, stackableCategory )

		setCategories( newCategories )
	}
}

/**
 * Registers a block. Use this instead of the registerBlockType found in @wordpress/blocks
 *
 * @param {string} name The namespaced name of the block
 * @param {Object} _settings The block properties to register
 */
export const registerBlockType = ( name, _settings ) => {
	let settings = applyFilters( `stackable.block.metadata`, _settings || {} )

	// If there is no variation title, then some labels in the editor will show
	// up as "undefined", add a default title for all variations.
	if ( settings.variations ) {
		settings.variations.forEach( variation => {
			if ( ! variation.title ) {
				variation.title = settings.title
			}
		} )
	}

	// Workaround to remove the .wp-block[data-align] div wrapper for wide and full
	// width alignments.  Since we removed this, we add our own data-align attribute
	// in the BlockWrapper in src/components/block-wrapper (this is used by all our
	// blocks)
	settings.getEditWrapperProps = () => {
		return {
			'data-align': undefined,
		}
	}

	// Add HOCs here that are present for all our blocks.
	settings.edit = applyFilters( 'stackable.registerBlockType.edit', settings.edit )

	settings = applyFilters( `stackable.${ name.replace( 'stackable/', '' ) }.settings`, settings )
	_registerBlockType( name, settings )
}

/**
 * Substitutes a stackable block with an equivalent core block if the block is disabled.
 *
 * @param {string} blockName The block name
 * @param {Object} blockAttributes The block attributes
 * @param {Array} innerBlocks The children blocks
 * @param {Object} substitutionRules The substitution rules for transforming from stackable to core blocks
 *
 * @return {Array} The resulting block definition
 */
export const substituteCoreIfDisabled = ( blockName, blockAttributes, innerBlocks, substitutionRules ) => {
	const disabledBlocks = stackableSettings.stackable_block_states || {} // eslint-disable-line camelcase

	if ( substitutionRules && blockName in substitutionRules ) {
		const substitutionRule = substitutionRules[ blockName ]
		// If a block have variants, let the the transform handle checking for disabled
		if ( 'variants' in substitutionRule ) {
			return substitutionRule.transform( blockAttributes, innerBlocks, disabledBlocks )
		}
		if ( blockName in disabledBlocks && disabledBlocks[ blockName ] === BLOCK_STATE.DISABLED ) { // eslint-disable-line camelcase
			return substitutionRule.transform( blockAttributes, innerBlocks )
		}
	}

	if ( innerBlocks ) {
		return [ blockName, blockAttributes, innerBlocks ]
	}
	return [ blockName, blockAttributes, [] ]
}
