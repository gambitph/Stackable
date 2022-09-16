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
	BackgroundStyle,
	BorderStyle,
	Transform,
} from '~stackable/block-components'
import {
	getUniqueBlockClass,
	getStyles,
	useStyles,
} from '~stackable/util'
import { useBlockAttributesContext } from '~stackable/hooks'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo, renderToString } from '@wordpress/element'

const getStyleParams = () => {
	return [
		{
			selector: '.stk-block-number-box__text',
			styleRule: 'height',
			attrName: 'shapeSize',
			responsive: 'all',
			hasUnits: 'px',
			enabledCallback: getAttribute => getAttribute( 'hasShape' ),
			dependencies: [ 'hasShape' ],
		},
		{
			selector: '.stk-block-number-box__text',
			styleRule: 'width',
			attrName: 'shapeSize',
			responsive: 'all',
			hasUnits: 'px',
			enabledCallback: getAttribute => getAttribute( 'hasShape' ),
			dependencies: [ 'hasShape' ],
		},
	]
}

export const HeadingStyles = memo( props => {
	const hasShape = useBlockAttributesContext( attributes => attributes.hasShape )
	const styles = useStyles( getStyleParams() )

	return (
		<>
			{ hasShape &&
				<>
					<BackgroundStyle
						{ ...props }
						attrNameTemplate="shape%s"
						selector=".stk-block-number-box__text"
						backgroundFallbackColor="#000000"
					/>
					<BorderStyle
						{ ...props }
						attrNameTemplate="shape%s"
						selector=".stk-block-number-box__text"
					/>
				</>
			}
			<StyleComponent
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...props }
			/>

			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Typography.Style
				{ ...props }
				selector=".stk-block-number-box__text"
			/>
			<EffectsAnimations.Style { ...props } />
		</>
	)
} )

HeadingStyles.defaultProps = {
	isEditor: false,
	attributes: {},
	options: {},
}

HeadingStyles.Content = props => {
	const {
		...propsToPass
	} = props

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	const styles = getStyles( props.attributes, getStyleParams( props.options ) )

	const stylesToRender = (
		<>
			{ props.attributes.hasShape &&
				<>
					<BackgroundStyle.Content
						{ ...propsToPass }
						options={ {
							attrNameTemplate: 'shape%s',
							selector: '.stk-block-number-box__text',
						} }
					/>
					<BorderStyle.Content
						{ ...propsToPass }
						options={ {
							attrNameTemplate: 'shape%s',
							selector: '.stk-block-number-box__text',
						} }
					/>
				</>
			}
			<StyleComponent.Content
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>

			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<Typography.Style.Content { ...{
				...propsToPass,
				options: {
					...propsToPass.options,
					selector: '.stk-block-number-box__text',
				},
			} } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<MarginBottom.Style.Content { ...propsToPass } />
		</>
	)

	return renderToString( stylesToRender ) ? <style>{ stylesToRender }</style> : null
}

HeadingStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}
