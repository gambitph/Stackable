/**
 * Internal dependencies
 */
import VIDEOS from '../videos'
import fs from 'fs'
import fetch from 'node-fetch'

const getDomain = () => {
	const content = fs.readFileSync( 'package.json', 'utf8' )
	return JSON.parse( content ).cloudfront.domain
}

jest.setTimeout( 100000 )

describe( 'Videos', () => {
	it( 'are uploaded', async () => {
		const urls = Object.keys( VIDEOS ).reduce( ( urls, key ) => {
			const { video } = VIDEOS[ key ]
			if ( video ) {
				urls.push( video )
			}
			return urls
		}, [] )

		expect.assertions( urls.length )

		for ( const video of urls ) {
			const response = await fetch( `https://${ getDomain() }/dist/videos/help/${ video }`, {
				method: 'HEAD',
			} )
			expect( response.ok ).toBe( true )
		}
	} )
} )
