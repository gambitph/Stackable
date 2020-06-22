export const faGetSVGIcon = ( prefix, iconName ) => {
	const icon = faGetIcon( prefix, iconName )
	if ( icon ) {
		return icon.html[ 0 ]
	}
	return ''
}

export const faGetIcon = ( prefix, iconName ) => {
	return window.FontAwesome.icon( { prefix, iconName } )
}

export const faIsAPILoaded = () => {
	return !! window.FontAwesome
}

export const faAPILoaded = () => {
	if ( ! window.FontAwesome ) {
		return new Promise( ( resolve, reject ) => {
			let timeoutCounter = 30
			const interval = setInterval( () => {
				if ( window.FontAwesome ) {
					clearInterval( interval )
					resolve( true )
				} else if ( timeoutCounter-- < 0 ) {
					clearInterval( interval )
					reject( false )
				}
			}, 250 )
		} )
	}
	return Promise.resolve( true )
}
