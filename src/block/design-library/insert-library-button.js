/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { SVGStackableIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components'
import { createBlock } from '@wordpress/blocks'
import { dispatch } from '@wordpress/data'
import { __ } from '@wordpress/i18n'

const InsertLibraryButton = () => {
	return (
		<Button
			onClick={ () => {
				// Insert a design library block.
				const block = createBlock( 'ugb/design-library' )

				dispatch( 'core/block-editor' ).insertBlocks( block )
					.then( () => {
						const button = document.querySelector( `[data-block="${ block.clientId }"] .ugb-design-library-block__button` )
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

export default InsertLibraryButton
