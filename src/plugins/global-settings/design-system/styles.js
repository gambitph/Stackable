export const getStyleParams = () => {
	return [
		{
			selector: ':root',
			styleRule: '--stk-block-margin-bottom',
			attrName: 'marginBottom',
			format: '%spx',
			responsive: 'all',
		},
	]
}
