/**
 * Internal dependencies
 */
import { NavigationView } from '~stackable/block-components'

/**
 * External dependencies
 */
import { settings, isContentOnlyMode } from 'stackable'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'
import { createHigherOrderComponent } from '@wordpress/compose'

if ( ! isContentOnlyMode && settings.stackable_enable_navigation_panel ) {
	const withNavigationView = createHigherOrderComponent( BlockEdit => {
		return props => {
			const isStackableBlock = props.name.startsWith( 'stackable/' )

			if ( ! isStackableBlock || ! props.isSelected ) {
				return <BlockEdit { ...props } />
			}

			return (
				<>
					<BlockEdit { ...props } />
					<NavigationView.InspectorControls { ...props } />
				</>
			)
		}
	}, 'withNavigationView' )

	addFilter(
		'editor.BlockEdit',
		'stackable/navigation-view',
		withNavigationView
	)
}
