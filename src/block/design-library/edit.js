/**
 * External dependencies.
 */
import { SVGStackableIcon } from '~stackable/icons'
import { ModalDesignLibrary } from '~stackable/components'
import { i18n } from 'stackable'

/**
 * WordPress dependencies.
 */
import {
	Button, Placeholder,
} from '@wordpress/components'
import { compose } from '@wordpress/compose'
import { createBlock } from '@wordpress/blocks'
import { withDispatch } from '@wordpress/data'
import { useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

const edit = ( { replaceBlock } ) => {
	const [ isLibraryOpen, setIsLibraryOpen ] = useState( false ) // eslint-disable-line react-hooks/rules-of-hooks

	return (
		<div className="ugb-design-library-block">
			<Placeholder
				icon={ <SVGStackableIcon /> }
				label={ __( 'Stackable Design Library', i18n ) }
				instructions={ __( 'Open the Design Library and select a pre-designed block or layout.', i18n ) }
			>
				<Button
					isPrimary
					isLarge
					className="ugb-design-library-block__button"
					onClick={ () => {
						setIsLibraryOpen( true )
					} }
				>{ __( 'Open Design Library', i18n ) }</Button>
			</Placeholder>

			{ isLibraryOpen &&
				<ModalDesignLibrary
					onClose={ () => {
						setIsLibraryOpen( false )
					} }
					onSelect={ ( {
						name, attributes, innerBlocks,
					} ) => {
						replaceBlock( name, attributes, innerBlocks )
					} }
				/>
			}
		</div>
	)
}

export default compose( [
	withDispatch( ( dispatch, { clientId } ) => {
		const { replaceBlock } = dispatch( 'core/block-editor' )
		return {
			replaceBlock: ( blockName, attributes, innerBlocks ) => {
				const block = createBlock( blockName, attributes, innerBlocks )
				replaceBlock( clientId, block )
			},
		}
	} ),
] )( edit )
