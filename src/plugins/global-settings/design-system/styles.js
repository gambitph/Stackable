export const getStyleParams = () => {
	return [
		{
			selector: ':root',
			styleRule: '--stk-block-margin-bottom',
			attrName: 'marginBottom',
			format: '%spx',
			responsive: 'all',
		},
		{
			selector: ':root',
			styleRule: '--stk-block-background-color',
			attrName: 'blockBackgroundColor',
		},
		{
			selector: ':root',
			styleRule: '--stk-block-background-padding',
			attrName: 'blockBackgroundPadding',
			responsive: 'all',
			valuePreCallback: value => {
				const getValue = value => value === 0 ? value : ( value || 24 )
				return getValue( value?.top ) + 'px ' + getValue( value?.right ) + 'px ' + getValue( value?.bottom ) + 'px ' + getValue( value?.left ) + 'px'
			},
		},
		{
			selector: ':root',
			styleRule: '--stk-container-background-color',
			attrName: 'containerBackgroundColor',
		},
		{
			selector: ':root',
			styleRule: '--stk-container-color',
			attrName: 'containerColor',
		},
		{
			selector: ':root',
			styleRule: '--stk-container-padding',
			attrName: 'containerPadding',
			responsive: 'all',
			valuePreCallback: value => {
				const getValue = value => value === 0 ? value : ( value || 32 )
				return getValue( value?.top ) + 'px ' + getValue( value?.right ) + 'px ' + getValue( value?.bottom ) + 'px ' + getValue( value?.left ) + 'px'
			},
		},
		{
			selector: ':root',
			styleRule: '--stk-container-border-radius',
			attrName: 'containerBorderRadius',
			format: '%spx',
		},
		{
			selector: ':root',
			styleRule: '--stk-container-box-shadow',
			attrName: 'containerBoxShadow',
		},
		{
			selector: ':root',
			styleRule: '--stk-column-margin',
			attrName: 'columnMargin',
			responsive: 'all',
			valuePreCallback: value => {
				const getValue = value => value === 0 ? value : ( value || 12 )
				return getValue( value?.top ) + 'px ' + getValue( value?.right ) + 'px ' + getValue( value?.bottom ) + 'px ' + getValue( value?.left ) + 'px'
			},
		},
		{
			selector: ':root',
			styleRule: '--stk-button-background-color',
			attrName: 'buttonBackgroundColor',
		},
		{
			selector: ':root',
			styleRule: '--stk-button-text-color',
			attrName: 'buttonTextColor',
		},
		{
			selector: ':root',
			styleRule: '--stk-button-padding',
			attrName: 'buttonPadding',
			responsive: 'all',
			valuePreCallback: value => {
				const getValue = ( value, defaultValue ) => value === 0 ? value : ( value || defaultValue )
				return getValue( value?.top, 12 ) + 'px ' + getValue( value?.right, 16 ) + 'px ' + getValue( value?.bottom, 12 ) + 'px ' + getValue( value?.left, 16 ) + 'px'
			},
		},
		{
			selector: ':root',
			styleRule: '--stk-icon-button-padding',
			attrName: 'iconButtonPadding',
			format: '%spx',
			responsive: 'all',
		},
		// {
		// 	selector: ':root',
		// 	styleRule: '--stk-button-gap',
		// 	attrName: 'buttonGap',
		// 	format: '%spx',
		// },
		{
			selector: ':root',
			styleRule: '--stk-button-ghost-border-width',
			attrName: 'buttonGhostBorderWidth',
			format: '%spx',
			responsive: 'all',
		},
		{
			selector: ':root',
			styleRule: '--stk-icon-color',
			attrName: 'iconColor',
		},
		{
			selector: ':root',
			styleRule: '--stk-icon-size',
			attrName: 'iconSize',
			format: '%spx',
			responsive: 'all',
		},
		// {
		// 	selector: ':root',
		// 	styleRule: '--stk-icon-shape-color',
		// 	attrName: 'iconShapeColor',
		// },
	]
}
