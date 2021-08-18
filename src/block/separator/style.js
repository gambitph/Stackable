/**
 * External dependencies
 */
import {
	Advanced,
	BlockDiv,
	EffectsAnimations,
	separatorGetStyleParams,
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
import {
	renderToString,
} from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const separatorOptions = {
	selector: '',
	enableFlipVertically: true,
}

export const SeparatorStyles = props => {
	const {
		...propsToPass
	} = props

	const deviceType = useDeviceType()
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	propsToPass.blockUniqueClassName = getUniqueBlockClass( attributes.uniqueId )
	propsToPass.deviceType = deviceType
	propsToPass.attributes = { ...attributes, clientId }

	const separatorStyles = useStyles( attributes, separatorGetStyleParams( separatorOptions, '' ) )

	return (
		<>
			<BlockDiv.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<EffectsAnimations.Style { ...propsToPass } />
			<StyleComponent
				styles={ separatorStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)
}

SeparatorStyles.defaultProps = {
	isEditor: false,
}

SeparatorStyles.Content = props => {
	const {
		...propsToPass
	} = props

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )

	const separatorStyles = getStyles( props.attributes, separatorGetStyleParams( separatorOptions, '' ) )

	const styles = (
		<>
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<StyleComponent.Content
				styles={ separatorStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

SeparatorStyles.Content.defaultProps = {
	attributes: {},
}
