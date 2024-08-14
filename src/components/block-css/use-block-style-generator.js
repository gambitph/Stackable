import { useRafMemo } from '~stackable/hooks'
import { useQueryLoopInstanceId } from '~stackable/util'
import { dispatch } from '@wordpress/data'

export const useBlockCssGenerator = props => {
	const {
		blockStyles,
		version,
		clientId,
		context,
		attributes,
		setAttributes,
		blockState,
	} = props

	// Generate the CSS styles.
	const instanceId = useQueryLoopInstanceId( attributes.uniqueId )
	return useRafMemo( () => {
		// Gather only the attributes that have values and all their
		// corresponding block style definitions.
		const attrNamesWithValues = blockStyles.getAttributesWithValues( attributes )
		const blockStyleDefs = blockStyles.getBlockStyles( attrNamesWithValues )

		// Generate the styles that are to be saved with the actual block.
		const savedCss = blockStyles.generateBlockStylesForSave( attributes, blockStyleDefs, {
			version,
		} )

		// Quietly save the styles.
		dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
		setAttributes( { generatedCss: savedCss } )

		// These are the styles to be displayed in the editor.
		return blockStyles.generateBlockStylesForEditor( attributes, blockStyleDefs, {
			version,
			blockState,
			uniqueId: attributes.uniqueId,
			instanceId, // This is used by the native Query Loop block.
			clientId,
			context, // This is used for dynamic content.
		} )
	}, [ attributes, version, blockState, clientId, attributes.uniqueId, instanceId, context, setAttributes ] )
}
