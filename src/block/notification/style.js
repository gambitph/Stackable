/**
 * External dependencies
 */
import {
	BlockDiv,
	Alignment,
	Advanced,
	EffectsAnimations,
	ContainerDiv,
	MarginBottom,
	Transform,
	ContentAlign,
} from '~stackable/block-components'
import { Style as StyleComponent } from '~stackable/components'
import {
	getUniqueBlockClass,
	useStyles,
	getStyles,
} from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	memo, Fragment, renderToString,
} from '@wordpress/element'

const containerDivOptions = {
	sizeSelector: '.stk-block-notification__content',
	sizeHorizontalAlignRule: 'margin',
}

const getStyleParams = () => {
	return [
		{
			selector: '.stk-container',
			attrName: 'dismissibleSize',
			styleRule: 'paddingInlineEnd',
			enabledCallback: getAttribute => getAttribute( 'isDismissible' ) && getAttribute( 'dismissibleSize' ),
			valuePreCallback: value => value + 44, // 44 is an arbitrary number based on the size of the container paddings vs the close button size.
			format: '%spx',
		},
		{
			selector: '.stk-block-notification__close-button svg',
			attrName: 'dismissibleColor',
			styleRule: 'fill',
			enabledCallback: getAttribute => getAttribute( 'isDismissible' ),
		},
	]
}

export const ContainerStyles = memo( props => {
	const styles = useStyles( getStyleParams() )

	return (
		<Fragment>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<ContainerDiv.Style { ...props } { ...containerDivOptions } />
			<MarginBottom.Style { ...props } />
			<ContentAlign.Style { ...props } />
			<StyleComponent
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...props }
			/>
		</Fragment>
	)
} )

ContainerStyles.defaultProps = {
	isEditor: false,
}

ContainerStyles.Content = props => {
	const {
		...propsToPass
	} = props

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	const styles = getStyles( propsToPass.attributes, getStyleParams() )

	const stylesToRender = (
		<Fragment>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<ContainerDiv.Style.Content { ...propsToPass } options={ containerDivOptions } />
			<MarginBottom.Style.Content { ...propsToPass } />
			<ContentAlign.Style.Content { ...propsToPass } />
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

ContainerStyles.Content.defaultProps = {
	attributes: {},
}
