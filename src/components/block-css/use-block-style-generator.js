import { useQueryLoopInstanceId } from '~stackable/util'
import {
	useLayoutEffect, useMemo, useRef,
} from '@wordpress/element'
import {
	dispatch, select, useSelect,
} from '@wordpress/data'
import { useRafEffect } from '~stackable/hooks'
import CssSaveCompiler from './css-save-compiler'
import { createStyleDependencyFingerprint } from './util'

export const useBlockCssGenerator = props => {
	const {
		blockStyles,
		version,
		clientId,
		context,
		attributes,
		blockState,
		setAttributes,
	} = props

	// Keep the filtered block styles that we will update.
	const blockStyleDefsRef = useRef( [] )

	// Generate the CSS styles.
	const instanceId = useQueryLoopInstanceId( attributes.uniqueId )

	const styleDependencyAttrNames = useMemo(
		() => blockStyles.getStyleDependencyAttributeNames(),
		[ blockStyles ]
	)

	// Cheap fingerprint of style-related attributes only. Recomputed when
	// attributes change, but editCss only regenerates when the fingerprint changes.
	const styleFingerprint = useMemo(
		() => createStyleDependencyFingerprint( attributes, styleDependencyAttrNames ),
		[ attributes, styleDependencyAttrNames ]
	)

	const editCss = useMemo( () => {
		// Gather only the attributes that have values and all their
		// corresponding block style definitions.
		const attrNamesWithValues = blockStyles.getAttributesWithValues( attributes )
		blockStyleDefsRef.current = blockStyles.getBlockStyles( attrNamesWithValues )

		// These are the styles to be displayed in the editor.
		return blockStyles.generateBlockStylesForEditor( attributes, blockStyleDefsRef.current, {
			version,
			blockState,
			uniqueId: attributes.uniqueId,
			instanceId, // This is used by the native Query Loop block.
			clientId,
			context, // This is used for dynamic content.
		} )
	}, [ styleFingerprint, version, blockState, clientId, attributes.uniqueId, instanceId, context, blockStyles ] )

	useRafEffect( () => {
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

		// If the generated CSS is the same as the one already saved, we don't need to update it.
		if ( ! setAttributes || attributes.generatedCss === saveCss ) {
			return
		}

		// Use setAttributes to reliably update the generated CSS.
		// Mutating the attributes directly will not trigger a re-render,
		// but might not properly save the changes.
		dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
		setAttributes( { generatedCss: saveCss } )
	}, [ styleFingerprint, version, blockStyles, setAttributes ] )

	const styleKey = `${ clientId }-${ instanceId }`
	const editorDom = useSelect( select => {
		return select( 'stackable/editor-dom' )?.getEditorDom()
	} )

	// Returning null for every block left template-preview iframes without CSS.
	// Use the unified stylesheet only for a current editor document, otherwise
	// return CSS so each preview is styled inside its own document.
	const editorCanvasDocument = document.querySelector( 'iframe[name="editor-canvas"]' )?.contentDocument
	const isCurrentEditorDom = editorDom?.isConnected && (
		editorDom.ownerDocument === document ||
		editorDom.ownerDocument === editorCanvasDocument
	)

	useLayoutEffect( () => {
		dispatch( 'stackable/editor-block-css' ).setBlockCss( styleKey, editCss || '' )
		return () => {
			// Keep CSS in the store across preview remounts. Only remove when the
			// block was actually deleted from the editor.
			const block = select( 'core/block-editor' )?.getBlock( clientId )
			if ( ! block ) {
				dispatch( 'stackable/editor-block-css' ).removeBlockCss( styleKey )
			}
		}
	}, [ styleKey, editCss, clientId ] )

	return isCurrentEditorDom ? null : editCss
}
