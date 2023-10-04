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
import {
	deprecateBlockBackgroundColorOpacity, deprecateContainerBackgroundColorOpacity, deprecateTypographyGradientColor,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { dispatch } from '@wordpress/data'
import {
	createBlock, parse, createBlocksFromInnerBlocksTemplate, getBlockVariations,
} from '@wordpress/blocks'
import { useState } from '@wordpress/element'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { Placeholder } from '@wordpress/components'
import { useBlockProps } from '@wordpress/block-editor'

// Replaces the current block with a block made out of attributes.
const createBlockWithAttributes = ( blockName, attributes, innerBlocks, design ) => {
	// const { replaceBlock } = dispatch( 'core/block-editor' )

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

	// Recursively update the attributes of all inner blocks for the new Color Picker
	const migrateToNewColorPicker = blocks => {
		blocks.forEach( block => {
			let newAttributes = block[ 1 ]
			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateTypographyGradientColor.migrate( '%s' )( newAttributes )
			block[ 1 ] = newAttributes
			migrateToNewColorPicker( block[ 2 ] )
		} )
	}

	migrateToNewColorPicker( innerBlocks )

	addFilter( `stackable.${ shortBlockName }.design.filtered-block-attributes`, 'stackable.design-library.attributes--migrate-to-new-color-picker', attributes => {
		let newAttributes = { ...attributes }
		newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
		newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
		newAttributes = deprecateTypographyGradientColor.migrate( '%s' )( newAttributes )
		return newAttributes
	} )

	const blockAttributes = applyFilters( `stackable.${ shortBlockName }.design.filtered-block-attributes`, attributes )

	return createBlock( blockName, blockAttributes, createBlocksFromInnerBlocksTemplate( innerBlocks ) )
}

const createBlockWithContent = serializedBlock => {
	return parse( serializedBlock )
}

const Edit = props => {
	const {
		clientId,
		attributes,
	} = props

	const [ isLibraryOpen, setIsLibraryOpen ] = useState( false )

	const blockProps = useBlockProps( {
		className: 'ugb-design-library-block',
	} )

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
		<div { ...blockProps }>
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
					onSelect={ ( _designData, _design, callback = null ) => {
						const designData = ! Array.isArray( _designData ) ? [ _designData ] : _designData
						const designs = ! Array.isArray( _design ) ? [ _design ] : _design

						const blocks = designData.reduce( ( blocks, designData, i ) => {
							const design = designs[ i ]
							const {
								name, attributes, innerBlocks, serialized,
							} = designData
							if ( name && attributes ) {
								const block = createBlockWithAttributes( name, applyFilters( 'stackable.design-library.attributes', attributes ), innerBlocks || [], design )
								blocks.push( block )
							} else if ( serialized ) {
								blocks.push( createBlockWithContent( serialized ) )
							} else {
								console.error( 'Design library selection failed: No block data found' ) // eslint-disable-line no-console
							}
							return blocks
						}, [] )

						if ( blocks.length ) {
							dispatch( 'core/block-editor' ).replaceBlocks( clientId, blocks )
							if ( callback ) {
								callback()
							}
						}
					} }
				/>
			}
		</div>
	)
}

export default Edit
