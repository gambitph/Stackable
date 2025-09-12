// This file automatically imports all tour files from the tours directory
// and exports them as a single object for use in TOUR_STEPS

// Dynamically import all tour files from the tours directory
const tourContext = require.context( './', false, /\.js$/ )
const tours = {}

// Import all tour files and populate the tours object using the filename as the key
tourContext.keys().forEach( fileName => {
	// Skip this index.js file itself
	if ( fileName === './index.js' ) {
		return
	}

	// Import the tour module
	const tourModule = tourContext( fileName )

	// Use the filename (without extension) as the key
	const tourName = fileName.replace( './', '' ).replace( '.js', '' )

	// Prefer default export, fallback to first named export if available
	if ( tourModule.default ) {
		tours[ tourName ] = tourModule.default
	} else {
		// If no default export, use the first named export (if any)
		const namedExports = Object.keys( tourModule ).filter( name => name !== 'default' )
		if ( namedExports.length > 0 ) {
			tours[ tourName ] = tourModule[ namedExports[ 0 ] ]
		}
	}
} )

// Export all tours as a single object
export { tours }
