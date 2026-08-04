// This helper is called only by the inserter variation and explicit block
// transforms. Parsed existing blocks and Design Library blocks do not call it.
export const getHeadingDefaultAttributes = ( editorSettings = {} ) => {
	const isPost = editorSettings.stackable_current_post_type === 'post'

	return {
		// Posts and non-post editor screens have separate admin defaults.
		useThemeTextMargins: isPost
			? !! editorSettings.stackable_enable_heading_default_theme_margins_posts
			: !! editorSettings.stackable_enable_heading_default_theme_margins_non_posts,
	}
}
