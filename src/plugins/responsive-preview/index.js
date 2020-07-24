/**
 * Internal dependencies
 */
import './auto-change-responsive-preview'

/**
 * External dependencies
 */
import {
	keys, inRange, throttle, isEqual, isEmpty,
} from 'lodash'

/**
 * Wordpress dependencies
 */
import domReady from '@wordpress/dom-ready'
import { addAction } from '@wordpress/hooks'
import { select } from '@wordpress/data'

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

// Cache the cssObject
const cssObject = {}
// Cache the cssRules
const cssRulesCache = {}

// The previous mode.
let previousMode = 'Desktop'

// Cache the responsive widths of the preview.
const widthsDetected = {}

/**
 * Handles the caching of cssObjects.
 */
export const cacheCssObject = () => {
	// Stores the indices of needed styleSheets
	const stylesheetIndices = []

	const styleSheets = Array.from( document.styleSheets )

	styleSheets.forEach( ( styleSheet, index ) => {
		// Only do this for our own css files.
		const { href } = styleSheet
		if ( href && includesCss.some( url => href.includes( url ) ) ) {
			stylesheetIndices.push( index )
		} else if ( href === null ) {
			// Also do this for style tags.
			stylesheetIndices.push( index )
		}
	} )

	stylesheetIndices.forEach( index => {
		const mediaIndices = {}

		const cssRules = Array.from( styleSheets[ index ].cssRules ).filter( cssRule => cssRule.media )

		// Checks if the current index is cached or the cache has already been initialized.
		if ( ! cssRulesCache[ index ] || ( cssRulesCache[ index ] && ! isEqual( cssRulesCache[ index ], cssRules ) ) ) {
			cssRulesCache[ index ] = ! isEmpty( cssRules ) && [ ...cssRules ]
			Array.from( styleSheets[ index ].cssRules ).forEach( ( { cssText, media }, mediaIndex ) => {
				if ( media && cssText.includes( '.ugb' ) && media.mediaText.match( /(max|min)-width/ ) ) {
					const maxWidth = media.mediaText.match( /max-width:\s*(\d+)px/ )
					const minWidth = media.mediaText.match( /min-width:\s*(\d+)px/ )

					const max = maxWidth ? parseInt( maxWidth[ 1 ], 10 ) : 9999
					const min = minWidth ? parseInt( minWidth[ 1 ], 10 ) : 0

					if ( cssObject && cssObject[ index ] && cssObject[ index ][ mediaIndex ] ) {
						const { previousMediaText } = cssObject[ index ][ mediaIndex ]

						if ( previousMediaText === media.mediaText ) {
						// Store the cached value of media query has already been modified.
							mediaIndices[ mediaIndex ] = { ...cssObject[ index ][ mediaIndex ] }
						} else {
						// Store the new media query if custom CSS is modified.
							mediaIndices[ mediaIndex ] = {
								mediaText: media.mediaText,
								min,
								max,
							}
						}
					} else {
					// Store the new media query if the value is not found in cached media queries.
					 mediaIndices[ mediaIndex ] = {
							mediaText: media.mediaText,
							min,
							max,
					 }
					}
				}
			} )

			cssObject[ index ] = { ...mediaIndices }
		}
	} )
}

/**
 * Updates the current media query based
 * on Preview Mode.
 *
 * @param {string} previewMode the current Preview Mode of the editor.
 * @param {number} width the editor's current width
 */
const updateMediaQuery = ( previewMode = 'Desktop', width = 0 ) => {
	if ( previewMode === 'Tablet' || previewMode === 'Mobile' ) {
		// If Preview is in Tablet or Mobile Mode, modify media queries for Tablet or Mobile.
		keys( cssObject ).forEach( styleSheetIndex => {
			keys( cssObject[ styleSheetIndex ] ).forEach( index => {
				const {	min, max } = cssObject[ styleSheetIndex ][ index ]
				if ( inRange( width, min, max ) ) {
					if ( document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText !== 'screen and (max-width: 5000px)' ) {
						document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText = 'screen and (max-width: 5000px)'
					}
				} else if ( document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText !== 'screen and (min-width: 5000px)' ) {
					cssObject[ styleSheetIndex ][ index ].previousMediaText = document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText
					document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText = 'screen and (min-width: 5000px)'
				}
				// Gets the previous value of the media query
				if ( cssObject[ styleSheetIndex ][ index ].previousMediaText !== document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText ) {
					cssObject[ styleSheetIndex ][ index ].previousMediaText = document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText
				}
			} )
		} )
	} else {
		// If Preview is in Desktop Mode, revert all media queries
		keys( cssObject ).forEach( styleSheetIndex => {
			keys( cssObject[ styleSheetIndex ] ).forEach( index => {
				if ( document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText !== cssObject[ styleSheetIndex ][ index ].mediaText ) {
					cssObject[ styleSheetIndex ][ index ].previousMediaText = document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText
					document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText = cssObject[ styleSheetIndex ][ index ].mediaText
				}
				// Gets the previous value of the media query
				if ( cssObject[ styleSheetIndex ][ index ].previousMediaText !== document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText ) {
					cssObject[ styleSheetIndex ][ index ].previousMediaText = document.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText
				}
			} )
		} )
	}
}

const observerCallback = () => {
	const {
		__experimentalGetPreviewDeviceType: getPreviewDeviceType,
	} = select( 'core/edit-post' )

	// Only call when getPreviewDeviceType is defined. Only in WP >= 5.5
	if ( ! getPreviewDeviceType ) {
		return
	}

	const mode = getPreviewDeviceType()

	// Only call when switching to desktop, or in responsive mode.
	if ( mode === 'Desktop' && previousMode === 'Desktop' ) {
		return
	}
	previousMode = mode

	// Gets the current width of the visual editor
	// Cache the width since it's expensive to perform getComputedStyle
	if ( ! widthsDetected[ mode ] ) {
		const visualEditorEl = document.querySelector( query )
		widthsDetected[ mode ] = parseInt( window.getComputedStyle( visualEditorEl ).width, 10 )
	}

	// Populate the cssObject with media queries and cache values if necessary.
	cacheCssObject()

	// Update the media query
	updateMediaQuery( mode, widthsDetected[ mode ] )
}

// Update the responsive preview when an attribute is changed.
addAction( 'stackable.setAttributes.after', 'stackable/responsive-preview', observerCallback )

const responsivePreview = () => {
	const visualEditorEl = document.querySelector( query )
	if ( ! visualEditorEl ) {
		return
	}

	// Observe all changes of the element
	const config = {
		attributes: true, childList: true, subtree: true,
	}

	// Listen to changes in the editor.
	const visualEditorElObserver = new MutationObserver( throttle( observerCallback, 500 ) )

	visualEditorElObserver.observe( visualEditorEl, config )
}

domReady( responsivePreview )
