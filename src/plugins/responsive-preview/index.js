/**
 * Wordpress dependencies
 */
import domReady from '@wordpress/dom-ready'

/**
 * External dependencies
 */
import {
	keys, inRange, throttle,
} from 'lodash'
import { addAction } from '@wordpress/hooks'

const query = '.edit-post-visual-editor'

// Preview Mode responsive width
const TABLET_MODE_WIDTH = 600

// CSS files to compare
const includesCss = [
	'/dist/frontend_blocks__premium_only.css',
	'/dist/frontend_blocks.css',
	'/dist/editor_blocks__premium_only.css',
	'/dist/editor_blocks.css',
]

const cssObject = {}
let previousMode = 'desktop'

const observerCallback = () => {
	// Gets the element of visual editor wrapper
	const visualEditorEl = document.querySelector( query )

	// Only call when switching to desktop, or in responsive mode.
	if ( ! visualEditorEl.getAttribute( 'style' ) && previousMode === 'desktop' ) {
		return
	}

	// Gets the current width of the visual editor
	const width = parseInt( getComputedStyle( visualEditorEl ).width, 10 ) //eslint-disable-line no-undef
	previousMode = visualEditorEl.getAttribute( 'style' ) ? 'responsive' : 'desktop'
	const previewMode = ! visualEditorEl.getAttribute( 'style' ) ? 'desktop' :
		width > TABLET_MODE_WIDTH ? 'tablet' : 'mobile'

	// Stores the indices of needed styleSheets
	const stylesheetIndices = []

	const styleSheets = Array.from( document.styleSheets )

	styleSheets.forEach( ( { href }, index ) => {
		// Only do this for our own css files.
		if ( href && includesCss.some( url => href.includes( url ) ) ) {
			stylesheetIndices.push( index )
		// Also do this for style tags.
		} else if ( href === null ) {
			stylesheetIndices.push( index )
		}
	} )

	stylesheetIndices.forEach( index => {
		const mediaIndices = {}

		if ( styleSheets[ index ].cssRules ) {
			Array.from( styleSheets[ index ].cssRules ).forEach( ( { cssText, media }, mediaIndex ) => {
				if ( media && cssText.includes( '.ugb' ) && media.mediaText.match( /(max|min)-width/ ) ) {
					const maxWidth = media.mediaText.match( /max-width:\s*(\d+)px/ )
					const minWidth = media.mediaText.match( /min-width:\s*(\d+)px/ )

					const max = maxWidth ? parseInt( maxWidth[ 1 ], 10 ) : 9999
					const min = minWidth ? parseInt( minWidth[ 1 ], 10 ) : 0

					// Memorize existing values
					mediaIndices[ mediaIndex ] = ( cssObject && cssObject[ index ] && cssObject[ index ][ mediaIndex ] ) ? { ...cssObject[ index ][ mediaIndex ] } : {
						mediaText: media.mediaText,
						min,
						max,
						cssText,
					}
				}
			} )
		}

		cssObject[ index ] = { ...mediaIndices }
	} )

	if ( previewMode === 'tablet' || previewMode === 'mobile' ) {
		// If Preview is in Tablet or Mobile Mode, modify media queries for Tablet or Mobile.
		keys( cssObject ).forEach( styleSheetIndex => {
			keys( cssObject[ styleSheetIndex ] ).forEach( index => {
				const {	min, max } = cssObject[ styleSheetIndex ][ index ]
				if ( inRange( width, min, max ) ) {
					if ( document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText !== 'screen and (max-width: 5000px)' ) {
						document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText = 'screen and (max-width: 5000px)'
					}
				} else if ( document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText !== 'screen and (min-width: 5000px)' ) {
					document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText = 'screen and (min-width: 5000px)'
				}
			} )
		} )
	} else {
		// If Preview is in Desktop Mode, revert all media queries
		keys( cssObject ).forEach( styleSheetIndex => {
			keys( cssObject[ styleSheetIndex ] ).forEach( index => {
				if ( document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText !== cssObject[ styleSheetIndex ][ index ].mediaText ) {
					document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText = cssObject[ styleSheetIndex ][ index ].mediaText
				}
			} )
		} )
	}
}

// Update the responsive preview when an attribute is changed.
addAction( 'stackable.setAttributes.after', 'stackable/responsive-preview', () => {
	setTimeout( observerCallback, 0 )
} )

const responsivePreview = () => {
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
	const visualEditorElObserver = new MutationObserver( throttle( observerCallback, 500 ) )

	visualEditorElObserver.observe( visualEditorEl, config )
}

domReady( responsivePreview )
