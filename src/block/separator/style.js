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
	getUniqueBlockClass, useStyles, getStyles,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo, renderToString } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'

const separatorOptions = {
	selector: '',
	enableFlipVertically: true,
	isInitiallyFlippedVertically: false,
	wrapperSelector: '.stk-block-separator__inner',
}

export const SeparatorStyles = memo( props => {
	const separatorStyles = useStyles( separatorGetStyleParams( separatorOptions, '' ) )
	const separatorLayerStyles = useStyles( applyFilters( 'stackable.block-component.separator.get-style-params', [], separatorOptions, '' ) )

	return (
		<>
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Transform.Style { ...props } />
			<StyleComponent
				styles={ separatorStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...props }
			/>
			<StyleComponent
				styles={ separatorLayerStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...props }
			/>
		</>
	)
} )

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
