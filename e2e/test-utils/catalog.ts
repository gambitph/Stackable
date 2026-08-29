import { expect } from '@wordpress/e2e-test-utils-playwright'
import { TOP_LEVEL_BLOCKS } from '../config/blocks-catalog.js'
import type { ExtendedEditor } from './editor'

export { TOP_LEVEL_BLOCKS }

export const waitForBlockEditor = async ( editor: ExtendedEditor ) => {
	await editor.page.waitForFunction(
		() => window?.wp?.blocks?.createBlock && window?.wp?.data?.dispatch
	)
	await expect( editor.canvas.locator( 'body' ) ).toBeVisible( { timeout: 60_000 } )
}

/**
 * Insert default instances via the active plugin's createBlock (old or current save()).
 *
 * @param editor
 * @param names
 */
export const insertStackableCatalog = async (
	editor: ExtendedEditor,
	names: string[] = TOP_LEVEL_BLOCKS
) => {
	await waitForBlockEditor( editor )

	await editor.page.evaluate( blockNames => {
		const { createBlock } = window.wp.blocks
		const { insertBlocks } = window.wp.data.dispatch( 'core/block-editor' )
		insertBlocks( blockNames.map( name => createBlock( name ) ) )
	}, names )

	for ( const name of names ) {
		await expect(
			editor.canvas.locator( `[data-type="${ name }"]` ).first()
		).toBeVisible( { timeout: 60_000 } )
	}
}
