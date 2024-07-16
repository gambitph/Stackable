/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
	Typography,
	Alignment,
	MarginBottom,
	EffectsAnimations,
	Transform,
	Icon,
	Button,
} from '~stackable/block-components'
import {
	BlockCss,
	BlockCssCompiler,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const typographyOptions = {
	selector: '.stk-block-tab-labels__text',
	hoverSelector: '.stk-block-tabs__tab:hover .stk-block-tab-labels__text',
}

const buttonOptions = {
	selector: '.stk-block-tabs__tab',
	hoverSelector: '.stk-block-tabs__tab:not(.stk-block-tabs__tab--active):hover',
	backgroundSelector: '.stk-block-tabs__tab',
	borderSelector: '.stk-block-tabs__tab',
	borderHoverSelector: '.stk-block-tabs__tab:not(.stk-block-tabs__tab--active):hover',
}

const activeButtonOptions = {
	selector: '.stk-block-tabs__tab.stk-block-tabs__tab--active',
	hoverSelector: '.stk-block-tabs__tab.stk-block-tabs__tab--active:hover',
	backgroundSelector: '.stk-block-tabs__tab.stk-block-tabs__tab--active',
	borderSelector: '.stk-block-tabs__tab.stk-block-tabs__tab--active',
	borderHoverSelector: '.stk-block-tabs__tab.stk-block-tabs__tab--active:hover',
	borderEnabledCallback: null, // If this is enabled, then we should be able to render the border attributes for the active tab.
}

const iconOptions = {
	selector: '.stk-block-tabs__tab',
	hoverSelector: '.stk-block-tabs__tab:hover',
}

const _Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}

	const {
		dependencies = [],
	} = props

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-tab-labels__wrapper"
				styleRule="justifyContent"
				attrName="tabAlignment"
				key="tabAlignment"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-content.stk-block-tabs--horizontal .%s"
				styleRule="--tabs-flex"
				attrName="fullWidth"
				key="fullWidth"
				valuePreCallback={ value => {
					return value ? '1 1 auto' : undefined
				} }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--tabs-column-gap"
				attrName="columnGap"
				key="columnGap"
				responsive="all"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--tabs-row-gap"
				attrName="rowGap"
				key="rowGap"
				responsive="all"
				format="%spx"
			/>

			{ /* Icon */ }
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-tabs__tab"
				styleRule="flex-direction"
				attrName="iconPosition"
				key="iconPosition"
				valueCallback={ value => {
					if ( value === 'right' ) {
						return 'row-reverse'
					} else if ( value === 'top' ) {
						return 'column'
					} else if ( value === 'bottom' ) {
						return 'column-reverse'
					}
				} }
			/>

			{ /* Icon alignment */ }
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-tabs__tab"
				styleRuleCallback={ getAttribute => {
					return getAttribute( 'iconPosition' ) === '' || getAttribute( 'iconPosition' ) === 'right'
						? 'justifyContent'
						 : 'alignItems'
				} }
				attrName="contentAlign"
				key="iconAlignment-iconPosition"
				enabledCallback={ getAttribute => getAttribute( 'fullWidth' ) !== undefined || getAttribute( 'iconPosition' ) === 'top' || getAttribute( 'iconPosition' ) === 'bottom' }
				valueCallback={ ( value, getAttribute ) => {
					let newValue = value
					if ( value === '' || value === 'left' ) {
						newValue = 'flex-start'
					} else if ( value === 'center' ) {
						newValue = 'center'
					} else {
						newValue = 'flex-end'
					}

					// If right icon position, then we need to reverse the alignment.
					if ( getAttribute( 'iconPosition' ) === 'right' ) {
						if ( newValue === 'flex-start' ) {
							newValue = 'flex-end'
						} else if ( newValue === 'flex-end' ) {
							newValue = 'flex-start'
						}
					}

					return newValue
				} }
				responsive="all"
				dependencies={ [
					'fullWidth',
					'iconPosition',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-tabs__tab"
				styleRule="gap"
				attrName="iconGap"
				key="iconGap"
				format="%spx"
			/>

			{ /* Tab text colors */ }
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-tabs__tab"
				hoverSelector=".stk-block-tabs__tab:hover"
				styleRule="color"
				attrName="tabTextColor1"
				key="tabTextColor"
				hover="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-tabs__tab.stk-block-tabs__tab--active .stk-block-tab-labels__text"
				hoverSelector=".stk-block-tabs__tab.stk-block-tabs__tab--active:hover .stk-block-tab-labels__text"
				styleRule="color"
				attrName="activeTabTextColor"
				key="activeTabTextColor"
				hover="all"
			/>

			{ /* Enable labels layout to more customizable */ }
			<BlockCss
				{ ...propsToPass }
				enabledCallback={ getAttribute => getAttribute( 'iconPosition' ) === '' || getAttribute( 'iconPosition' ) === 'right' }
				selector=".stk-block-tab-labels__wrapper .stk-block-tab-labels__text"
				styleRule="width"
				attrName="fixedIconPosition"
				valueCallback={ value => {
					return value ? '100%' : undefined
				} }
				key="fixedIconPosition"
				responsive="all"
				dependencies={ [
					'iconPosition',
					 ...dependencies,
				] }
			/>
		</>
	)
}

const Styles = memo( _Styles )
Styles.Content = _Styles

export const TabStyles = memo( props => {
	return (
		<>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Typography.Style { ...props } { ...typographyOptions } attrNameTemplate="tab%s" />
			<Icon.Style { ...props } { ...iconOptions } hasIconGap={ false } />
			<Styles { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Button.Style { ...props } { ...buttonOptions } attrNameTemplate="tab%s" />
			<Button.Style { ...props } { ...activeButtonOptions } attrNameTemplate="activeTab%s" />
		</>
	)
} )

TabStyles.defaultProps = {
	version: '',
}

TabStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			<Alignment.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<Typography.Style.Content { ...props } { ...typographyOptions } attrNameTemplate="tab%s" />
			<Icon.Style.Content { ...props } { ...iconOptions } hasIconGap={ false } />
			<EffectsAnimations.Style.Content { ...props } />
			<MarginBottom.Style.Content { ...props } />
			<Styles.Content { ...props } />
			<Button.Style.Content { ...props } { ...buttonOptions } attrNameTemplate="tab%s" />
			<Button.Style.Content { ...props } { ...activeButtonOptions } attrNameTemplate="activeTab%s" />
		</BlockCssCompiler>
	)
}

TabStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}

