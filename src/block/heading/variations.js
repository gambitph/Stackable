/**
 * External dependencies
 */
import { settings } from 'stackable'

// Keep the admin default scoped to direct inserter creation. Parsed blocks and
// blocks created by the Design Library do not apply inserter variations.
export const getHeadingVariations = ( editorSettings = {} ) => {
	const isPost = editorSettings.stackable_current_post_type === 'post'
	const useThemeTextMargins = isPost
		? !! editorSettings.stackable_enable_heading_default_theme_margins_posts
		: !! editorSettings.stackable_enable_heading_default_theme_margins_non_posts

	return [
		{
			name: 'default',
			isDefault: true,
			scope: [ 'inserter' ],
			attributes: {
				useThemeTextMargins,
			},
		},
	]
}

export default getHeadingVariations( settings )
