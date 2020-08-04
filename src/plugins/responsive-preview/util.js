/**
 * External dependencies
 */
import {
	isEmpty, isEqual, inRange, keys,
} from 'lodash'

/**
 * Gets all the indices containing an entry in includeCss
 *
 * @param {Array} styleSheets current styleSheets array
 * @param {Array} matchingFilenames array of filenames
 *
 * @return {Array} array of indices
 */
export const getIncludedIndices = ( styleSheets = null, matchingFilenames = [] ) => {
	if ( ! styleSheets ) {
		return []
	}

	const styleSheetIndices = []

	styleSheets.forEach( ( { href }, index ) => {
		// Only do this if the filename matches.
		matchingFilenames.some( url => {
			// Style tags in the page will have a null href.
			if ( ! url && href === null ) {
				return styleSheetIndices.push( index )
			// Check if it matches what we're looking for.
			} else if ( href && url && href.includes( url ) ) {
				return styleSheetIndices.push( index )
			}
			return false
		} )
	} )

	return styleSheetIndices
}

// Cache the cssObject
const cssObject = {}
// Cache the cssRules
const cssRulesCache = {}

/**
 * Handles the caching of cssObjects.
 *
 * @param {Array} matchingFilenames array of custom css files to cache
 * @param {Object} documentStyleSheets document.styleSheets to use (mainly used for testing)
 * @param {Object} cachedCssObject cssObject (mainly used for testing)
 *
 * @return {Object} An object containing the indices of stylesheets of matchingFilenames
 */
export const getCssObject = ( matchingFilenames = [], documentStyleSheets = document.styleSheets, cachedCssObject = cssObject ) => {
	// Stores the indices of needed styleSheets
	const styleSheets = Array.from( documentStyleSheets )
	const stylesheetIndices = getIncludedIndices( styleSheets, matchingFilenames )

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

					if ( cachedCssObject && cachedCssObject[ index ] && cachedCssObject[ index ][ mediaIndex ] ) {
						const { previousMediaText } = cachedCssObject[ index ][ mediaIndex ]

						if ( previousMediaText === media.mediaText ) {
						// Store the cached value of media query has already been modified.
							mediaIndices[ mediaIndex ] = { ...cachedCssObject[ index ][ mediaIndex ] }
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

			cachedCssObject[ index ] = { ...mediaIndices }
		}
	} )

	return { ...cachedCssObject }
}

/**
 * Updates the current media query based on Preview Mode.
 *
 * @param {Array} matchingFilenames array of custom css files with media queries
  to update
 * @param {string} previewMode the current Preview Mode of the editor.
 * @param {number} width the editor's current width
 * @param {Object} documentStyleSheets document.styleSheets to use (mainly used
 * @param {Object} cachedCssObject the global cssObject (mainly used for testing)
  for testing)
 */
export const updateMediaQuery = ( matchingFilenames = [], previewMode = 'Desktop', width = 0, documentStyleSheets = document.styleSheets, cachedCssObject = cssObject ) => {
	const cssObject = getCssObject( matchingFilenames, documentStyleSheets, cachedCssObject )

	if ( previewMode === 'Tablet' || previewMode === 'Mobile' ) {
		// If Preview is in Tablet or Mobile Mode, modify media queries for Tablet or Mobile.
		keys( cssObject ).forEach( styleSheetIndex => {
			keys( cssObject[ styleSheetIndex ] ).forEach( index => {
				const {	min, max } = cssObject[ styleSheetIndex ][ index ]
				if ( inRange( width, min, max ) ) {
					if ( documentStyleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText !== 'screen and (max-width: 5000px)' ) {
						documentStyleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText = 'screen and (max-width: 5000px)'
					}
				} else if ( documentStyleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText !== 'screen and (min-width: 5000px)' ) {
					cssObject[ styleSheetIndex ][ index ].previousMediaText = documentStyleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText
					documentStyleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText = 'screen and (min-width: 5000px)'
				}
				// Gets the previous value of the media query
				if ( cssObject[ styleSheetIndex ][ index ].previousMediaText !== documentStyleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText ) {
					cssObject[ styleSheetIndex ][ index ].previousMediaText = documentStyleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText
				}
			} )
		} )
	} else {
		// If Preview is in Desktop Mode, revert all media queries
		keys( cssObject ).forEach( styleSheetIndex => {
			keys( cssObject[ styleSheetIndex ] ).forEach( index => {
				if ( documentStyleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText !== cssObject[ styleSheetIndex ][ index ].mediaText ) {
					cssObject[ styleSheetIndex ][ index ].previousMediaText = documentStyleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText
					documentStyleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText = cssObject[ styleSheetIndex ][ index ].mediaText
				}
				// Gets the previous value of the media query
				if ( cssObject[ styleSheetIndex ][ index ].previousMediaText !== documentStyleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText ) {
					cssObject[ styleSheetIndex ][ index ].previousMediaText = documentStyleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText
				}
			} )
		} )
	}

	return documentStyleSheets
}
