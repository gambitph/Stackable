/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
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
				key="fullWidth"
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
		</>
	)
}

export const TabLabelStyle = memo( props => {
	return (
		<>
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
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
			<Styles { ...props } />
		</BlockCssCompiler>
	)
}

TabLabelStyle.Content.defaultProps = {
	version: '',
	attributes: {},
}

