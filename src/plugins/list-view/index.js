/**
 * Internal dependencies
 */
import { ListView } from '~stackable/block-components'

/**
 * External dependencies
 */
import { isContentOnlyMode } from 'stackable'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'
import { createHigherOrderComponent } from '@wordpress/compose'

if ( ! isContentOnlyMode ) {
	const withListView = createHigherOrderComponent( BlockEdit => {
		return props => {
			const isStackableBlock = props.name.startsWith( 'stackable/' )

			if ( ! isStackableBlock ) {
				return <BlockEdit { ...props } />
			}

			return (
				<>
					<BlockEdit { ...props } />
					<ListView.InspectorControls { ...props } />
				</>
			)
		}
	}, 'withListView' )

	addFilter(
		'editor.BlockEdit',
		'stackable/list-view',
		withListView
	)
}
