/**
 * WordPress dependencies
 */
import { registerPlugin, getPlugin } from '@wordpress/plugins'
import { useEffect } from '@wordpress/element'
import { useSelect } from '@wordpress/data'

const HideDefaultStylePanel = () => {
	const { selectedBlockName, hasBlockStyles } = useSelect( select => {
		const {
			getSelectedBlockClientId,
			getBlockName,
		} = select( 'core/block-editor' )
		const { getBlockStyles } = select( 'core/blocks' )
		const selectedBlockClientId = getSelectedBlockClientId()
		const selectedBlockName = selectedBlockClientId && getBlockName( selectedBlockClientId )
		const styles = selectedBlockClientId && getBlockStyles( selectedBlockName )
		return {
			selectedBlockClientId,
			selectedBlockName,
			hasBlockStyles: styles && styles.length > 0,
		}
	}, [] )

	useEffect( () => {
		const sidebarEl = document.querySelector( '.edit-post-sidebar' )
		if ( selectedBlockName && hasBlockStyles && selectedBlockName.startsWith( 'stackable/' ) ) {
			sidebarEl?.classList?.add( 'stk--hide-default-style-panel' )
		} else {
			sidebarEl?.classList?.remove( 'stk--hide-default-style-panel' )
		}
		return () => sidebarEl?.classList?.remove( 'stk--hide-default-style-panel' )
	}, [ selectedBlockName, hasBlockStyles ] )

	return null
}

if ( ! getPlugin( 'stackable-hide-default-style-panel' ) ) {
	registerPlugin( 'stackable-hide-default-style-panel', { render: HideDefaultStylePanel } )
}
