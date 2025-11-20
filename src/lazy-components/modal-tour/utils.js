export const waitForElement = ( selector, timeout = 2000 ) => {
	return new Promise( ( resolve, reject ) => {
		const startTime = Date.now()
		const check = () => {
			const element = document.querySelector( selector )
			if ( element ) {
				resolve( element )
			} else if ( Date.now() - startTime > timeout ) {
				reject( false )
			} else {
				requestAnimationFrame( check )
			}
		}
		check()
	} )
}
