/**
 * Internal dependencies
 */
import previewImage from './images/preview.jpg'
import { i18n, srcUrl } from 'stackable'
import {
	Button,
	ModalDesignLibrary,
} from '~stackable/components'
import { SVGStackableIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { dispatch } from '@wordpress/data'
import { createBlock, parse } from '@wordpress/blocks'
import { useState, useCallback } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import { Placeholder } from '@wordpress/components'

const Edit = props => {
	const {
		clientId,
		attributes,
	} = props

	const [ isLibraryOpen, setIsLibraryOpen ] = useState( false )

	// Replaces the current block with a block made out of attributes.
	const replaceBlockWithAttributes = useCallback( ( blockName, attributes, innerBlocks ) => {
		const { replaceBlock } = dispatch( 'core/block-editor' )

		const shortBlockName = blockName.replace( /^\w+\//g, '' )
		const blockAttributes = applyFilters( `stackable.${ shortBlockName }.design.filtered-block-attributes`, attributes )

		const block = createBlock( blockName, blockAttributes, innerBlocks )
		replaceBlock( clientId, block )
	}, [ clientId ] )

	const replaceBlocWithContent = useCallback( serializedBlock => {
		const { replaceBlocks } = dispatch( 'core/block-editor' )
		const block = parse( serializedBlock )
		replaceBlocks( clientId, block )
	}, [ clientId ] )

	if ( attributes.previewMode ) {
		const src = previewImage.match( /https?:/i ) ? previewImage
			: srcUrl ? `${ srcUrl }/${ previewImage }`
				: previewImage

		return (
			<div className="ugb-design-library-block">
				<img src={ src } alt="design-library" />
			</div>
		)
	}

	return (
		<div className="ugb-design-library-block">
			<Placeholder
				icon={ <SVGStackableIcon /> }
				label={ __( 'Stackable Design Library', i18n ) }
				instructions={ __( 'Open the Design Library and select a pre-designed block or layout.', i18n ) }
			>
				<Button
					isSecondary
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
							replaceBlockWithAttributes( name, applyFilters( 'stackable.design-library.attributes', attributes ), [] )
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

export default Edit
