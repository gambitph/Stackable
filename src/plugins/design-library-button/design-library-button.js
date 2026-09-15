/**
 * External dependencies
 */
import { i18n, settings } from 'stackable'
import { SVGStackableIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks'
import {
	dispatch, select, useSelect,
} from '@wordpress/data'
import { __ } from '@wordpress/i18n'
import { useCallback } from '@wordpress/element'
import { ToolbarButton } from '@wordpress/components'
import { GuidedModalTour } from '~stackable/components'

const DesignLibraryButton = () => {
	const { getEditorDom } = useSelect( 'stackable/editor-dom' )

	const onClick = useCallback( () => {
		// If there's a design library block already in the editor, just open it.
		if ( getEditorDom()?.querySelector( '[data-type="stackable/design-library"]' ) ) {
			const button = getEditorDom()?.querySelector( `[data-type="stackable/design-library"] button` )
			// Open the design library.
			if ( button ) {
				button.click()
			}
			return
		}

		// Insert a design library block.
		const block = createBlock( 'stackable/design-library' )

		// "Show Template" locks the template root, so insert into its editable
		// post content area instead.
		const isTemplateShown = select( 'core/editor' )?.getRenderingMode?.() === 'template-locked'
		const rootClientId = isTemplateShown
			? select( 'core/block-editor' ).getBlocksByName( 'core/post-content' )?.[ 0 ]
			: undefined

		dispatch( 'core/block-editor' ).insertBlocks( block, undefined, rootClientId )
			.then( () => {
				const button = getEditorDom()?.querySelector( `[data-block="${ block.clientId }"] button` )
				// Open the design library.
				if ( button ) {
					button.click()
				}
			} )
	}, [ getEditorDom ] )

	return ( settings.stackable_enable_design_library &&
		<>
			{ /* TODO: This will need to only play on first time going to the editor, and if there's no quick button that started another tour */ }
			<GuidedModalTour tourId="editor" />
			<ToolbarButton
				onClick={ onClick }
				className="ugb-insert-library-button"
				icon={ <SVGStackableIcon /> }
			>{ __( 'Design Library', i18n ) }</ToolbarButton>
		</>
	)
}

export default DesignLibraryButton
