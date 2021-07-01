export const extractSvg = htmlString => {
	if ( htmlString.match( /^<svg(.*?)<\/svg>$/g ) ) {
		return htmlString
	} else if ( htmlString.match( /<svg/ ) ) {
		return ( htmlString.match( /<svg.*?<\/svg>/g ) || [ htmlString ] )[ 0 ]
	}
	return htmlString
}
