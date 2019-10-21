/**
 * Based on: https://github.com/WordPress/gutenberg/blob/master/packages/editor/src/components/convert-to-group-buttons/convert-button.js
 */

/**
 * External dependencies
 */
import { noop } from 'lodash'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { setGroupingBlockName, switchToBlockType } from '@wordpress/blocks'
import {
	select, withSelect, withDispatch,
} from '@wordpress/data'
import { compose } from '@wordpress/compose'
import { PluginBlockSettingsMenuItem } from '@wordpress/edit-post'

/**
 * Internal dependencies
 */
import { Group, Ungroup } from './icons'

export function ConvertToGroupButton( {
	onConvertToGroup,
	onConvertFromGroup,
	isGroupable = false,
	isUngroupable = false,
} ) {
	// Only supported by WP >= 5.3.
	if ( ! select( 'core/block-editor' ).getSelectedBlockClientIds ) {
		return null
	}

	return (
		<Fragment>
			{ isGroupable && (
				<PluginBlockSettingsMenuItem
					icon={ Group }
					label={ __( 'Group into Container', i18n ) }
					onClick={ onConvertToGroup }
				/>
			) }
			{ isUngroupable && (
				<PluginBlockSettingsMenuItem
					icon={ Ungroup }
					label={ __( 'Ungroup from Container', i18n ) }
					onClick={ onConvertFromGroup }
				/>
			) }
		</Fragment>
	)
}

export default compose( [
	withSelect( ( select, { clientIds } ) => {
		const {
			getBlockRootClientId,
			getBlocksByClientId,
			canInsertBlockType,
		} = select( 'core/block-editor' )

		const groupingBlockName = 'ugb/container'

		const rootClientId = clientIds && clientIds.length > 0 ?
			getBlockRootClientId( clientIds[ 0 ] ) :
			undefined

		const groupingBlockAvailable = canInsertBlockType( groupingBlockName, rootClientId )

		const blocksSelection = getBlocksByClientId( clientIds )

		const isSingleGroupingBlock = blocksSelection.length === 1 && blocksSelection[ 0 ] && blocksSelection[ 0 ].name === groupingBlockName

		// Do we have
		// 1. Grouping block available to be inserted?
		// 2. One or more blocks selected
		// (we allow single Blocks to become groups unless
		// they are a soltiary group block themselves)
		const isGroupable = (
			groupingBlockAvailable &&
			blocksSelection.length &&
			! isSingleGroupingBlock
		)

		// Do we have a single Group Block selected and does that group have inner blocks?
		const isUngroupable = isSingleGroupingBlock && !! blocksSelection[ 0 ].innerBlocks.length

		return {
			isGroupable,
			isUngroupable,
			blocksSelection,
			groupingBlockName,
		}
	} ),
	withDispatch( ( dispatch, {
		clientIds, onToggle = noop, blocksSelection = [], groupingBlockName,
	} ) => {
		const {
			replaceBlocks,
		} = dispatch( 'core/block-editor' )

		return {
			onConvertToGroup() {
				if ( ! blocksSelection.length ) {
					return
				}

				// `switchToBlockType` won't allow different-type blocks to group into a Container block.
				// @see https://github.com/WordPress/gutenberg/issues/17837
				// Workaround is to set my own grouping block name temporarily.
				const currentGroupingName = select( 'core/blocks' ).getGroupingBlockName()
				setGroupingBlockName( 'ugb/container' )

				// Activate the `transform` on the Grouping Block which does the conversion
				const newBlocks = switchToBlockType( blocksSelection, groupingBlockName )
				if ( newBlocks ) {
					replaceBlocks(
						clientIds,
						newBlocks
					)
				}

				// Bring back the original grouping block name.
				// @see https://github.com/WordPress/gutenberg/issues/17837
				setGroupingBlockName( currentGroupingName )

				onToggle()
			},
			onConvertFromGroup() {
				if ( ! blocksSelection.length ) {
					return
				}

				const innerBlocks = blocksSelection[ 0 ].innerBlocks

				if ( ! innerBlocks.length ) {
					return
				}

				replaceBlocks(
					clientIds,
					innerBlocks
				)

				onToggle()
			},
		}
	} ),
] )( ConvertToGroupButton )
