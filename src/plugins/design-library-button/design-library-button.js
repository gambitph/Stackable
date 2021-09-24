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
import { dispatch } from '@wordpress/data'
import { __ } from '@wordpress/i18n'

const DesignLibraryButton = () => {
	return ( settings.stackable_enable_design_library &&
		<Button
			onClick={ () => {
				// Insert a design library block.
				const block = createBlock( 'ugb/design-library' )

				dispatch( 'core/block-editor' ).insertBlocks( block )
					.then( () => {
						const button = document.querySelector( `[data-block="${ block.clientId }"] button` )
						// Open the design library.
						if ( button ) {
							button.click()
						}
					} )
			} }
			className="ugb-insert-library-button"
			label={ __( 'Open Design Library', i18n ) }
			icon={ <SVGStackableIcon /> }
		>{ __( 'Design Library', i18n ) }</Button>
	)
}

export default DesignLibraryButton
