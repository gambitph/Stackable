import { useQueryLoopInstanceId } from '~stackable/util'
import { useMemo, useRef } from '@wordpress/element'
import { useRafEffect } from '~stackable/hooks'
import CssSaveCompiler from './css-save-compiler'

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

	// Keep the old text attribute for comparison to prevent block style generation when only the text attribute has changed.
	const oldText = useRef( attributes.text )

	// Keep the generated CSS for editor and return it when only the text attribute has changed.
	const oldCss = useRef( null )

	const editCss = useMemo( () => {
		if ( oldText.current !== attributes.text ) {
			oldText.current = attributes.text
			return oldCss.current
		}
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
		oldCss.current = css
		return css
	}, [ attributes, version, blockState, clientId, attributes.uniqueId, instanceId, context ] )

	useRafEffect( () => {
		if ( oldText.current !== attributes.text ) {
			oldText.current = attributes.text
			return
		}

		const cssCompiler = new CssSaveCompiler()

		// Generate the styles that are to be saved with the actual block.
		const saveCss = blockStyles.generateBlockStylesForSave(
			cssCompiler,
			attributes,
			blockStyleDefsRef.current,
			{
				version,
			}
		)

		// Quietly save the styles. We cannot use setAttributes here because it
		// will cause the block and this hook to rerender.
		// dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
		// setAttributes( { generatedCss: saveCss } )
		attributes.generatedCss = saveCss
	}, [ attributes, version ] )

	return editCss
}
