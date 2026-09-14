import { expect } from '@wordpress/e2e-test-utils-playwright'
import type { Page } from '@playwright/test'
import type { ExtendedRequestUtils } from './requestUtils'

type AdminFixture = {
	getPageError: () => Promise<string | null>;
}

type EditorFixture = {
	page: Page;
	saveDraft: () => Promise<unknown>;
}

const readPostIdFromEditor = ( page: Page ) => {
	const postQuery = new URL( page.url() ).search
	return new URLSearchParams( postQuery ).get( 'post' )
}

/**
 * Publish the current editor draft via REST and open the frontend permalink.
 *
 * @param page
 * @param editor
 * @param requestUtils
 * @param admin
 */
export const publishAndVisitFrontend = async (
	page: Page,
	editor: EditorFixture,
	requestUtils: ExtendedRequestUtils,
	admin: AdminFixture
) => {
	await editor.saveDraft()
	const postId = readPostIdFromEditor( editor.page )
	expect( postId ).toBeTruthy()

	await requestUtils.updatePost( postId as string, { status: 'publish' } )
	const post = await requestUtils.rest( {
		path: `/wp/v2/posts/${ postId }`,
	} )

	await page.goto( post.link )

	const pageError = await admin.getPageError()
	expect( pageError ).toBeNull()

	return { postId, link: post.link as string }
}

export const getEditorPostId = readPostIdFromEditor
