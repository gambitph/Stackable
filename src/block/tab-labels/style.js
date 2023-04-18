/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
	Icon,
	BackgroundStyle,
	SizeStyle,
	BorderStyle,
	Typography,
} from '~stackable/block-components'
import { BlockCss, BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector=".%s .stk-block-tab-labels__wrapper"
				styleRule="flexWrap"
				attrName="fullWidth"
				key="fullWidthFlexWrap"
				valueCallback={ value => {
					if ( ! value ) {
						return
					}
					return 'nowrap'
				} }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s .stk-block-tabs__tab"
				styleRule="width"
				attrName="fullWidth"
				key="fullWidth"
				valueCallback={ value => {
					if ( ! value ) {
						return
					}
					return '100%'
				} }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s .stk-block-tab-labels__wrapper"
				styleRule="gap"
				attrName="gap"
				key="gap"
				hasUnits="px"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s .stk-block-tabs__tab"
				styleRule="flexDirection"
				attrName="iconPosition"
				valueCallback={ value => {
					if ( value === 'top' ) {
						return 'column'
					} else if ( value === 'bottom' ) {
						return 'column-reverse'
					}
				} }
				key="iconPosition"
			/>
		</>
	)
}

export const TabLabelStyle = memo( props => {
	return (
		<>
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Icon.Style { ...props } />
			<BackgroundStyle
				{ ...props }
				attrNameTemplate="tabLabels%s"
				selector=".stk-block-tabs__tab"
			/>
			<SizeStyle
				{ ...props }
				attrNameTemplate="tabLabels%s"
				selector=".stk-block-tabs__tab"
			/>
			<BorderStyle
				{ ...props }
				attrNameTemplate="tabLabels%s"
				selector=".stk-block-tabs__tab"
			/>
			<Typography.Style { ...props } selector=".stk-block-tab-labels__text" />
			<Styles { ...props } />
		</>
	)
} )

TabLabelStyle.defaultProps = {
	version: '',
}

TabLabelStyle.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			<BlockDiv.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<BackgroundStyle.Content
				{ ...props }
				attrNameTemplate="tabLabels%s"
				selector=".stk-block-tabs__tab"
			/>
			<SizeStyle.Content
				{ ...props }
				attrNameTemplate="tabLabels%s"
				selector=".stk-block-tabs__tab"
			/>
			<BorderStyle.Content
				{ ...props }
				attrNameTemplate="tabLabels%s"
				selector=".stk-block-tabs__tab"
			/>
			<Typography.Style.Content { ...props } selector=".stk-block-tab-labels__text" />
			<Styles { ...props } />
		</BlockCssCompiler>
	)
}

TabLabelStyle.Content.defaultProps = {
	version: '',
	attributes: {},
}

