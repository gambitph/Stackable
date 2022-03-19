/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { cloneDeep } from 'lodash'

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

				const blockAttributes = cloneDeep( select( 'core/block-editor' ).getBlockAttributes( clientId ) )
				const blockName = getBlockName( clientId ).replace( /^\w+\//g, '' )

				// Remove the unique class. Since this is generated by the block.
				blockAttributes.uniqueId = undefined

				// The filter should omit attributes which should not be overridden. For example, text titles.
				return applyFilters( `stackable.${ blockName }.design.filtered-block-attributes`, blockAttributes )
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
						cloneDeep( block.attributes ),
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
						<MenuGroup label="Stackable">
							<MenuItem
								icon="sticky"
								onClick={ () => {
									const attributes = getBlockAttributes()
									const innerBlocks = getBlockInnerBlocks()
									updateBlockDefaultStyle( blockName, attributes, innerBlocks )
									onClose()
								} }
							>
								{ __( 'Save as Default Block Style', i18n ) }
							</MenuItem>
							{ hasDefaultBlockStyle() && (
								<MenuItem
									icon="editor-removeformatting"
									onClick={ () => {
										deleteBlockDefaultStyle( blockName )
										onClose()
									} }
								>
									{ __( 'Reset Default Block Style', i18n ) }
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
