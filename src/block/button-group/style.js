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
			valuePreCallback: value => {
				return value || 'nowrap'
			},
		},
		{
			renderIn: 'save',
			selector: '.stk-button-group',
			styleRule: 'flexDirection',
			attrName: 'collapseOn',
			responsive: 'all',
			valuePreCallback: ( _, getAttribute, device ) => {
				return device === getAttribute( 'collapseOn' ) ? 'column' : undefined
			},
		},
		{
			renderIn: 'edit',
			selector: '.stk-button-group .block-editor-block-list__layout',
			styleRule: 'flexDirection',
			attrName: 'collapseOn',
			responsive: 'all',
			valuePreCallback: ( _, getAttribute, device ) => {
				return device === getAttribute( 'collapseOn' ) ? 'column' : undefined
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

