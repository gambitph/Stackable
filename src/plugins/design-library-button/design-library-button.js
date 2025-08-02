/**
 * External dependencies
 */
import { i18n, settings } from 'stackable'
import { SVGStackableIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks'
import { dispatch, useSelect } from '@wordpress/data'
import { __ } from '@wordpress/i18n'
import { useCallback } from '@wordpress/element'
import { ToolbarButton } from '@wordpress/components'
import { GuidedModalTour } from '~stackable/components'

const STEPS = [
	{
		title: '👋 ' + __( 'Welcome to Stackable', i18n ),
		description: __( 'We’re excited to have you here. Let\’s get you started by opening the Design Library. Click the button above to get started.', i18n ),
		// size: 'medium',
		anchor: '.ugb-insert-library-button',
		position: 'bottom',
		nextEventTarget: '.ugb-insert-library-button',
		glowTarget: '.ugb-insert-library-button',
		showNext: false,
	},
]

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

		dispatch( 'core/block-editor' ).insertBlocks( block )
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
			<GuidedModalTour steps={ STEPS } hasConfetti={ false } />
			<ToolbarButton
				onClick={ onClick }
				className="ugb-insert-library-button"
				icon={ <SVGStackableIcon /> }
			>{ __( 'Design Library', i18n ) }</ToolbarButton>
		</>
	)
}

export default DesignLibraryButton
