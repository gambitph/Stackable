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
import {
	createBlock, parse, createBlocksFromInnerBlocksTemplate, getBlockVariations,
} from '@wordpress/blocks'
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
	const replaceBlockWithAttributes = useCallback( ( blockName, attributes, innerBlocks, design ) => {
		const { replaceBlock } = dispatch( 'core/block-editor' )

		// For wireframes, we'll need to apply any default block attributes to
		// the blocks. We do this by ensuring that all uniqueIds are removed,
		// this prompts the block to generate a new one and give itself a
		// default styling.
		if ( design.uikit === 'Wireframes' ) {
			const hasVariations = getBlockVariations( blockName ).length > 0
			if ( ! hasVariations ) {
				attributes.uniqueId = ''
			}

			// Recursively remove all uniqueIds from all inner blocks.
			const removeUniqueId = blocks => {
				blocks.forEach( block => {
					const blockName = block[ 0 ]

					// For blocks with varitions, do not remove the uniqueId
					// since that will prompt the layout picker to show.
					const hasVariations = getBlockVariations( blockName ).length > 0
					if ( ! hasVariations && block[ 1 ].uniqueId ) {
						delete block[ 1 ].uniqueId
					}

					removeUniqueId( block[ 2 ] )
				} )
			}

			removeUniqueId( innerBlocks )
		}

		const shortBlockName = blockName.replace( /^\w+\//g, '' )
		const blockAttributes = applyFilters( `stackable.${ shortBlockName }.design.filtered-block-attributes`, attributes )

		const block = createBlock( blockName, blockAttributes, createBlocksFromInnerBlocksTemplate( innerBlocks ) )
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
					onSelect={ ( designData, design ) => {
						const {
							name, attributes, innerBlocks, serialized,
						} = designData

						if ( name && attributes ) {
							replaceBlockWithAttributes( name, applyFilters( 'stackable.design-library.attributes', attributes ), innerBlocks || [], design )
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
