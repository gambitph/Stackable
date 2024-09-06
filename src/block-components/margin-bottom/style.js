export const addStyles = ( blockStyleGenerator, props = {} ) => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		selector = '',
	} = props

	blockStyleGenerator.addBlockStyles( 'blockMarginBottom', [ {
		...propsToPass,
		selector,
		styleRule: 'marginBottom',
		attrName: 'blockMarginBottom',
		key: 'blockMarginBottom',
		responsive: 'all',
		format: '%spx',
	} ] )
}
