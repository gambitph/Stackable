/**
 * Unified editor block styles via per-block Constructable Stylesheets.
 *
 * Block CSS is registered in the stackable/editor-block-css store. Each block
 * gets its own CSSStyleSheet (or fallback <style> tag) so edits only update
 * one block's CSS instead of reparsing the entire page.
 */

/**
 * Internal dependencies
 */
import './store'
import {
	adoptBlockStyleSheets,
	getFallbackStyleElements,
	readoptAllBlockStyleSheets,
	removeBlockStyleSheet,
	replaceBlockSheetCss,
	shouldUseConstructableStyleSheets,
	syncBlockStyleSheet,
} from './block-style-sheets'

/**
 * External dependencies
 */
import { useDeviceType } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { getPlugin, registerPlugin } from '@wordpress/plugins'
import { useEffect, useLayoutEffect } from '@wordpress/element'
import {
	select, subscribe, useSelect,
} from '@wordpress/data'

const getEditorHeadFromDom = editorDom => {
	const editorBody = editorDom?.closest?.( 'body' )
	return editorBody?.ownerDocument?.head || null
}

const readoptAllFromStore = editorDom => {
	readoptAllBlockStyleSheets(
		editorDom,
		select( 'stackable/editor-block-css' ).getBlockStyles()
	)
}

let rafId = 0
const pendingKeys = new Set()
let pendingRemovals = new Set()

const scheduleStyleUpdates = () => {
	if ( rafId ) {
		return
	}

	rafId = requestAnimationFrame( () => {
		rafId = 0

		const editorDom = select( 'stackable/editor-dom' ).getEditorDom()
		const blockStyles = select( 'stackable/editor-block-css' ).getBlockStyles()

		const hadRemovals = pendingRemovals.size > 0
		pendingRemovals.forEach( key => {
			removeBlockStyleSheet( key, editorDom )
		} )
		pendingRemovals = new Set()

		const keysToUpdate = [ ...pendingKeys ]
		pendingKeys.clear()

		keysToUpdate.forEach( key => {
			if ( shouldUseConstructableStyleSheets( editorDom ) ) {
				replaceBlockSheetCss( key, blockStyles[ key ], editorDom )
			} else {
				syncBlockStyleSheet( key, blockStyles[ key ], editorDom )
			}
		} )

		if ( shouldUseConstructableStyleSheets( editorDom ) && ( keysToUpdate.length || hadRemovals ) ) {
			adoptBlockStyleSheets( editorDom )
		}
	} )
}

if ( ! window.__stkEditorBlockCssSubscribed ) {
	window.__stkEditorBlockCssSubscribed = true
	subscribe( () => {
		const lastChange = select( 'stackable/editor-block-css' ).getLastChange()
		if ( ! lastChange ) {
			return
		}

		if ( lastChange.type === 'SET' ) {
			pendingKeys.add( lastChange.key )
			pendingRemovals.delete( lastChange.key )
		} else if ( lastChange.type === 'REMOVE' ) {
			pendingKeys.delete( lastChange.key )
			pendingRemovals.add( lastChange.key )
		}

		scheduleStyleUpdates()
	}, 'stackable/editor-block-css' )
}

const EditorBlockCssLoader = () => {
	const deviceType = useDeviceType()
	const editorDom = useSelect( select => {
		return select( 'stackable/editor-dom' ).getEditorDom()
	} )

	// Re-adopt all block stylesheets when the editor iframe remounts.
	useLayoutEffect( () => {
		readoptAllFromStore( editorDom )
	}, [ editorDom, deviceType ] )

	// Fallback mode: Gutenberg can remove <style> tags from the editor head.
	useEffect( () => {
		if ( shouldUseConstructableStyleSheets( editorDom ) ) {
			return undefined
		}

		const editorHead = getEditorHeadFromDom( editorDom )
		if ( ! editorHead ) {
			return undefined
		}

		const observer = new MutationObserver( () => {
			const blockStyles = select( 'stackable/editor-block-css' ).getBlockStyles()
			const mountedIds = new Set(
				getFallbackStyleElements( editorDom ).map( el => el.id )
			)

			Object.keys( blockStyles ).forEach( key => {
				if ( ! mountedIds.has( `stk-block-css-${ key.replace( /[^a-zA-Z0-9-_]/g, '_' ) }` ) ) {
					syncBlockStyleSheet( key, blockStyles[ key ], editorDom )
				}
			} )
		} )

		observer.observe( editorHead, { childList: true } )

		return () => observer.disconnect()
	}, [ editorDom, deviceType ] )

	return null
}

if ( ! getPlugin( 'stackable-editor-block-css-loader' ) ) {
	registerPlugin( 'stackable-editor-block-css-loader', {
		render: EditorBlockCssLoader,
	} )
}
