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
				selector={ selector }
				styleRule="columnGap"
				attrName="columnGap"
				format="%spx"
				responsive="all"
				enabledCallback={ () => enableColumnGap }
				{ ...propsToPass }
			/>
			<BlockCss
				selector={ selector }
				styleRule="rowGap"
				attrName="rowGap"
				format="%spx"
				responsive="all"
				{ ...propsToPass }
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
