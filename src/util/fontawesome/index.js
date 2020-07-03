export const faGetSVGIcon = ( prefix, iconName ) => {
	const icon = faGetIcon( prefix, iconName )
	if ( icon ) {
		return icon.html[ 0 ]
	}
	return ''
}

export const faGetIcon = ( prefix, iconName ) => {
	if ( ! window.FontAwesome ) {
		return null
	}
	return window.FontAwesome.icon( { prefix, iconName } )
}

export const faIsAPILoaded = () => {
	return !! window.FontAwesome
}

export const faAPILoaded = () => {
	if ( ! window.FontAwesome ) {
		return new Promise( ( resolve, reject ) => {
			let timeoutCounter = 240
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

export const faIconLoaded = ( prefix, iconName ) => {
	const icon = faGetIcon( prefix, iconName )
	if ( ! icon ) {
		return new Promise( ( resolve, reject ) => {
			let timeoutCounter = 240
			const interval = setInterval( () => {
				const icon = faGetIcon( prefix, iconName )
				if ( window.FontAwesome ) {
					clearInterval( interval )
					resolve( icon )
				} else if ( timeoutCounter-- < 0 ) {
					clearInterval( interval )
					reject( false )
				}
			}, 250 )
		} )
	}
	return Promise.resolve( icon )
}
