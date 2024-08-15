import { useQueryLoopInstanceId } from '~stackable/util'
import { useMemo, useRef } from '@wordpress/element'
import { useRafEffect } from '~stackable/hooks'

export const useBlockCssGenerator = props => {
	const {
		blockStyles,
		version,
		clientId,
		context,
		attributes,
		blockState,
	} = props

	// Keep the filtered block styles that we will update.
	const blockStyleDefsRef = useRef( [] )

	// Generate the CSS styles.
	const instanceId = useQueryLoopInstanceId( attributes.uniqueId )

	const editCss = useMemo( () => {
		// Gather only the attributes that have values and all their
		// corresponding block style definitions.
		const attrNamesWithValues = blockStyles.getAttributesWithValues( attributes )
		blockStyleDefsRef.current = blockStyles.getBlockStyles( attrNamesWithValues )

		// These are the styles to be displayed in the editor.
		const css = blockStyles.generateBlockStylesForEditor( attributes, blockStyleDefsRef.current, {
			version,
			blockState,
			uniqueId: attributes.uniqueId,
			instanceId, // This is used by the native Query Loop block.
			clientId,
			context, // This is used for dynamic content.
		} )
		return css
	}, [ attributes, version, blockState, clientId, attributes.uniqueId, instanceId, context ] )

	useRafEffect( () => {
		// Generate the styles that are to be saved with the actual block.
		const saveCss = blockStyles.generateBlockStylesForSave( attributes, blockStyleDefsRef.current, {
			version,
		} )

		// Quietly save the styles. We cannot use setAttributes here because it
		// will cause the block and this hook to rerender.
		// dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
		// setAttributes( { generatedCss: saveCss } )
		attributes.generatedCss = saveCss
	}, [ attributes, blockStyleDefsRef.current, version ] )

	return editCss
}
