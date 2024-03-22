/**
 * Internal dependencies
 */
import './store'
import { PanelAdvancedSettings } from '~stackable/components'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	__experimentalListView as ListView, // eslint-disable-line @wordpress/no-unsafe-wp-apis
	InspectorControls,
} from '@wordpress/block-editor'
import { ResizableBox } from '@wordpress/components'
import { useSelect, dispatch } from '@wordpress/data'
import { addFilter } from '@wordpress/hooks'
import { useState } from '@wordpress/element'

const MIN_HEIGHT = 38

export const Edit = props => {
	const { clientId, isSelected } = props
	const [ isResizing, setIsResizing ] = useState( false )

	const {
		height,
		isOpen,
		blocks,
		isOnlyBlock,
		rootClientId,
	} = useSelect( select => {
		const { rootBlockClientId, hasInnerBlocks } = select( 'stackable/block-context' ).getBlockContext( clientId )
		const childBlocks = select( 'stackable/block-context' ).getClientTree( rootBlockClientId )

		return {
			height: select( 'stackable/navigation-view' ).getHeight(),
			isOpen: select( 'stackable/navigation-view' ).getIsOpen(),
			isOnlyBlock: ! hasInnerBlocks && rootBlockClientId === clientId,
			rootClientId: rootBlockClientId,
			blocks: [ {
				clientId: rootBlockClientId,
				innerBlocks: childBlocks,
			} ],
		}
	} )

	// ListView is not available in WP 5.8.4 and below, don't show it if it's not available.
	if ( ! ListView ) {
		return null
	}

	// Don't show if this is the only block.
	if ( ! isSelected || isOnlyBlock ) {
		return null
	}

	if ( ! rootClientId ) {
		return null
	}

	const classNames = classnames( [
		'stk-navigation-view__wrapper',
		'edit-post-sidebar', // So that we can get the width of the sidebar.
	], {
		'stk--is-resizing': isResizing,
	} )

	return (
		<InspectorControls>
			{ /** This adds the styling necessary for the inspector to allot some space for the list view. */ }
			<style>
				{ ! isResizing ? `:is(.edit-post-sidebar, .edit-widgets-sidebar, .interface-complementary-area) {
					--stk-inspector-navigation-view: ${ height }px;
				}` : '' }
			</style>
			<ResizableBox
				className={ classNames }
				showHandle={ isOpen }
				enable={ { top: true } }
				size={ { height } }
				onResizeStart={ () => {
					setIsResizing( true )
				} }
				onResizeStop={ ( e, direction, ref, d ) => {
					const newHeight = height + d.height
					// There may be times that the height goes negative, prevent that.
					dispatch( 'stackable/navigation-view' ).updateHeight( newHeight < MIN_HEIGHT ? MIN_HEIGHT : newHeight )
					setIsResizing( false )
				} }
				minHeight={ MIN_HEIGHT }
				maxHeight={ 500 }
			>
				<PanelAdvancedSettings
					title={ __( 'Navigation', i18n ) }
					id="navigation-view"
					isOpen={ isOpen }
					onToggle={ () => dispatch( 'stackable/navigation-view' ).updateIsOpen( ! isOpen ) }
				>
					<div className="stk-panel--navigation-view__wrapper">
						{ isOpen && <ListView
							blocks={ blocks }
							showOnlyCurrentHierarchy
							showAppender
							showBlockMovers
							showNestedBlocks
							__experimentalFeatures
							__experimentalPersistentListViewFeatures
						/> }
					</div>
				</PanelAdvancedSettings>
			</ResizableBox>
		</InspectorControls>
	)
}

Edit.defaultProps = {
	hasToggle: false,
}

// Don't include the list view from auto-closing.
addFilter( 'stackable.panel.tabs.panel-auto-close', 'stackable/navigation-view', ( doToggle, toggle ) => {
	if ( toggle.closest( '.ugb-panel--navigation-view' ) ) {
		return false
	}
	return doToggle
} )
