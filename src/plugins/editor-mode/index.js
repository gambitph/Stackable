/**
 * Wordpress dependencies
 */
import domReady from '@wordpress/dom-ready'

const query = '.edit-post-visual-editor'

const observerCallback = () => {
	const visualEditorEl = document.querySelector( query )

	// Gets the editor's current preview width
	const { width } = getComputedStyle( visualEditorEl ) //eslint-disable-line

	const editorBlocksAttributes = Array.from( document.styleSheets ).filter( stylesheet => stylesheet.href && stylesheet.href.includes( '/dist/editor_blocks' ) ) // eslint-disable-line
}

const __experimentalEditorPreviewMode = () => {
	const visualEditorEl = document.querySelector( query )

	// Observes only the attribute changes of the element
	const config = {
		attributes: true, childList: true, subtree: true,
	}

	/*
     * Creates an observer instance based on attribute changes
     * in visualEditorEl.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
     */
	const visualEditorElObserver = new MutationObserver( observerCallback )

	visualEditorElObserver.observe( visualEditorEl, config )
}

const editorPreviewMode = __experimentalEditorPreviewMode

domReady( editorPreviewMode )
