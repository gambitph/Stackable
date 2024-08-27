/**
 * External dependencies
 */
import { BlockCss } from '~stackable/components'

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		selector,
		enableColumnGap = true,
	} = props

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="columnGap"
				attrName="columnGap"
				key="columnGap"
				format="%spx"
				responsive="all"
				enabledCallback={ () => enableColumnGap }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="rowGap"
				attrName="rowGap"
				key="rowGap"
				format="%spx"
				responsive="all"
			/>
		</>
	)
}

export const FlexGapStyles = props => {
	return <Styles { ...props } />
}

FlexGapStyles.Content = props => {
	return <Styles { ...props } />
}

FlexGapStyles.addStyles = ( blockStyleGenerator, props = {} ) => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		selector,
		editSelector = '',
		saveSelector = '',
		enableColumnGap = true,
	} = props

	blockStyleGenerator.addBlockStyles( 'columnGap', [ {
		...propsToPass,

		renderIn: 'edit',
		selector: editSelector || selector,
		styleRule: 'columnGap',
		attrName: 'columnGap',
		key: 'columnGap',
		format: '%spx',
		responsive: 'all',
		enabledCallback: () => enableColumnGap,
	}, {
		...propsToPass,
		renderIn: 'save',
		selector: saveSelector || selector,
		styleRule: 'columnGap',
		attrName: 'columnGap',
		key: 'columnGap',
		format: '%spx',
		responsive: 'all',
		enabledCallback: () => enableColumnGap,
	} ] )

	blockStyleGenerator.addBlockStyles( 'rowGap', [ {
		...propsToPass,
		renderIn: 'edit',
		selector: editSelector || selector,
		styleRule: 'rowGap',
		attrName: 'rowGap',
		key: 'rowGap',
		format: '%spx',
		responsive: 'all',
	}, {
		...propsToPass,
		renderIn: 'save',
		selector: saveSelector || selector,
		styleRule: 'rowGap',
		attrName: 'rowGap',
		key: 'rowGap',
		format: '%spx',
		responsive: 'all',
	} ] )
}
