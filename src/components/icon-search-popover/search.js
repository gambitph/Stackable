import { applyFilters } from '@wordpress/hooks'
import {
	fontAwesomeSearchProIcons, iconsFaKit, iconsFaProKitVersion, iconsFaFreeKitVersion,
} from 'stackable'

export const searchFontAwesomeIconName = async ( name = 'icon', isPro = fontAwesomeSearchProIcons ) => {
	const faVersion = iconsFaKit ? iconsFaProKitVersion : ( iconsFaFreeKitVersion || '6.5.1' )
	const query =
		`{ search(version: "${ faVersion || '6.5.1' }", first: 50, query: "${ ( name || 'info' ).replace( /["'\\]/g, '' ) }") {
			id,
			FamilyStylesByLicense {
				free { style, family },
				${ isPro ? 'pro { style, family }' : '' }
			}
		} }`

	const data = await fetch( 'https://api.fontawesome.com', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		  Accept: 'application/json',
		},
		body: JSON.stringify( { query } ),
	  } )
		.then( r => r.json() )

	const faIcons = data.data.search.reduce( ( iconResults, iconData ) => {
		convertFontAwesomeToIcon( iconData, isPro ).forEach( icon => {
			iconResults.push( icon )
		} )

		return iconResults
	}, [] )

	const iconLibrary = applyFilters( 'stackable.global-settings.inspector.icon-library.search-icons', null, name )

	return { faIcons, iconLibrary }
}

/**
 * Converts an FontAwesome icon to an FA prefix-class pair.
 *
 * FA Icon expected:
 * {
 * 		id: "cog",
 * 		membership: {
 * 			free: [ "solid", "brands" ],
 * 			pro: [ "regular", "light", "duotone" ]
 * 		}
 * }
 *
 * Return expected:
 * [ {
 * 		prefix: "fas", <- "fa" plus the first letter of the type of icon "d" for "duotone"
 * 		iconName: "fa-cog" <- "fa-" plus the icon id
 * }, {
 * 		prefix: "fab",
 * 		iconName: "fa-cog"
 * } ]
 *
 * Starting from version 6, they included a new family, "Sharp"
 * and "familyStylesByLicense" field will be used instead of the deprecated "membership" field.
 * https://fontawesome.com/docs/apis/graphql/objects#membership-deprecated
 *
 * New FA Icon expected:
 * {
 * 	id: "cog",
 * 	familyStylesByLicense: {
 * 		free: [
 * 			{ style: "solid", family: "classic" }
 * 			],
 * 		pro: [
 * 			{ style: "solid", family: "duotone" },
 * 			{ style: "solid", family: "classic" },
 * 			{ style: "regular", family: "classic" },
 * 			{ style: "light", family: "classic" },
 * 			]
 * 		}
 * }
 *
 * @param {Object} icon Icon object returned from FontAwesome API GraphQL
 * @param {boolean} isPro If true, will also return a list
 *
 * @return {Array} Icon obects
 */
export const convertFontAwesomeToIcon = ( icon, isPro = false ) => {
	const types = [
		...icon.FamilyStylesByLicense.free,
		...( isPro ? icon.FamilyStylesByLicense.pro.filter( t => ! icon.FamilyStylesByLicense.free.includes( t ) ) : [] ),
	]

	return types.map( type => {
		let alias = ''
		if ( type.family === 'duotone' ) {
			alias = 'd'
		} else if ( type.family === 'classic' ) {
			alias = type.style[ 0 ]
		} else if ( type.family === 'sharp' ) {
			// Aliases for sharp family: https://fontawesome.com/docs/web/add-icons/how-to#aliases
			alias = 's' + type.style[ 0 ]
		}
		return {
			className: `fa${ alias } fa-${ icon.id }`,
			prefix: `fa${ alias }`,
			iconName: icon.id,
		}
	} )
}
