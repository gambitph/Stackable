/**
 * External dependencies
 */
import {
	isEmpty, isEqual, inRange, keys,
} from 'lodash'

/**
 * CSS files to cache
 *
 * It includes Stackable custom css files and inline styles for blocks.
 */
const stackableCSSFiles = [
	null, // Include style tags.
	'/dist/frontend_blocks__premium_only.css',
	'/dist/frontend_blocks.css',
	'/dist/editor_blocks__premium_only.css',
	'/dist/editor_blocks.css',
]

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
 * @param {Array} matchingFilenames array of custom css files to cache (mainly used for testing)
 * @param {Object} documentStyleSheets document.styleSheets to use (mainly used for testing)
 * @param {Object} cachedCssObject cssObject (mainly used for testing)
 *
 * @return {Object} An object containing the indices of stylesheets of matchingFilenames
 */
export const getCssObject = ( matchingFilenames = stackableCSSFiles, documentStyleSheets = document.styleSheets, cachedCssObject = cssObject ) => {
	// Stores the indices of needed styleSheets
	const styleSheets = Array.from( documentStyleSheets )
	const stylesheetIndices = getIncludedIndices( styleSheets, matchingFilenames )

	const generateID = ( length = 10 ) => {
		let result = ''
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		const charactersLength = characters.length
		for ( let i = 0; i < length; i = i + 1 ) {
			result = result + characters.charAt( Math.floor( Math.random() * charactersLength ) )
		}
		return result
	}

	// Store the unique IDs of all styleSheets.
	const uniqueIDs = []

	stylesheetIndices.forEach( index => {
		if ( ! documentStyleSheets[ index ].__id ) {
			const __id = generateID()
			documentStyleSheets[ index ].__id = __id 
			uniqueIDs.push( __id )
		} else {
			uniqueIDs.push( documentStyleSheets[ index ].__id )
		}
	} )

	uniqueIDs.forEach( __id => {
		const mediaIndices = {}
		const index = Array.from( styleSheets ).findIndex( styleSheet => styleSheet.__id === __id )

		const cssRules = Array.from( styleSheets[ index ].cssRules ).filter( cssRule => cssRule.media )

		// Checks if the current cssObject should not be cached.
		if ( ! cssRulesCache[ __id ] || ( cssRulesCache[  __id ] && ! isEqual( cssRulesCache[ __id ], cssRules ) ) ) {
			cssRulesCache[ __id ] = ! isEmpty( cssRules ) && [ ...cssRules ]
			Array.from( styleSheets[ index ].cssRules ).forEach( ( { cssText, media }, mediaIndex ) => {
				if ( media && cssText.includes( '.ugb' ) && media.mediaText.match( /(max|min)-width/ ) ) {
					const maxWidth = media.mediaText.match( /max-width:\s*(\d+)px/ )
					const minWidth = media.mediaText.match( /min-width:\s*(\d+)px/ )

					const max = maxWidth ? parseInt( maxWidth[ 1 ], 10 ) : 9999
					const min = minWidth ? parseInt( minWidth[ 1 ], 10 ) : 0

					if ( cachedCssObject && cachedCssObject[ __id ] && cachedCssObject[ __id ][ mediaIndex ] ) {
						const { previousMediaText } = cachedCssObject[ __id ][ mediaIndex ]

						if ( previousMediaText === media.mediaText ) {
						// Store the cached value of media query has already been modified.
							mediaIndices[ mediaIndex ] = { ...cachedCssObject[ __id ][ mediaIndex ] }
						} else {
						// Store the new media query if custom CSS is modified.
							mediaIndices[ mediaIndex ] = {
								cssText,
								mediaText: media.mediaText,
								min,
								max,
							}
						}
					} else {
					// Store the new media query if the value is not found in cached media queries.
					 mediaIndices[ mediaIndex ] = {
							cssText,
							mediaText: media.mediaText,
							min,
							max,
					 }
					}
				}
			} )

			cachedCssObject[ __id ] = { ...mediaIndices }
		}
	} )

	return { ...cachedCssObject }
}

/**
 * Updates the current media query based on Preview Mode.
 *
 * @param {string} previewMode the current Preview Mode of the editor.
 * @param {number} width the editor's current width
 * @param {Array} matchingFilenames array of custom css files with media queries (mainly used for testing)
 * @param {Object} documentStyleSheets document.styleSheets to use (mainly used for testing)
 * @param {Object} cachedCssObject the global cssObject (mainly used for testing)
 */
export const updateMediaQueries = ( previewMode = 'Desktop', width = 0, matchingFilenames = stackableCSSFiles, documentStyleSheets = document.styleSheets, cachedCssObject = cssObject ) => {
	const cssObject = getCssObject( matchingFilenames, documentStyleSheets, cachedCssObject )

	const replaceVwToPx = match => {
		const [ value ] = match.split( 'vw' )
		const pxValue = ( parseFloat( value ) / 100 ) * width
		return `${ pxValue }px`
	}

	const modifyCssTextWithVw = cssText => cssText.replace( /(-?[.0-9]+)vw/g , replaceVwToPx )

	const updateStylesheetWithVw = ( styleSheetIndex, index, newCssText ) => {
		// Delete the current styleSheet
		documentStyleSheets[ styleSheetIndex ].deleteRule( index )

		// Initialize a new one with modified viewport width rules
		documentStyleSheets[ styleSheetIndex ].insertRule( newCssText, index )	
	}
	
	if ( previewMode === 'Tablet' || previewMode === 'Mobile' ) {
		// If Preview is in Tablet or Mobile Mode, modify media queries for Tablet or Mobile.
		keys( cssObject ).forEach( __id => {
			const styleSheetIndex = Array.from( documentStyleSheets ).findIndex( styleSheet => styleSheet.__id === __id )
			keys( cssObject[ __id ] ).forEach( index => {
				if ( documentStyleSheets[ styleSheetIndex ] && documentStyleSheets[ styleSheetIndex ].cssRules[ index ] ) {
					const {	
						min,
						max,
						cssText
					} = cssObject[ __id ][ index ]

					if ( inRange( width, min, max ) ) {
						// Checks if the cssText has viewport width
						if ( cssText && cssText.match( /(-?[.0-9]+)vw/g ) ) {
							updateStylesheetWithVw( styleSheetIndex, index, modifyCssTextWithVw( cssText ) )
						}
						documentStyleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText = 'screen and (max-width: 5000px)'
					} else {
						// Checks if the cssText has viewport width
						if ( cssText && cssText.match( /(-?[.0-9]+)vw/g ) ) {
							updateStylesheetWithVw( styleSheetIndex, index, modifyCssTextWithVw( cssText ) )
						}
						documentStyleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText = 'screen and (min-width: 5000px)'
					}
					// Gets the previous value of the media query
					if ( cssObject[ __id ][ index ].previousMediaText !== documentStyleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText ) {
						cssObject[ __id ][ index ].previousMediaText = documentStyleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText
					}
				}
			} )
		} )
	} else {
		// If Preview is in Desktop Mode, revert all media queries
		keys( cssObject ).forEach( __id => {
			const styleSheetIndex = Array.from( documentStyleSheets ).findIndex( styleSheet => styleSheet.__id === __id )
			keys( cssObject[ __id ] ).forEach( index => {
				if ( documentStyleSheets[ styleSheetIndex ] && documentStyleSheets[ styleSheetIndex ].cssRules[ index ] ) {
					const {	cssText } = cssObject[ __id ][ index ]

					if ( documentStyleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText !== cssObject[ __id ][ index ].mediaText ) {
						cssObject[ __id ][ index ].previousMediaText = documentStyleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText
						updateStylesheetWithVw( styleSheetIndex, index, cssText )
					}
					// Gets the previous value of the media query
					if ( cssObject[ __id ][ index ].previousMediaText !== documentStyleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText ) {
						cssObject[ __id ][ index ].previousMediaText = documentStyleSheets[ styleSheetIndex ].cssRules[ index ].media.mediaText
					}
				}
			} )
		} )
	}

	return documentStyleSheets
}
