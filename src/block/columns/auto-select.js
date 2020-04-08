/**
 * In charge of moving the selected block to the columns block when newly added.
 */

/**
 * External dependencies
 */
import { isEqual } from 'lodash'

/**
 * WordPress Dependencies
 */
import domReady from '@wordpress/dom-ready'
import {
	select, dispatch, subscribe,
} from '@wordpress/data'

export const initAutoAttemptRecovery = () => {
	if ( window._wpLoadBlockEditor ) {
		window._wpLoadBlockEditor.then( function() {
			autoSelectColumnsBlock()
		} )
	}
}

const autoSelectColumnsBlock = () => {
	const {
		getBlockOrder, getSelectedBlock, getBlockParents,
	} = select( 'core/block-editor' )
	const { selectBlock, clearSelectedBlock } = dispatch( 'core/block-editor' )

	let blocks = getBlockOrder()

	subscribe( () => {
		const newBlocks = getBlockOrder()
		if ( ! isEqual( blocks, newBlocks ) ) {
			// We need to add a delay here since at the start, the columns block is selected, then moves to the column block afterwards.
			setTimeout( () => {
				const selectedBlock = getSelectedBlock()
				if ( selectedBlock && selectedBlock.name === 'ugb/column' ) {
					clearSelectedBlock() // Clear first or else our inspector will show all options.
					const columnsBlockClientIds = getBlockParents( selectedBlock.clientId )
					if ( columnsBlockClientIds.length ) {
						selectBlock( columnsBlockClientIds[ 0 ] )
					}
				}
			}, 0 )
		}
		blocks = newBlocks
	} )
}

domReady( initAutoAttemptRecovery )
