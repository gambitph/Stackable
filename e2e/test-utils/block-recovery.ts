import { expect } from '@wordpress/e2e-test-utils-playwright'
import type { ExtendedEditor } from './editor'

/**
 * Fail when Gutenberg shows invalid-block recovery UI.
 * Do not listen for console "Block validation" messages.
 *
 * @param editor
 */
export const assertNoBlockRecovery = async ( editor: ExtendedEditor ) => {
	const canvas = editor.canvas

	await expect( canvas.locator( 'body' ) ).toBeVisible()

	const warning = canvas.locator( '.block-editor-warning' )
	const recoveryButton = canvas.getByRole( 'button', { name: /Attempt (Block )?Recovery/i } )
	const invalidCopy = canvas.getByText( /unexpected or invalid content/i )

	await expect( warning ).toHaveCount( 0 )
	await expect( recoveryButton ).toHaveCount( 0 )
	await expect( invalidCopy ).toHaveCount( 0 )
}
