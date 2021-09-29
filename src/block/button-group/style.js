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
	useBlockAttributes, useDeviceType,
} from '~stackable/hooks'
import {
	getUniqueBlockClass, useStyles, getStyles,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { renderToString } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

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
			styleRule: 'flexDirection',
			attrObject: 'collapseOn',
			responsive: 'all',
			valuePreCallback: ( _, getAttribute, device ) => {
				return device === getAttribute( 'collapseOn' ) ? 'column' : undefined
			},
			dependencies: [ 'collapseOn' ],
		},
		{
			renderIn: 'edit',
			selector: '.stk-button-group .block-editor-block-list__layout',
			styleRule: 'flexDirection',
			attrObject: 'collapseOn',
			responsive: 'all',
			valuePreCallback: ( _, getAttribute, device ) => {
				return device === getAttribute( 'collapseOn' ) ? 'column' : undefined
			},
			dependencies: [ 'collapseOn' ],
		},
	]
}

export const ButtonGroupStyles = props => {
	const {
		...propsToPass
	} = props

	const deviceType = useDeviceType()
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	propsToPass.blockUniqueClassName = getUniqueBlockClass( attributes.uniqueId )
	propsToPass.deviceType = deviceType
	propsToPass.attributes = { ...attributes, clientId }

	const buttonGroupStyles = useStyles( attributes, getStyleParams() )

	return (
		<>
			<Alignment.Style { ...propsToPass } />
			<BlockDiv.Style { ...propsToPass } />
			<MarginBottom.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Transform.Style { ...propsToPass } />
			<EffectsAnimations.Style { ...propsToPass } />
			<FlexGapStyles { ...propsToPass } options={ flexGapOptionsEdit } />
			<StyleComponent
				styles={ buttonGroupStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)
}

ButtonGroupStyles.defaultProps = {
	isEditor: false,
}

ButtonGroupStyles.Content = props => {
	const {
		...propsToPass
	} = props

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

