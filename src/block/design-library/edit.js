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
import { createBlock, parse } from '@wordpress/blocks'
import { withDispatch } from '@wordpress/data'
import { useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

const edit = ( { replaceBlockWithAttributes, replaceBlocWithContent } ) => {
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
					onSelect={ designData => {
						const {
							name, attributes, serialized,
						} = designData

						if ( name && attributes ) {
							replaceBlockWithAttributes( name, attributes, [] )
						} else if ( serialized ) {
							replaceBlocWithContent( serialized )
						} else {
							console.error( 'Design library selection failed: No block data found' ) // eslint-disable-line no-console
						}
					} }
				/>
			}
		</div>
	)
}

export default compose( [
	withDispatch( ( dispatch, { clientId } ) => {
		const { replaceBlock, replaceBlocks } = dispatch( 'core/block-editor' )
		return {
			// Replaces the current block with a block made out of attributes.
			replaceBlockWithAttributes: ( blockName, attributes, innerBlocks ) => {
				const block = createBlock( blockName, attributes, innerBlocks )
				replaceBlock( clientId, block )
			},
			// Replaces the current block with one or more blocks from a string.
			replaceBlocWithContent: serializedBlock => {
				const block = parse( serializedBlock )
				replaceBlocks( clientId, block )
			},
		}
	} ),
] )( edit )
