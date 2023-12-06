import {
	iconsFaKit, iconsFaProKitVersion, iconsFaFreeKitVersion,
} from 'stackable'

const faTokenV5 = 'd2a8ea0b89'
const faTokenV6 = '8f4ebede24'
const faVersion = ( iconsFaKit ? iconsFaProKitVersion : ( iconsFaFreeKitVersion || '6.5.1' ) ) || '5.15.4'

const aliasToFamilyStyle = {
	fas: 'solid',
	far: 'regular',
	fal: 'light',
	fat: 'thin',
	fad: 'duotone',
	fab: 'brands',
	fass: 'sharp-solid',
	fasr: 'sharp-regular',
	fasl: 'sharp-light',
}

const getFamilyStyle = prefix => {
	return aliasToFamilyStyle[ prefix ] || 'solid'
}
const getToken = () => {
	if ( iconsFaKit ) {
		return iconsFaKit
	} else if ( iconsFaFreeKitVersion === '5.15.4' ) {
		return faTokenV5
	}
	return faTokenV6
}

export const faGetIcon = ( prefix, iconName ) => {
	if ( ! window.StkFontAwesome || ! window.StkFontAwesome[ `${ prefix }-${ iconName }` ] ) {
		return ''
	}

	return window.StkFontAwesome[ `${ prefix }-${ iconName }` ]
}

export const faFetchIcon = ( prefix, iconName ) => {
	const token = getToken()
	const familyStyle = getFamilyStyle( prefix )

	let url
	if ( ! iconsFaKit ) {
		url = `https://ka-f.fontawesome.com/releases/v${ faVersion }/svgs/${ familyStyle }/${ iconName }.svg?token=${ token }`
	} else {
		url = `https://ka-p.fontawesome.com/releases/v${ faVersion }/svgs/${ familyStyle }/${ iconName }.svg?token=${ token }`
	}
	return new Promise( async ( resolve, reject ) => {
		const svgText = await fetch( url ).then( response => response.text() ).catch( () => reject( false ) )

		if ( ! window.StkFontAwesome ) {
			window.StkFontAwesome = {}
		}

		window.StkFontAwesome[ `${ prefix }-${ iconName }` ] = svgText
		resolve( true )
	} )
}
