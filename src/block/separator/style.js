/**
 * External dependencies
 */
import {
	Advanced,
	BlockDiv,
	EffectsAnimations,
	Transform,
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
import { applyFilters } from '@wordpress/hooks'

const separatorOptions = {
	selector: '',
	enableFlipVertically: true,
	isInitiallyFlippedVertically: false,
	wrapperSelector: '.stk-block-separator__inner',
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
	const separatorLayerStyles = useStyles( attributes, applyFilters( 'stackable.block-component.separator.get-style-params', [], separatorOptions, '' ) )

	return (
		<>
			<BlockDiv.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<EffectsAnimations.Style { ...propsToPass } />
			<Transform.Style { ...propsToPass } />
			<StyleComponent
				styles={ separatorStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent
				styles={ separatorLayerStyles }
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

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )

	const separatorStyles = getStyles( props.attributes, separatorGetStyleParams( separatorOptions, '' ) )
	const separatorLayerStyles = getStyles( props.attributes, applyFilters( 'stackable.block-component.separator.get-style-params', [], separatorOptions, '' ) )

	const styles = (
		<>
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<StyleComponent.Content
				styles={ separatorStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent.Content
				styles={ separatorLayerStyles }
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
