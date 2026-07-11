import { useQueryLoopInstanceId } from '~stackable/util'
import {
	useLayoutEffect, useMemo, useRef,
} from '@wordpress/element'
import { dispatch, select } from '@wordpress/data'
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

		// Quietly save the styles. We cannot use setAttributes here because it
		// will cause the block and this hook to rerender.
		// dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
		// setAttributes( { generatedCss: saveCss } )
		attributes.generatedCss = saveCss
	}, [ styleFingerprint, version, blockStyles ] )

	const styleKey = `${ clientId }-${ instanceId }`

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

	// We used to return the CSS here, but for optimization, now
	// CSS is injected via the unified editor stylesheet plugin.
	return null
}
