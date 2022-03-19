/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { useSelect, useDispatch } from '@wordpress/data'
import { MenuItem, MenuGroup } from '@wordpress/components'
import { applyFilters } from '@wordpress/hooks'
import { BlockSettingsMenuControls } from '@wordpress/block-editor'

const SaveMenu = ( { clientId } ) => {
	const { getBlockName } = useSelect( 'core/block-editor' )

	const {
		blockName,
		hasDefaultBlockStyle,
		getBlockAttributes,
		getBlockInnerBlocks,
	} = useSelect( select => {
		// Remove attributes which remain as the default.
		const getCleanAttributes = ( attributes, blockName ) => {
			const { getBlockType } = select( 'core/blocks' )

			const defaultAttributes = getBlockType( blockName ).attributes
			const cleanedAttributes = Object.keys( attributes ).reduce( ( attrs, attrName ) => {
				if ( attributes[ attrName ] !== ( defaultAttributes[ attrName ] ? defaultAttributes[ attrName ].default : '' ) ) {
					attrs[ attrName ] = attributes[ attrName ]
				}
				return attrs
			}, {} )
			return cleanedAttributes
		}

		const blockName = select( 'core/block-editor' ).getBlockName( clientId )

		return {
			blockName: select( 'core/block-editor' ).getBlockName( clientId ),
			hasDefaultBlockStyle: () => {
				return blockName ? !! select( 'stackable/block-styles' ).getDefaultBlockStyle( blockName ) : false
			},
			getBlockAttributes: () => {
				const { getBlockName } = select( 'core/block-editor' )

				if ( ! clientId ) {
					return {}
				}

				const blockAttributes = select( 'core/block-editor' ).getBlockAttributes( clientId )
				const blockName = getBlockName( clientId ).replace( /^\w+\//g, '' )

				// Remove attributes which remain as the default.
				const cleanedAttributes = getCleanAttributes( blockAttributes, getBlockName( clientId ) )

				// Remove the unique class. Since this is generated by the block.
				cleanedAttributes.uniqueId = undefined

				// The filter should omit attributes which should not be overridden. For example, text titles.
				return applyFilters( `stackable.${ blockName }.design.filtered-block-attributes`, cleanedAttributes )
			},
			getBlockInnerBlocks: () => {
				const { getBlock } = select( 'core/block-editor' )

				// Only do this if only 1 block is selected.
				if ( ! clientId ) {
					return []
				}

				const getBlockTemplate = block => {
					return [
						block.name,
						getCleanAttributes( block.attributes, block.name ),
						block.innerBlocks.map( getBlockTemplate ),
					]
				}

				const innerBlocks = getBlock( clientId ).innerBlocks || []
				return innerBlocks.map( getBlockTemplate )
			},
		}
	} )

	const {
		deleteBlockDefaultStyle,
		updateBlockDefaultStyle,
	} = useDispatch( 'stackable/block-styles' )

	// Only do this if the block is ours.
	if ( ! clientId || ! getBlockName( clientId )?.startsWith( 'stackable/' ) ) {
		return null
	}

	return (
		<>
			<BlockSettingsMenuControls>
				{ ( { onClose } ) => (
					<>
						<MenuGroup label="test">
							<MenuItem
								icon="sticky"
								onClick={ () => {
									const attributes = getBlockAttributes()
									const innerBlocks = getBlockInnerBlocks()
									updateBlockDefaultStyle( blockName, attributes, innerBlocks )
									onClose()
								} }
							>
								{ __( 'Save as Default Block', i18n ) }
							</MenuItem>
							{ hasDefaultBlockStyle() && (
								<MenuItem
									icon="editor-removeformatting"
									onClick={ () => {
										deleteBlockDefaultStyle( blockName )
										onClose()
									} }
								>
									{ __( 'Reset Default Block', i18n ) }
								</MenuItem>
							) }
						</MenuGroup>
					</>
				) }
			</BlockSettingsMenuControls>
		</>
	)
}

export default SaveMenu
