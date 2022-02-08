/**
 * External dependencies
 */
import { i18n, settings } from 'stackable'
import { SVGStackableIcon } from '~stackable/icons'
import { Button } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks'
import { dispatch, useSelect } from '@wordpress/data'
import { __ } from '@wordpress/i18n'
import { useCallback } from '@wordpress/element'

const DesignLibraryButton = () => {
	const { getEditorDom } = useSelect( 'stackable/editor-dom' )

	const onClick = useCallback( () => {
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
		<Button
			onClick={ onClick }
			className="ugb-insert-library-button"
			label={ __( 'Open Design Library', i18n ) }
			icon={ <SVGStackableIcon /> }
		>{ __( 'Design Library', i18n ) }</Button>
	)
}

export default DesignLibraryButton
