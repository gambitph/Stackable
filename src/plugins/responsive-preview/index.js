/**
 * Internal dependencies
 */
import './auto-change-responsive-preview'

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

/**
 * CSS files to cache
 *
 * It includes Stackable custom css files and inline styles for blocks.
 */
const includesCss = [
	'/dist/frontend_blocks__premium_only.css',
	'/dist/frontend_blocks.css',
	'/dist/editor_blocks__premium_only.css',
	'/dist/editor_blocks.css',
]

const cssObject = {}

// Preview Mode responsive width
const TABLET_MODE_WIDTH = 600

let previousMode = 'desktop'

/**
 * Populate the cssObject with media queries
 */
export const cacheCssObject = () => {
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

					if ( cssObject && cssObject[ index ] && cssObject[ index ][ mediaIndex ] ) {
						const {
							min: currentMin, max: currentMax,
						} = cssObject[ index ][ mediaIndex ]

						if ( min === 5000 || max === 5000 ) {
							// Store the cached value of media query has already been modified.
							mediaIndices[ mediaIndex ] = { ...cssObject[ index ][ mediaIndex ] }
						} else if ( currentMin !== min || currentMax !== max ) {
							// Store the new media query if custom CSS is modified.
							mediaIndices[ mediaIndex ] = {
								mediaText: media.mediaText,
								min,
								max,
								cssText,
							}
						} else {
							// Store the cached value if nothing is modified.
							mediaIndices[ mediaIndex ] = { ...cssObject[ index ][ mediaIndex ] }
						}
					} else {
					// Store the new media query if the value is not found in cached media queries.
					 mediaIndices[ mediaIndex ] = {
							mediaText: media.mediaText,
							min,
							max,
							cssText,
					 }
					}
				}
			} )
		}

		cssObject[ index ] = { ...mediaIndices }
	} )
}

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

	// Populate the cssObject with media queries and cache values if necessary.
	cacheCssObject()

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

// Initialize the observer as null.
let visualEditorElObserver = null

// Update the responsive preview when an attribute is changed.
addAction( 'stackable.setAttributes.after', 'stackable/responsive-preview', () => {
	if ( visualEditorElObserver ) {
		// Unsubscribe to the observer temporarily everytime an attribute is changed to avoid performance issues
		visualEditorElObserver.disconnect()
	}

	observerCallback()
	responsivePreview()
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
	visualEditorElObserver = new MutationObserver( throttle( observerCallback, 500 ) )

	visualEditorElObserver.observe( visualEditorEl, config )
}

domReady( responsivePreview )
