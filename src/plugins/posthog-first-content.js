/**
 * Fire first_stackable_content once when any Stackable block appears in the editor.
 */

/**
 * Internal dependencies
 */
import { trackFirstStackableContent } from '../posthog'

/**
 * WordPress dependencies
 */
import { subscribe, select } from '@wordpress/data'
import domReady from '@wordpress/dom-ready'

const isStackableBlockName = name =>
	typeof name === 'string' && name.startsWith( 'stackable/' )

const blocksContainStackable = blocks => {
	if ( ! Array.isArray( blocks ) ) {
		return false
	}
	for ( const block of blocks ) {
		if ( isStackableBlockName( block?.name ) ) {
			return true
		}
		if ( blocksContainStackable( block?.innerBlocks ) ) {
			return true
		}
	}
	return false
}

const watchForFirstStackableContent = () => {
	if ( window.stackable?.posthogContext?.hasFirstContent ) {
		return
	}
	if ( typeof localStorage !== 'undefined' && localStorage.getItem( 'stk_posthog_first_stackable_content' ) === '1' ) {
		return
	}

	let fired = false
	const unsubscribe = subscribe( () => {
		if ( fired ) {
			return
		}
		try {
			const blocks = select( 'core/block-editor' )?.getBlocks?.()
			if ( ! blocksContainStackable( blocks ) ) {
				return
			}
			fired = true
			unsubscribe()
			trackFirstStackableContent( 'editor' )
		} catch ( e ) {
			// Block editor may not be ready yet.
		}
	} )
}

domReady( watchForFirstStackableContent )
