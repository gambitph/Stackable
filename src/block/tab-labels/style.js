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
				selector=".stk-block-tab-labels__wrapper"
				styleRule="justifyContent"
				attrName="tabAlignment"
				key="tabAlignment"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--tabs-flex"
				attrName="fullWidth"
				key="fullWidth"
				responsive="all"
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
				enabledCallback={ getAttribute => getAttribute( 'fullWidth' ) || getAttribute( 'iconPosition' ) === 'top' || getAttribute( 'iconPosition' ) === 'bottom' }
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
				dependencies={ [ 'fullWidth', 'iconPosition' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-tabs__tab"
				styleRule="gap"
				attrName="iconGap"
				key="iconGap"
				format="%spx"
			/>

			{ /* Hover colors */ }
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-tabs__tab--active"
				hoverSelector=".stk-block-tabs__tab--active:hover"
				styleRule="backgroundColor"
				attrName="activeBackgroundColor"
				key="activeBackgroundColor"
				hover="all"
			/>

		</>
	)
}

export const TextStyles = memo( props => {
	return (
		<>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Typography.Style { ...props } { ...typographyOptions } />
			<Icon.Style { ...props } hasIconGap={ false } />
			<Styles { ...props } />
			<EffectsAnimations.Style { ...props } />
		</>
	)
} )

TextStyles.defaultProps = {
	version: '',
}

TextStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			<Alignment.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<Typography.Style.Content { ...props } { ...typographyOptions } />
			<Icon.Style.Content { ...props } hasIconGap={ false } />
			<EffectsAnimations.Style.Content { ...props } />
			<MarginBottom.Style.Content { ...props } />
			<Styles { ...props } />
		</BlockCssCompiler>
	)
}

TextStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}

