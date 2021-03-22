export * from './attributes'
export * from './use-margin-bottom'
export * from './style'

export const getMarginBottomProps = attributes => {
	return {
		previewSelector: `.stk-${ attributes.uniqueId }`,
		valueDesktop: attributes.blockMarginBottom,
		valueTablet: attributes.blockMarginBottomTablet,
		valueMobile: attributes.blockMarginBottomMobile,
	}
}
