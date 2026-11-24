const SELECTOR_REPLACEMENT = {
	container: {
		edit: '>:where(.stk-container)',
		save: '>:where(.stk-container)',
	},
	innerBlocks: {
		edit: '>:where(.stk-inner-blocks)',
		save: '>:where(.stk-container)>:where(.stk-inner-blocks)',
	},
	blockAlign: {
		edit: '>:where(.stk-inner-blocks)',
		save: '>:where(.stk-inner-blocks)',
	},
}

export const replaceBlockStyleSelectors = ( css, uniqueId, clientId, blockStyleSlug, mode = 'save' ) => {
	if ( ! uniqueId ) {
		return css
	}

	css = css.replaceAll( `stk-${ uniqueId }`, blockStyleSlug )
	if ( mode === 'edit' ) {
		css = css.replaceAll( `[data-block="${ clientId }"]`, `[data-block-style="${ blockStyleSlug }"]` )
	}

	css = css.replaceAll( `${ blockStyleSlug }-container`, `${ blockStyleSlug }${ SELECTOR_REPLACEMENT.container[ mode ] }` )
	css = css.replaceAll( `${ blockStyleSlug }-inner-blocks`, `${ blockStyleSlug }${ SELECTOR_REPLACEMENT.innerBlocks[ mode ] }` )
	css = css.replaceAll( `.stk--block-align-${ uniqueId }`, SELECTOR_REPLACEMENT.blockAlign[ mode ] )

	return css
}
