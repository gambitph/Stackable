/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	EffectsAnimations,
	MarginBottom,
	FlexGapStyles,
	Transform,
} from '~stackable/block-components'
import { BlockCss, BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const flexGapOptionsEdit = {
	selector: '.block-editor-block-list__layout',
}

const flexGapOptionsSave = {
	selector: '.stk-inner-blocks',
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
				renderIn="save"
				selector=".stk-button-group"
				styleRule="flexWrap"
				attrName="flexWrap"
				key="flexWrap-save"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".stk-button-group .block-editor-block-list__layout"
				styleRule="flexWrap"
				attrName="flexWrap"
				key="flexWrap"
				responsive="all"
				valuePreCallback={ ( value, getAttribute, device ) => {
				// In the editor, it should correctly wrap in mobile.
					if ( device === 'mobile' ) {
						return 'wrap'
					}
					return value || 'nowrap'
				} }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".stk-button-group"
				styleRule="flexDirection"
				attrName="buttonAlign"
				key="buttonAlign-save-group"
				responsive="all"
				valuePreCallback={ value => {
					if ( value === 'vertical' ) {
						return 'column'
					} else if ( value === 'horizontal' ) {
						return 'row'
					}
					return value
				} }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".stk-button-group .block-editor-block-list__layout"
				styleRule="flexDirection"
				attrName="buttonAlign"
				key="buttonAlign-list-layout"
				responsive="all"
				valuePreCallback={ value => {
					if ( value === 'vertical' ) {
						return 'column'
					} else if ( value === 'horizontal' ) {
						return 'row'
					}
					return value
				} }
			/>

			{
			// If the buttons are set to vertical, we also need to reset the flex
			// basis or else full-width buttons (set per button block) will overlap
			// each other vertically.
			}
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".stk-block"
				styleRule="flexBasis"
				attrName="buttonAlign"
				key="buttonAlign-save-block"
				responsive="all"
				valuePreCallback={ value => {
					return value === 'vertical' ? 'auto'
						: value === 'horizontal' ? 0
							: undefined
				} }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".stk-button-group"
				styleRule="alignItems"
				attrName="buttonAlign"
				key="buttonAlign-save-button-group"
				responsive="all"
				valuePreCallback={ ( value, getAttribute ) => {
					if ( value === 'vertical' ) {
						const buttonFullWidth = getAttribute( 'buttonFullWidth' )
						if ( buttonFullWidth ) {
							return 'stretch'
						}
						const contentAlign = getAttribute( 'contentAlign' )
						if ( contentAlign === 'center' ) {
							return 'center'
						} else if ( contentAlign === 'right' ) {
							return 'flex-end'
						}
						return 'flex-start'
					} else if ( value === 'horizontal' ) {
						return 'center'
					}
					return value
				} }
				dependencies={ [ 'contentAlign', 'buttonFullWidth' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".stk-button-group .block-editor-block-list__layout"
				styleRule="alignItems"
				attrName="buttonAlign"
				key="buttonAlign-group-list-layout"
				responsive="all"
				valuePreCallback={ ( value, getAttribute ) => {
					if ( value === 'vertical' ) {
						const buttonFullWidth = getAttribute( 'buttonFullWidth' )
						if ( buttonFullWidth ) {
							return 'stretch'
						}
						const contentAlign = getAttribute( 'contentAlign' )
						if ( contentAlign === 'center' ) {
							return 'center'
						} else if ( contentAlign === 'right' ) {
							return 'flex-end'
						}
						return 'flex-start'
					} else if ( value === 'horizontal' ) {
						return 'center'
					}
					return value
				} }
				dependencies={ [ 'contentAlign', 'buttonFullWidth' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".stk-block-button, .stk-block-icon-button"
				styleRule="flex"
				attrName="buttonFullWidth"
				key="buttonFullWidth-save"
				valueCallback={ value => {
					return value ? '1' : undefined
				} }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector={ `.stk-block-button, .stk-block-icon-button, [data-type^="stackable/"]` }
				styleRule="flex"
				attrName="buttonFullWidth"
				key="buttonFullWidth"
				valueCallback={ value => {
					return value ? '1' : undefined
				} }
			/>
			<BlockCss
				{ ...propsToPass }
				// This is to make icon buttons stretch.
				selector=".stk-block-icon-button .stk-button"
				styleRule="width"
				attrName="buttonFullWidth"
				key="buttonFullWidth-icon-button"
				valueCallback={ value => {
					return value ? '100%' : undefined
				} }
			/>
		</>
	)
}

export const ButtonGroupStyles = memo( props => {
	return (
		<>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<MarginBottom.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<FlexGapStyles { ...props } { ...flexGapOptionsEdit } />
			<Styles { ...props } />
		</>
	)
} )

ButtonGroupStyles.defaultProps = {
	version: '',
}

ButtonGroupStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			<Alignment.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<MarginBottom.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<FlexGapStyles.Content { ...props } { ...flexGapOptionsSave } />
			<Styles { ...props } />
		</BlockCssCompiler>
	)
}

ButtonGroupStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}

