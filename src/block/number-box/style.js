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
import { useDeviceType, useBlockAttributes } from '~stackable/hooks'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { renderToString } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const getStyleParams = () => {
	return [
		{
			selector: '.stk-block-number-box__text',
			styleRule: 'height',
			attrName: 'shapeSize',
			responsive: 'all',
			hasUnits: 'px',
			enabledCallback: getAttribute => getAttribute( 'hasShape' ),
		},
		{
			selector: '.stk-block-number-box__text',
			styleRule: 'width',
			attrName: 'shapeSize',
			responsive: 'all',
			hasUnits: 'px',
			enabledCallback: getAttribute => getAttribute( 'hasShape' ),
		},
	]
}

export const HeadingStyles = props => {
	const {
		...propsToPass
	} = props

	const deviceType = useDeviceType()
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	const styles = useStyles( attributes, getStyleParams( props.options || {} ) )

	propsToPass.blockUniqueClassName = getUniqueBlockClass( attributes.uniqueId )
	propsToPass.deviceType = deviceType
	propsToPass.attributes = { ...attributes, clientId }

	return (
		<>
			{ attributes.hasShape &&
				<>
					<BackgroundStyle
						{ ...propsToPass }
						options={ {
							attrNameTemplate: 'shape%s',
							selector: '.stk-block-number-box__text',
							backgroundFallbackColor: '#000000',
						} }
					/>
					<BorderStyle
						{ ...propsToPass }
						options={ {
							attrNameTemplate: 'shape%s',
							selector: '.stk-block-number-box__text',
						} }
					/>
				</>
			}
			<StyleComponent
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>

			<Alignment.Style { ...propsToPass } />
			<BlockDiv.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Transform.Style { ...propsToPass } />
			<Typography.Style { ...{
				...propsToPass,
				options: {
					...propsToPass.options,
					selector: '.stk-block-number-box__text',
				},
			} } />
			<EffectsAnimations.Style { ...propsToPass } />
		</>
	)
}

HeadingStyles.defaultProps = {
	isEditor: false,
	attributes: {},
	options: {},
}

HeadingStyles.Content = props => {
	const {
		...propsToPass
	} = props

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
