/**
 * Per-block editor styles via Constructable Stylesheets, with a per-block
 * <style> fallback when adoptedStyleSheets is unavailable.
 *
 * Constructed stylesheets cannot be shared across documents. The block editor
 * may use the main document (classic) or an editor-canvas iframe (FSE / preview).
 * We only use constructable stylesheets on a single-document editor; inside the
 * iframe we use <style> tags to avoid cross-document adoption errors.
 */

const documentStyleSheets = new WeakMap()
const documentFallbackStyles = new WeakMap()

export const supportsConstructableStyleSheets = () => {
	return (
		typeof CSSStyleSheet !== 'undefined' &&
		'replaceSync' in CSSStyleSheet.prototype &&
		typeof Document !== 'undefined' &&
		'adoptedStyleSheets' in Document.prototype
	)
}

const getEditorCanvasDocument = () => {
	const iframeEl = document.querySelector( 'iframe[name="editor-canvas"]' )
	const iframeDoc = iframeEl?.contentDocument
	if ( iframeDoc?.body?.querySelector( '.block-editor-block-list__layout' ) ) {
		return iframeDoc
	}
	return null
}

/**
 * Resolve the document that actually hosts the block editor content.
 *
 * @param {Element|null} editorDom
 */
export const getTargetEditorDocument = editorDom => {
	if ( editorDom?.ownerDocument ) {
		return editorDom.ownerDocument
	}

	const canvasDoc = getEditorCanvasDocument()
	if ( canvasDoc ) {
		return canvasDoc
	}

	return document
}

/**
 * Constructable stylesheets cannot be adopted across the main document and the
 * editor iframe. Use them only when the editor lives on the main document.
 *
 * @param {Element|null} editorDom
 */
export const shouldUseConstructableStyleSheets = editorDom => {
	if ( ! supportsConstructableStyleSheets() ) {
		return false
	}

	const targetDoc = getTargetEditorDocument( editorDom )
	const canvasDoc = getEditorCanvasDocument()

	return ! canvasDoc || targetDoc === document
}

const getFallbackStyleId = key => {
	return `stk-block-css-${ key.replace( /[^a-zA-Z0-9-_]/g, '_' ) }`
}

const getDocumentStyleSheets = doc => {
	if ( ! documentStyleSheets.has( doc ) ) {
		documentStyleSheets.set( doc, new Map() )
	}
	return documentStyleSheets.get( doc )
}

const getDocumentFallbackStyles = doc => {
	if ( ! documentFallbackStyles.has( doc ) ) {
		documentFallbackStyles.set( doc, new Map() )
	}
	return documentFallbackStyles.get( doc )
}

const getBlockStyleSheet = ( key, doc ) => {
	const docSheets = getDocumentStyleSheets( doc )
	if ( ! docSheets.has( key ) ) {
		docSheets.set( key, new CSSStyleSheet() )
	}
	return docSheets.get( key )
}

const getFallbackStyleElement = ( key, doc ) => {
	const docFallbacks = getDocumentFallbackStyles( doc )
	if ( ! docFallbacks.has( key ) ) {
		const el = doc.createElement( 'style' )
		el.id = getFallbackStyleId( key )
		docFallbacks.set( key, el )
	}
	return docFallbacks.get( key )
}

const getOurSheetsForDocument = doc => {
	return Array.from( getDocumentStyleSheets( doc ).values() )
}

const getKnownEditorDocuments = () => {
	const docs = []

	if ( document?.adoptedStyleSheets ) {
		docs.push( document )
	}

	const canvasDoc = getEditorCanvasDocument()
	if ( canvasDoc?.adoptedStyleSheets && ! docs.includes( canvasDoc ) ) {
		docs.push( canvasDoc )
	}

	return docs
}

const releaseSheetsFromOtherDocuments = ( targetDoc, sheets ) => {
	if ( ! sheets.length ) {
		return
	}

	getKnownEditorDocuments().forEach( doc => {
		if ( doc === targetDoc || ! doc.adoptedStyleSheets?.length ) {
			return
		}

		const next = doc.adoptedStyleSheets.filter( sheet => {
			return ! sheets.includes( sheet )
		} )

		if ( next.length !== doc.adoptedStyleSheets.length ) {
			doc.adoptedStyleSheets = next
		}
	} )
}

const mergeAdoptedStyleSheets = doc => {
	if ( ! doc?.adoptedStyleSheets ) {
		return
	}

	const ourSheets = getOurSheetsForDocument( doc )
	if ( ! ourSheets.length ) {
		return
	}

	releaseSheetsFromOtherDocuments( doc, ourSheets )

	const foreignSheets = doc.adoptedStyleSheets.filter( sheet => {
		return ! ourSheets.includes( sheet )
	} )

	doc.adoptedStyleSheets = [ ...foreignSheets, ...ourSheets ]
}

const replaceSheetCss = ( sheet, css ) => {
	try {
		sheet.replaceSync( css || '' )
	} catch ( _error ) {
		// Ignore invalid CSS while controls are mid-edit.
	}
}

export const replaceBlockSheetCss = ( key, css, editorDom ) => {
	const doc = getTargetEditorDocument( editorDom )
	replaceSheetCss( getBlockStyleSheet( key, doc ), css )
}

export const adoptBlockStyleSheets = editorDom => {
	if ( ! shouldUseConstructableStyleSheets( editorDom ) ) {
		return
	}

	mergeAdoptedStyleSheets( getTargetEditorDocument( editorDom ) )
}

export const syncBlockStyleSheet = ( key, css, editorDom ) => {
	const doc = getTargetEditorDocument( editorDom )

	if ( shouldUseConstructableStyleSheets( editorDom ) ) {
		replaceBlockSheetCss( key, css, editorDom )
		mergeAdoptedStyleSheets( doc )
		return
	}

	const head = doc?.head
	if ( ! head ) {
		return
	}

	const styleEl = getFallbackStyleElement( key, doc )
	if ( styleEl.textContent !== ( css || '' ) ) {
		styleEl.textContent = css || ''
	}

	if ( ! head.contains( styleEl ) ) {
		head.appendChild( styleEl )
	}
}

export const removeBlockStyleSheet = ( key, editorDom ) => {
	const doc = getTargetEditorDocument( editorDom )

	getDocumentStyleSheets( doc ).delete( key )

	const fallbackEl = getDocumentFallbackStyles( doc ).get( key )
	if ( fallbackEl ) {
		fallbackEl.remove()
		getDocumentFallbackStyles( doc ).delete( key )
	}

	if ( shouldUseConstructableStyleSheets( editorDom ) && doc?.adoptedStyleSheets ) {
		mergeAdoptedStyleSheets( doc )
	}
}

export const readoptAllBlockStyleSheets = ( editorDom, blockStyles ) => {
	const doc = getTargetEditorDocument( editorDom )

	if ( shouldUseConstructableStyleSheets( editorDom ) ) {
		const docSheets = getDocumentStyleSheets( doc )

		for ( const key of docSheets.keys() ) {
			if ( ! ( key in blockStyles ) ) {
				docSheets.delete( key )
			}
		}

		Object.entries( blockStyles ).forEach( ( [ key, css ] ) => {
			replaceSheetCss( getBlockStyleSheet( key, doc ), css )
		} )
		mergeAdoptedStyleSheets( doc )
		return
	}

	Object.entries( blockStyles ).forEach( ( [ key, css ] ) => {
		syncBlockStyleSheet( key, css, editorDom )
	} )
}

export const getFallbackStyleElements = editorDom => {
	const doc = getTargetEditorDocument( editorDom )
	const head = doc?.head
	if ( ! head ) {
		return []
	}

	return Array.from( head.querySelectorAll( 'style[id^="stk-block-css-"]' ) )
}
