/**
 * Observer function for block styles.
 *
 * Used alongside BlockStyles.InspectorControls component.
 *
 * @see 'src/block-components/block-style/block-styles.js'
 */

/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins'
import { useSelect, select } from '@wordpress/data'
import { useEffect } from '@wordpress/element'

const BlockMigrationObserver = () => {
	// Keep track of last attribute changes.
	const lastAttributeChanged = useSelect( select => select( 'core/block-editor' ).__experimentalGetLastBlockAttributeChanges?.(), [] )
	// Keep track of the current selected block.
	const selectedClientId = useSelect( select => select( 'core/block-editor' ).getSelectedBlockClientId(), [] )

	useEffect( () => {
		const isSelectedBlockCached = Object.keys( window.__STK_BLOCK_MIGRATIONS_CACHE ).includes( selectedClientId )
		if ( isSelectedBlockCached ) {
			// If the selected block is cached, return a cleanup function for
			// removing its migration cache when the selection changes.
			// This solves the problem where the cache is not smart enough to
			// recompute  if the selected block's inner block structure
			// has changed.
			return () => {
				delete window.__STK_BLOCK_MIGRATIONS_CACHE[ selectedClientId ]
			}
		}
	}, [ selectedClientId ] )

	useEffect( () => {
		// Checks whether the last attribute changed is cached.
		Object.keys( lastAttributeChanged || {} ).forEach( key => {
			if ( Object.keys( window.__STK_BLOCK_MIGRATIONS_CACHE ).includes( key ) ) {
				delete window.__STK_BLOCK_MIGRATIONS_CACHE[ key ]
			} else {
				const parentClientId = select( 'core/block-editor' ).getBlockParents( key ).find( parent => Object.keys( window.__STK_BLOCK_MIGRATIONS_CACHE ).includes( parent ) )
				if ( parentClientId ) {
					delete window.__STK_BLOCK_MIGRATIONS_CACHE[ parentClientId ]
				}
			}
		} )
	}, [ JSON.stringify( lastAttributeChanged ) ] )

	return null
}

registerPlugin( 'stackable-block-migration-observer', { render: BlockMigrationObserver } )
