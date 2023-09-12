
export const firefoxHasPolyfill = ( clientId, attributes ) => {
	if ( ! clientId ) {
		return null
	}

	const userAgent = navigator?.userAgent
	if ( userAgent && userAgent.indexOf( 'Firefox' ) !== -1 ) {
		return <style>
			{ attributes.blockMargin?.top === 'auto' && `[data-block="${ clientId }"] {
				margin-top: auto !important;
				margin-bottom: 0;
			}` }
			{ attributes.blockMargin?.right === 'auto' && `[data-block="${ clientId }"] {
				margin-right: auto !important;
				margin-left: 0;
				width: fit-content;
			}` }
			{ attributes.blockMargin?.bottom === 'auto' && `[data-block="${ clientId }"] {
				margin-bottom: auto !important;
				margin-top: 0;
			}` }
			{ attributes.blockMargin?.left === 'auto' && `[data-block="${ clientId }"] {
				margin-left: auto !important;
				margin-right: 0;
				width: fit-content;
			}` }
		</style>
	}

	return null
}

