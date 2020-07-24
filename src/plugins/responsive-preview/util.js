/**
 * External dependencies
 */
import {
	isEmpty, isEqual, inRange, keys,
} from 'lodash'

/**
 * Gets all the indices containing an entry in includeCss
 *
 * @param {Object} styleSheets current styleSheets array
 * @param {Object} includeCss
 *
 * @return {Object} array of indices
 */
export const getIncludedIndices = ( styleSheets = null, includeCss = null ) => {
	if ( ! includeCss || ! styleSheets ) {
		return []
	}

	const styleSheetIndices = []

	styleSheets.forEach( ( { href }, index ) => {
		// Only do this for our own css files.
		if ( href && includeCss.some( url => href.includes( url ) ) ) {
			styleSheetIndices.push( index )
		} else if ( href === null ) {
			// Also do this for style tags.
			styleSheetIndices.push( index )
		}
	} )

	return [ ...styleSheetIndices ]
}

/**
 * Handles the caching of cssObjects.
 *
 * @param {Object} currentDocument current document properties
 * @param {Object} cssObject
 * @param {Object} cssRulesCache
 * @param {Object} includeCss array of custom css files to cache
 */
export const cacheCssObject = ( currentDocument = null, cssObject = null, cssRulesCache = null, includeCss = null ) => {
	// Checks if a document is passed.
	if ( ! currentDocument || ! cssObject || ! cssRulesCache || ! includeCss ) {
		return
	}

	const styleSheets = Array.from( currentDocument.styleSheets )

	// Stores the indices of needed styleSheets
	const stylesheetIndices = getIncludedIndices( styleSheets, includeCss )

	stylesheetIndices.forEach( index => {
		const mediaIndices = {}

		const cssRules = Array.from( styleSheets[ index ].cssRules ).filter( cssRule => cssRule.media )

		// Checks if the current cssObject should not be cached.
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
on Preview Mode.
 *
 * @param {Object} currentDocument current document properties
 * @param {string} previewMode the current Preview Mode of the editor.
 * @param {Object} cssObject
 * @param {number} width the editor's current width
 */
export const updateMediaQuery = ( currentDocument = null, cssObject = null, previewMode = 'Desktop', width = 0 ) => {
	// Checks if a document is passed.
	if ( ! currentDocument || ! cssObject || ! previewMode || width === 0 ) {
		return
	}

	if ( previewMode === 'Tablet' || previewMode === 'Mobile' ) {
		// If Preview is in Tablet or Mobile Mode, modify media queries for Tablet or Mobile.
		keys( cssObject ).forEach( styleSheetIndex => {
			keys( cssObject[ styleSheetIndex ] ).forEach( index => {
				const {	min, max } = cssObject[ styleSheetIndex ][ index ]
				if ( inRange( width, min, max ) ) {
					if ( currentDocument.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText !== 'screen and (max-width: 5000px)' ) {
						currentDocument.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText = 'screen and (max-width: 5000px)'
					}
				} else if ( currentDocument.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText !== 'screen and (min-width: 5000px)' ) {
					cssObject[ styleSheetIndex ][ index ].previousMediaText = currentDocument.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText
					currentDocument.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText = 'screen and (min-width: 5000px)'
				}
				// Gets the previous value of the media query
				if ( cssObject[ styleSheetIndex ][ index ].previousMediaText !== currentDocument.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText ) {
					cssObject[ styleSheetIndex ][ index ].previousMediaText = currentDocument.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText
				}
			} )
		} )
	} else {
		// If Preview is in Desktop Mode, revert all media queries
		keys( cssObject ).forEach( styleSheetIndex => {
			keys( cssObject[ styleSheetIndex ] ).forEach( index => {
				if ( currentDocument.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText !== cssObject[ styleSheetIndex ][ index ].mediaText ) {
					cssObject[ styleSheetIndex ][ index ].previousMediaText = currentDocument.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText
					currentDocument.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText = cssObject[ styleSheetIndex ][ index ].mediaText
				}
				// Gets the previous value of the media query
				if ( cssObject[ styleSheetIndex ][ index ].previousMediaText !== currentDocument.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText ) {
					cssObject[ styleSheetIndex ][ index ].previousMediaText = currentDocument.styleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText
				}
			} )
		} )
	}
}
