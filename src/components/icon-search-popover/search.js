import { fontAwesomeSearchProIcons } from 'stackable'

export const searchFontAwesomeIconName = async ( name = 'icon', isPro = fontAwesomeSearchProIcons ) => {
	const query =
		`{ search(version: "latest", first: 50, query: "${ ( name || 'info' ).replace( /["'\\]/g, '' ) }") {
			id
			membership {
				free
				${ isPro ? 'pro' : '' }
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

	return data.data.search.reduce( ( iconResults, iconData ) => {
		convertFontAwesomeToIcon( iconData, isPro ).forEach( icon => {
			iconResults.push( icon )
		} )

		return iconResults
	}, [] )
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
 * @param {Object} icon Icon object returned from FontAwesome API GraphQL
 * @param {boolean} isPro If true, will also return a list
 *
 * @return {Array} Icon obects
 */
export const convertFontAwesomeToIcon = ( icon, isPro = false ) => {
	const types = [
		...icon.membership.free,
		...( isPro ? icon.membership.pro.filter( t => ! icon.membership.free.includes( t ) ) : [] ),
	]

	return types.map( type => {
		return {
			className: `fa${ type[ 0 ] } fa-${ icon.id }`,
			prefix: `fa${ type[ 0 ] }`,
			iconName: icon.id,
		}
	} )
}
