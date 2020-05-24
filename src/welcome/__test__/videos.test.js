/**
 * Tests if all our welcome videos are uploaded in the cloud.
 */

/**
 * Internal dependencies
 */
import fs from 'fs'
import fetch from 'node-fetch'
import glob from 'glob'
import path, { basename } from 'path'

const getDomain = () => {
	const content = fs.readFileSync( 'package.json', 'utf8' )
	return JSON.parse( content ).cloudfront.domain
}

jest.setTimeout( 100000 )

describe( 'Welcome videos', () => {
	it( 'are uploaded', async () => {
		// Get all the video files.
		const videos = glob.sync( path.resolve( __dirname, '../videos/*.mp4' ) ).reduce( ( videoFilenames, path ) => {
			videoFilenames.push( basename( path ) )
			return videoFilenames
		}, [] )

		expect.assertions( videos.length )

		for ( const video of videos ) {
			const response = await fetch( `https://${ getDomain() }/dist/videos/welcome/${ video }`, {
				method: 'HEAD',
			} )
			expect( response.ok ).toBe( true )
		}
	} )
} )
