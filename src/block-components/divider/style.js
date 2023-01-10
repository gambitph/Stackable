/**
 * Internal dependencies
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
		selector = '',
		selectorCallback = null,
	 } = props

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				selectorCallback={ selectorCallback }
				styleRule="color"
				attrName="dividerColor"
				key="dividerColor"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				selectorCallback={ selectorCallback }
				styleRule="fontSize"
				attrName="dividerSize"
				key="dividerSize"
				hasUnits="px"
				responsive="all"
			/>
		</>
	)
}

export const Style = props => {
	return <Styles { ...props } />
}

Style.Content = props => {
	return <Styles { ...props } />
}

// @TODO: gap for gap inbetween and background color and remove margins and natural padding
