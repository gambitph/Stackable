/**
 * Internal dependencies
 */

/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	Column,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import {
	Style as StyleComponent,
} from '~stackable/components'
import {
	useBlockAttributes, useDeviceType,
} from '~stackable/hooks'
import {
	getUniqueBlockClass, useStyles, getStyles,
} from '~stackable/util'
import { renderToString } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const getStyleParams = () => {
	return [
		{
			renderIn: 'save',
			selector: '.stk-block-icon',
			attrName: 'iconGap',
			styleRule: 'flexBasis',
			format: '%spx',
			responsive: 'all',
		},
		{
			renderIn: 'edit',
			selector: '[data-block][data-type="stackable/icon"]',
			attrName: 'iconGap',
			styleRule: 'flexBasis',
			format: '%spx',
			responsive: 'all',
		},
	]
}

export const IconLabelStyles = props => {
	const {
		...propsToPass
	} = props

	const deviceType = useDeviceType()
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	propsToPass.blockUniqueClassName = getUniqueBlockClass( attributes.uniqueId )
	propsToPass.deviceType = deviceType
	propsToPass.attributes = { ...attributes, clientId }

	const styles = useStyles( attributes, getStyleParams() )

	return (
		<>
			<Alignment.Style { ...propsToPass } />
			<BlockDiv.Style { ...propsToPass } />
			<Column.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Transform.Style { ...propsToPass } />
			<EffectsAnimations.Style { ...propsToPass } />
			<StyleComponent
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)
}

IconLabelStyles.defaultProps = {
	isEditor: false,
}

IconLabelStyles.Content = props => {
	const {
		...propsToPass
	} = props

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	const styles = getStyles( propsToPass.attributes, getStyleParams() )

	const stylesToRender = (
		<>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Column.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
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

IconLabelStyles.Content.defaultProps = {
	attributes: {},
}
