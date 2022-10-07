/**
 * This plugin is in charge of adding the default/normal and wide sizes of
 * blocks as defined in the current theme.json and adding them as custom CSS
 * properties for our blocks to pick up in the editor.
 */
import { useSetting } from '@wordpress/block-editor'

export const ThemeBlockSize = () => {
	const contentSize = useSetting( 'layout.contentSize' )
	const wideSize = useSetting( 'layout.wideSize' )

	if ( ! contentSize && ! wideSize ) {
		return null
	}

	return (
		<style id="stk-theme-block-size">
			{ contentSize && `:root { --stk-block-width-default-detected: ${ contentSize }}` }
			{ wideSize && `:root { --stk-block-width-wide-detected: ${ wideSize }}` }
		</style>
	)
}
