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
import {
	getUniqueBlockClass, useStyles, getStyles,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo, renderToString } from '@wordpress/element'

const flexGapOptionsEdit = {
	selector: '.block-editor-block-list__layout',
}

const flexGapOptionsSave = {
	selector: '.stk-inner-blocks',
}

const getStyleParams = () => {
	return [
		{
			renderIn: 'save',
			selector: '.stk-button-group',
			styleRule: 'flexWrap',
			attrName: 'flexWrap',
			responsive: 'all',
		},
		{
			renderIn: 'edit',
			selector: '.stk-button-group .block-editor-block-list__layout',
			styleRule: 'flexWrap',
			attrName: 'flexWrap',
			responsive: 'all',
			valuePreCallback: ( value, getAttribute, device ) => {
				// In the editor, it should correctly wrap in mobile.
				if ( device === 'mobile' ) {
					return 'wrap'
				}
				return value || 'nowrap'
			},
		},
		{
			renderIn: 'save',
			selector: '.stk-button-group',
			styleRule: 'flexDirection',
			attrName: 'buttonAlign',
			responsive: 'all',
			valuePreCallback: value => {
				if ( value === 'vertical' ) {
					return 'column'
				} else if ( value === 'horizontal' ) {
					return 'row'
				}
				return value
			},
		},
		{
			renderIn: 'edit',
			selector: '.stk-button-group .block-editor-block-list__layout',
			styleRule: 'flexDirection',
			attrName: 'buttonAlign',
			responsive: 'all',
			valuePreCallback: value => {
				if ( value === 'vertical' ) {
					return 'column'
				} else if ( value === 'horizontal' ) {
					return 'row'
				}
				return value
			},
		},
		// If the buttons are set to vertical, we also need to reset the flex
		// basis or else full-width buttons (set per button block) will overlap
		// each other vertically.
		{
			renderIn: 'save',
			selector: '.stk-block',
			styleRule: 'flexBasis',
			attrName: 'buttonAlign',
			responsive: 'all',
			valuePreCallback: value => {
				return value === 'vertical' ? 'auto'
					: value === 'horizontal' ? 0
						: undefined
			},
		},
		{
			renderIn: 'save',
			selector: '.stk-button-group',
			styleRule: 'alignItems',
			attrName: 'buttonAlign',
			responsive: 'all',
			valuePreCallback: ( value, getAttribute ) => {
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
			},
			dependencies: [ 'contentAlign', 'buttonFullWidth' ],
		},
		{
			renderIn: 'edit',
			selector: '.stk-button-group .block-editor-block-list__layout',
			styleRule: 'alignItems',
			attrName: 'buttonAlign',
			responsive: 'all',
			valuePreCallback: ( value, getAttribute ) => {
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
			},
			dependencies: [ 'contentAlign', 'buttonFullWidth' ],
		},
		{
			renderIn: 'save',
			selector: '.stk-block-button, .stk-block-icon-button',
			styleRule: 'flex',
			attrName: 'buttonFullWidth',
			valueCallback: value => {
				return value ? '1' : undefined
			},
		},
		{
			renderIn: 'edit',
			selector: '.stk-block-button, .stk-block-icon-button, [data-type^="stackable/"]',
			styleRule: 'flex',
			attrName: 'buttonFullWidth',
			valueCallback: value => {
				return value ? '1' : undefined
			},
		},
		// This is to make icon buttons stretch.
		{
			selector: '.stk-block-icon-button .stk-button',
			styleRule: 'width',
			attrName: 'buttonFullWidth',
			valueCallback: value => {
				return value ? '100%' : undefined
			},
		},
	]
}

export const ButtonGroupStyles = memo( props => {
	const buttonGroupStyles = useStyles( getStyleParams() )

	return (
		<>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<MarginBottom.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<FlexGapStyles { ...props } { ...flexGapOptionsEdit } />
			<StyleComponent
				styles={ buttonGroupStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...props }
			/>
		</>
	)
} )

ButtonGroupStyles.defaultProps = {
	isEditor: false,
}

ButtonGroupStyles.Content = props => {
	const {
		...propsToPass
	} = props

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	const buttonGroupStyles = getStyles( propsToPass.attributes, getStyleParams() )

	const styles = (
		<>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<MarginBottom.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<FlexGapStyles.Content { ...propsToPass } options={ flexGapOptionsSave } />
			<StyleComponent.Content
				styles={ buttonGroupStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

ButtonGroupStyles.Content.defaultProps = {
	attributes: {},
}

