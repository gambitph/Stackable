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

// Saving can be triggered multiple times by the editor, throttle to the first trigger only.
let isSaving = false

// Listen to editor updates when editing a 'stackable_temp_post'
subscribe( () => {
	const postType = select( 'core/editor' )?.getCurrentPostType()
	if ( postType && postType === 'stackable_temp_post' ) {
		// The isSavingPost can trigger true multiple times, throttle it
		// manually so we only do our saving once.
		const isCurrentlySaving = select( 'core/editor' )?.isSavingPost()
		if ( isCurrentlySaving && ! isSaving ) {
			isSaving = true
		} else {
			isSaving = false
		}

		if ( ! isSaving ) {
			return
		}

		const {
			stk_block_name: blockName,
			stk_block_title: blockTitle,
			stk_style_slug: styleSlug,
		} = select( 'core/editor' ).getEditedPostAttribute( 'meta' )

		// The user can have multiple blocks, just pick the first one that we're really editing.
		const blocks = select( 'core/block-editor' ).getBlocks()
		const blockToSave = blocks.find( block => block.name === blockName )

		// If there is no block, error.
		if ( ! blockToSave ) {
			setTimeout( () => { // We need to delay this for this to show up.
				dispatch( 'core/notices' ).createNotice(
					'success',
					sprintf( __( 'Error saving block, please make sure you only have a %s block', i18n ), blockTitle ),
					{
						type: 'snackbar',
						isDismissible: true,
						id: 'SAVE_POST_NOTICE_ID', // This is the "save post" notice id, override the "Please wait" message.
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
		updateBlockStyle( blockName, attributes, innerBlocks, blockSave, styleName, styleSlug )
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
							id: 'SAVE_POST_NOTICE_ID', // This is the "save post" notice id, override the "Please wait" message.
						}
					)
				}, 100 )
			} )
	}
} )
