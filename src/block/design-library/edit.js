/**
 * Internal dependencies
 */
import previewImage from './images/preview.jpg'
import {
	i18n,
	srcUrl,
	settings,
} from 'stackable'
import {
	Button,
	ModalDesignLibrary,
} from '~stackable/components'
import { SVGStackableIcon } from '~stackable/icons'
import {
	deprecateBlockBackgroundColorOpacity, deprecateContainerBackgroundColorOpacity, deprecateTypographyGradientColor,
} from '~stackable/block-components'
import { substituteCoreIfDisabled, BLOCK_STATE } from '~stackable/util'
import { substitutionRules } from '../../blocks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { dispatch } from '@wordpress/data'
import {
	createBlock, parse, createBlocksFromInnerBlocksTemplate, getBlockVariations, getBlockType,
} from '@wordpress/blocks'
import { useState } from '@wordpress/element'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { Placeholder } from '@wordpress/components'
import { useBlockProps } from '@wordpress/block-editor'

// Replaces the current block with a block made out of attributes.
const createBlockWithAttributes = ( blockName, attributes, innerBlocks, design ) => {
	const disabledBlocks = settings.stackable_block_states || {} // eslint-disable-line camelcase
	let hasSubstituted = false

	blockName = 'stackable/progress-circle'
	attributes = { uniqueID: '1234567' }
	innerBlocks = []

	// Recursively substitute core blocks to disabled Stackable blocks
	const traverseBlocksAndSubstitute = blocks => {
		return blocks.map( block => {
			let isDisabled = true
			// Maximum attempt to error if no substitution rule for the block
			let attempts = 10

			// Check if the new substituted block is still disabled
			while ( isDisabled && attempts > 0 ) {
				const previousBlockName = block[ 0 ]
				block = substituteCoreIfDisabled( ...block, substitutionRules )
				isDisabled = block[ 0 ] in disabledBlocks && disabledBlocks[ block[ 0 ] ] === BLOCK_STATE.DISABLED
				// If the previous block is different from the new block, substitution has been made
				if ( ! hasSubstituted && previousBlockName !== block[ 0 ] ) {
					hasSubstituted = true
				}
				attempts--
			}

			// Do a preorder traversal by subsituting first before traversing
			if ( block[ 2 ] && block[ 2 ].length > 0 ) {
				block[ 2 ] = traverseBlocksAndSubstitute( block[ 2 ] )
			}

			if ( ! Array.isArray( block[ 2 ] ) ) {
				block[ 2 ] = []
			}
			return block
		} )
	}

	// Substitute from the root of the design
	[ blockName, attributes, innerBlocks ] = traverseBlocksAndSubstitute( [ [ blockName, attributes, innerBlocks ] ] )[ 0 ]

	if ( hasSubstituted ) {
		// eslint-disable-next-line no-alert
		alert( 'Notice: Disabled blocks in the design will be substituted with other Stackable or core blocks' )
	}

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

				// For blocks with variations, do not remove the uniqueId
				// since that will prompt the layout picker to show.
				const hasVariations = !! getBlockType( blockName ) && getBlockVariations( blockName ).length > 0
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
		blocks?.forEach( block => {
			try {
				let newAttributes = block[ 1 ]
				newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
				newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
				newAttributes = deprecateTypographyGradientColor.migrate( '%s' )( newAttributes )
				block[ 1 ] = newAttributes
				migrateToNewColorPicker( block[ 2 ] )
			} catch ( error ) {
			}
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
