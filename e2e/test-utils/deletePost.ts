import { RequestUtils } from '@wordpress/e2e-test-utils-playwright/build-types'

const deletePost = async ( requestUtils : RequestUtils, pid: string, postType: string = 'posts' ) => {
	await requestUtils.rest( {
		method: 'DELETE',
		path: `/wp/v2/${ postType }/${ pid }`,
		params: {
			force: true,
		},
	} )
}

export { deletePost }
