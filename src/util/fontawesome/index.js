import { iconsFaKit, fontAwesomeIconsVersion } from 'stackable'

const faTokenV5 = 'd2a8ea0b89'
const faTokenV6 = '8f4ebede24'

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
	} else if ( fontAwesomeIconsVersion === '5.15.4' ) {
		return faTokenV5
	}
	return faTokenV6
}

export const faGetIcon = async ( prefix, iconName ) => {
	const token = getToken()
	const familyStyle = getFamilyStyle( prefix )

	let url
	if ( ! iconsFaKit ) {
		url = `https://ka-f.fontawesome.com/releases/v${ fontAwesomeIconsVersion }/svgs/${ familyStyle }/${ iconName }.svg?token=${ token }`
	} else {
		url = `https://ka-p.fontawesome.com/releases/v${ fontAwesomeIconsVersion }/svgs/${ familyStyle }/${ iconName }.svg?token=${ token }`
	}
	const iconText = await fetch( url ).then( response => response.text() )

	return iconText
}
