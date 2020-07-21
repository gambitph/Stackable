/**
 * Wordpress dependencies
 */
import domReady from '@wordpress/dom-ready'

/**
 * External dependencies
 */
import {
	keys, inRange,
} from 'lodash'

const query = '.edit-post-visual-editor'

// Preview Mode responsive width
const TABLET_MODE_WIDTH = '780px'
const MOBILE_MODE_WIDTH = '360px'

// CSS files to compare
const includesCss = [
	'/dist/frontend_blocks',
	'/dist/editor_blocks',
]

const cssObject = {}

const observerCallback = () => {
	// Gets the element of visual editor wrapper
	const visualEditorEl = document.querySelector( query )

	// Gets the current width of the visual editor
	const { width } = getComputedStyle( visualEditorEl ) //eslint-disable-line no-undef

	// Stores the indices of needed styleSheets
	const stylesheetIndices = []

	const styleSheets = Array.from( document.styleSheets )

	styleSheets.forEach( ( { href }, index ) => {
		if ( ( href && new RegExp( includesCss.join( '|' ) ).test( href ) ) || href === null ) {
			stylesheetIndices.push( index )
		}
	} )

	stylesheetIndices.forEach( index => {
		const mediaIndices = {}

		Array.from( styleSheets[ index ].cssRules ).forEach( ( { cssText, media }, mediaIndex ) => {
			if ( media ) {
				const maxWidth = media.mediaText.match( /\(max-width:([^)]+)\)/ )
				const minWidth = media.mediaText.match( /\(min-width:([^)]+)\)/ )

				const max = maxWidth ? parseInt( maxWidth[ 1 ].replace( /px/, '' ) ) : 0
				const min = minWidth ? parseInt( minWidth[ 1 ].replace( /px/, '' ) ) : 0

				// Memoize existing values
				mediaIndices[ mediaIndex ] = ( cssObject && cssObject[ index ] && cssObject[ index ][ mediaIndex ] ) ? { ...cssObject[ index ][ mediaIndex ] } : {
					mediaText: media.mediaText,
					min,
					max,
					cssText,
				}
			}
		} )

		cssObject[ index ] = { ...mediaIndices }
	} )

	  if ( width === TABLET_MODE_WIDTH || width === MOBILE_MODE_WIDTH ) {
		// If Preview is in Tablet or Mobile Mode, modify media queries for Tablet or Mobile.
		keys( cssObject ).forEach( styleSheetIndex => {
			keys( cssObject[ styleSheetIndex ] ).forEach( index => {
				const { min, max } = cssObject[ styleSheetIndex ][ index ]
				if ( document.styleSheets[ styleSheetIndex ].cssRules[ index ] ) {
					if ( inRange( parseInt( width.replace( /px/, '' ) ), min, max ) ) {
						document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText = 'screen and (max-width: 5000px)'
					} else {
						document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText = 'screen and (min-width: 5000px)'
					}
				}
			} )
		} )
	} else {
		 // If Preview is in Desktop Mode, revert all media queries
		keys( cssObject ).forEach( styleSheetIndex => {
			keys( cssObject[ styleSheetIndex ] ).forEach( index => {
				document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText = cssObject[ styleSheetIndex ][ index ].mediaText
			} )
		} )
	}
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
