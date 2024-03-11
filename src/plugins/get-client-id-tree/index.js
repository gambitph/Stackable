/**
 * Internal dependencies
 */
import './store'

/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element'
import {
	dispatch, select, subscribe,
} from '@wordpress/data'

export const ClientTree = () => {
	const [ blockCount, setBlockCount ] = useState( null )

	// Subscribe to all editor changes, so we can listen in to block structure changes.
	subscribe( () => {
		const count = select( 'core/block-editor' ).getGlobalBlockCount()
		if ( count !== blockCount ) {
			setBlockCount( count )
		}
	} )

	useEffect( () => {
		if ( blockCount ) {
			dispatch( 'stackable/block-editor' ).updateClientTree()
		}
	}, [ blockCount ] )

	// Don't render anything.
	return null
}
