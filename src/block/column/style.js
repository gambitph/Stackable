/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	Column,
	ContainerDiv,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import {
	getUniqueBlockClass,
	getStyles,
	useStyles,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import {
	Fragment, memo, renderToString,
} from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const containerDivOptions = {
	sizeSelector: '.stk-block-column__content',
	sizeHorizontalAlignRule: 'margin',
	sizeVerticalAlignRule: 'justifyContent',
	sizeVerticalAlignSelector: '.%s-inner-blocks',
	sizeVerticalAlignSelectorEdit: '.%s-inner-blocks > .block-editor-inner-blocks > .block-editor-block-list__layout',
}

const getStyleParams = () => {
	return [
		{
			selector: '.%s-container',
			styleRule: 'marginTop',
			attrName: 'columnSpacing',
			responsive: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.top,
		},
		{
			selector: '.%s-container',
			styleRule: 'marginRight',
			attrName: 'columnSpacing',
			responsive: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.right,
		},
		{
			selector: '.%s-container',
			styleRule: 'marginBottom',
			attrName: 'columnSpacing',
			responsive: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.bottom,
		},
		{
			selector: '.%s-container',
			styleRule: 'marginLeft',
			attrName: 'columnSpacing',
			responsive: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.left,
		},
	]
}

const BlockStyles = memo( props => {
	const { clientId } = useBlockEditContext()
	const styles = useStyles( getStyleParams( props ) )

	return (
		<Fragment>
			<Alignment.Style
				{ ...props }
				columnAlignSelectorCallback={ () => `.editor-styles-wrapper [data-block="${ clientId }"]` }
			/>
			<BlockDiv.Style { ...props } />
			<Column.Style { ...props } />
			<ContainerDiv.Style { ...props } { ...containerDivOptions } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<StyleComponent
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...props }
			/>
		</Fragment>
	)
} )

BlockStyles.defaultProps = {
	isEditor: false,
}

BlockStyles.Content = props => {
	const {
		...propsToPass
	} = props

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	const styles = getStyles( props.attributes, getStyleParams( props.options ) )

	const stylesToRender = (
		<Fragment>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Column.Style.Content { ...propsToPass } />
			<ContainerDiv.Style.Content { ...propsToPass } options={ containerDivOptions } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<StyleComponent.Content
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)

	return renderToString( stylesToRender ) ? <style>{ stylesToRender }</style> : null
}

BlockStyles.Content.defaultProps = {
	attributes: {},
}

export default BlockStyles
