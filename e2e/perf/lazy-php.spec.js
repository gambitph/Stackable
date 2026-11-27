/**
 * PHP that round 2 loads lazily in the frontend still works when it's needed.
 */
const { test, expect } = require( '@playwright/test' )
const { resetSite, createPage, get, wp } = require( './lib/site' )

test( 'v2 Posts block (blog-posts) still renders with v2 frontend compatibility on', async () => {
	await resetSite()
	createPage( 'v2-post', 'v2-blog-posts.html', [ '--post_type=post' ] )
	createPage( 'v2-blog-posts', 'v2-blog-posts.html' )
	wp( 'option', 'update', 'stackable_v2_frontend_compatibility', '1' )
	const html = ( await get( '/v2-blog-posts/' ) ).text
	expect( html ).toContain( 'ugb-blog-posts__item' )
	expect( html ).toContain( 'V2MARK' )
} )
