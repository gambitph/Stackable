/**
 * This is only used when editing a stackable_temp_post post. See `src/custom-block-styles.php`
 */

/**
 * Internal dependencies
 */
import { saveBlockStyleFuncs } from './save-hooks'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	select, subscribe, dispatch,
} from '@wordpress/data'
import { __, sprintf } from '@wordpress/i18n'
import { getBlockFromExample, createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks'

// Saving can be triggered multiple times by the editor, throttle to the first trigger only.
let isPerformingSave = false

// Gets the first block that has a block name.
const findBlock = ( blockName, blocks ) => {
	const block = blocks.find( block => block.name === blockName )
	if ( block ) {
		return block
	}
	let foundBlock = null
	blocks.some( block => {
		foundBlock = findBlock( blockName, block.innerBlocks )
		return !! foundBlock
	} )
	return foundBlock
}

const performSave = () => {
	const {
		stk_block_name: blockName,
		stk_block_title: blockTitle,
		stk_style_slug: styleSlug,
	} = select( 'core/editor' ).getEditedPostAttribute( 'meta' )

	// The user can have multiple blocks, just pick the first one that we're really editing.
	const blocks = select( 'core/block-editor' ).getBlocks()
	const blockToSave = findBlock( blockName, blocks )

	// If there is no block, error.
	if ( ! blockToSave ) {
		setTimeout( () => { // We need to delay this for this to show up.
			dispatch( 'core/notices' ).createNotice(
				'success',
				sprintf( __( 'Error saving block, please make sure you only have a %s block', i18n ), blockTitle ),
				{
					type: 'snackbar',
					isDismissible: true,
					id: 'stk-block-style-saved', // This is the "save post" notice id, override the "Please wait" message.
				}
			)
		}, 100 )
		return
	}

	const clientId = blockToSave.clientId
	const {
		getBlockSave,
		getBlockAttributes,
		getBlockInnerBlocks,
	} = saveBlockStyleFuncs( select )

	const attributes = getBlockAttributes( clientId )
	const innerBlocks = getBlockInnerBlocks( clientId )
	const blockSave = getBlockSave( clientId )

	const {
		updateBlockStyle,
	} = dispatch( 'stackable/block-styles' )

	// The style name is the post title (if default).
	const postTitle = select( 'core/editor' ).getPostEdits().title || select( 'core/editor' ).getCurrentPost().title
	const styleName = styleSlug === 'default' ? __( 'Default', i18n ) : postTitle

	// Save the block style.
	return updateBlockStyle( blockName, attributes, innerBlocks, blockSave, styleName, styleSlug )
		.then( () => {
			setTimeout( () => {
				const message = styleSlug === 'default'
					? sprintf( __( 'Default %s Block saved', i18n ), blockTitle )
					: sprintf( __( '%s Block style saved', i18n ), blockTitle )

				dispatch( 'core/notices' ).createNotice(
					'success',
					message,
					{
						type: 'snackbar',
						isDismissible: true,
						id: 'stk-block-style-save-done', // This is the "save post" notice id, override the "Please wait" message.
					}
				)
			}, 100 )
		} )
}

// Listen to editor updates when editing a 'stackable_temp_post'
subscribe( () => {
	const postType = select( 'core/editor' )?.getCurrentPostType()
	if ( postType && postType === 'stackable_temp_post' ) {
		// The isSavingPost can trigger true multiple times, throttle it
		// manually so we only do our saving once.
		const isCurrentlySaving = select( 'core/editor' )?.isSavingPost()
		if ( isCurrentlySaving && isPerformingSave === false ) {
			isPerformingSave = true
			// Prevent this happening again and again.
			performSave()?.finally( () => {
				setTimeout( () => {
					isPerformingSave = false
				}, 1000 ) // A long delay since this can re-trigger
			} )
		}
	}
} )

let isInitialized = false

// Initializes our block style editor, adds the default state of the block to be edited.
subscribe( () => {
	const postType = select( 'core/editor' )?.getCurrentPostType()
	if ( postType && postType === 'stackable_temp_post' ) {
		if ( isInitialized ) {
			return
		}
		isInitialized = true

		setTimeout( () => {
			// Disable autosaving.
			dispatch( 'core/editor' ).updateEditorSettings( {
				autosaveInterval: 99999,
			} )

			// Close the global panel and open the inspector.
			dispatch( 'core/edit-post' ).openGeneralSidebar( 'edit-post/block' )

			// If there is no content, then add the default state of a block.
			const { stk_block_name: blockName } = select( 'core/editor' ).getEditedPostAttribute( 'meta' )
			if ( ! select( 'core/editor' ).getEditedPostContent() ) {
				if ( blockName ) {
					const { insertBlock } = dispatch( 'core/block-editor' )
					const { getBlockSupport, getBlockType } = select( 'core/blocks' )

					if ( getBlockType( blockName ).parent ) {
						delete getBlockType( blockName ).parent
					}

					// Allow stkSaveBlockStyle definition to define the blocks
					// that will be added to the style editor.
					const blockEditorBlocks = getBlockSupport( blockName, 'stkSaveBlockStyle' )
					let blocks
					if ( blockEditorBlocks ) {
						blocks = blockEditorBlocks
						if ( ! Array.isArray( blockEditorBlocks ) ) {
							blocks = [ blockEditorBlocks ]
						}
						blocks = createBlocksFromInnerBlocksTemplate( blocks )
					} else {
						blocks = [ getBlockFromExample( blockName, {} ) ]
					}

					// Insert blocks one by one, we need to do it this way so
					// that some block functionality would work. e.g. ToC
					// heading block detection
					blocks.forEach( ( block, i ) => {
						insertBlock( block, i, '', false )
					} )
				}
			}

			// Select the our main block, do this after some delay since we are rapidly inserting blocks.
			setTimeout( () => {
				const { getBlocks } = select( 'core/block-editor' )
				const { selectBlock } = dispatch( 'core/block-editor' )

				const block = findBlock( blockName, getBlocks() )
				if ( block ) {
					selectBlock( block.clientId )
				}
			} )
		} )
	}
} )
