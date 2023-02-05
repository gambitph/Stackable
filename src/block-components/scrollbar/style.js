import { BlockCss } from '~stackable/components'

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.6.4',
		versionDeprecated: '',
	}

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector={ props.selector }
				styleRule="--stk-scrollbar-height"
				attrName="scrollbarHeight"
				key="scrollbarHeight"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ props.selector }
				styleRule="--stk-scrollbar-track-color"
				attrName="scrollbarTrackColor"
				key="scrollbarTrackColor"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ props.selector }
				styleRule="--stk-scrollbar-thumb-color"
				attrName="scrollbarThumbColor"
				key="scrollbarThumbColor"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ props.selector }
				styleRule="--stk-scrollbar-thumb-radius"
				attrName="scrollbarThumbRadius"
				key="scrollbarThumbRadius"
				hasUnits="px"
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
