export { default as marginBottomAttributes } from './attributes'
export { default as useMarginBottom } from './use-margin-bottom'
export { default as addMarginBottomStyles } from './style'

export const getMarginBottomProps = attributes => {
	return {
		previewSelector: `.stk-${ attributes.uniqueId }`,
		valueDesktop: attributes.blockMarginBottom,
		valueTablet: attributes.blockMarginBottomTablet,
		valueMobile: attributes.blockMarginBottomMobile,
	}
}
