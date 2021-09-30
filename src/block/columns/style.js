/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	EffectsAnimations,
	MarginBottom,
	Separator,
	Transform,
} from '~stackable/block-components'
import {
	useBlockAttributes, useDeviceType,
} from '~stackable/hooks'
import {
	getUniqueBlockClass,
	getStyles,
	useStyles,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'
import { renderToString } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const getStyleParams = () => {
	return [
		{
			renderIn: 'save',
			selector: '.%s-column',
			styleRule: 'columnGap',
			attrName: 'columnGap',
			format: '%spx',
		},
		{
			renderIn: 'edit',
			selector: '.%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout',
			styleRule: 'columnGap',
			attrName: 'columnGap',
			format: '%spx',
		},
		{
			renderIn: 'save',
			selector: '.%s-column',
			styleRule: 'justifyContent',
			attrName: 'columnFitAlign',
			responsive: 'all',
			enabledCallback: getAttribute => !! getAttribute( 'columnFit' ),
		},
		{
			renderIn: 'edit',
			selector: '.%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout',
			styleRule: 'justifyContent',
			attrName: 'columnFitAlign',
			responsive: 'all',
			enabledCallback: getAttribute => !! getAttribute( 'columnFit' ),
		},
	]
}

const BlockStyles = props => {
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
	propsToPass.options = {
		...propsToPass.options,
	}

	return (
		<>
			<Alignment.Style { ...propsToPass } />
			<BlockDiv.Style { ...propsToPass } />
			<MarginBottom.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Transform.Style { ...propsToPass } />
			<EffectsAnimations.Style { ...propsToPass } />
			<Separator.Style { ...propsToPass } />
			<StyleComponent
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)
}

BlockStyles.defaultProps = {
	isEditor: false,
}

BlockStyles.Content = props => {
	const {
		...propsToPass
	} = props

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	propsToPass.options = {
		...propsToPass.options,
	}

	const styles = getStyles( props.attributes, getStyleParams( props.options ) )

	const stylesToRender = (
		<>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<MarginBottom.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<Separator.Style.Content { ...propsToPass } />
			<StyleComponent.Content
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)

	return renderToString( stylesToRender ) ? <style>{ stylesToRender }</style> : null
}

BlockStyles.Content.defaultProps = {
	attributes: {},
}

export default BlockStyles
