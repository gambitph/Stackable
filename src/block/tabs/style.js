/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
	Alignment,
	MarginBottom,
	EffectsAnimations,
	Transform,
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
				selector=".%s .stk-block-tabs__wrapper"
				styleRule="display"
				attrName="tabLayout"
				key="tabLayoutDisplay"
				valueCallback={ () => {
					return 'flex'
				} }
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s .stk-block-tabs__wrapper .wp-block-stackable-tab-labels"
				styleRule="width"
				attrName="tabLayout"
				key="tabLayoutWidth"
				valueCallback={ value => {
					if ( value === 'left' || value === 'right' ) {
						return 'max-content'
					}
				} }
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s .stk-block-tabs__wrapper .wp-block-stackable-tab-labels .stk-block-tab-labels__wrapper"
				styleRule="flexDirection"
				attrName="tabLayout"
				key="tabLayoutInnerFlexDirection"
				valueCallback={ value => {
					if ( value === 'left' || value === 'right' ) {
						return 'column'
					}
				} }
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s .stk-block-tabs__wrapper"
				styleRule="flexDirection"
				attrName="tabLayout"
				key="tabLayoutOuterFlexDirection"
				valueCallback={ value => {
					if ( value === 'bottom' ) {
						return 'column-reverse'
					}
					if ( value === 'left' ) {
						return 'row'
					}
					if ( value === 'right' ) {
						return 'row-reverse'
					}
				} }
				responsive="all"
			/>
		</>
	)
}

export const TabsStyle = memo( props => {
	return (
		<>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Styles { ...props } />
			<EffectsAnimations.Style { ...props } />
		</>
	)
} )

TabsStyle.defaultProps = {
	version: '',
}

TabsStyle.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			<Alignment.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<MarginBottom.Style.Content { ...props } />
			<Styles { ...props } />
		</BlockCssCompiler>
	)
}

TabsStyle.Content.defaultProps = {
	version: '',
	attributes: {},
}

