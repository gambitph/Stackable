/**
 * External dependencies
 */
import {
	Advanced,
	BlockDiv,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import {
	getUniqueBlockClass, useStyles, getStyles,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo, renderToString } from '@wordpress/element'

const getStyleParams = () => {
	return [
		{
			renderIn: 'edit',
			selector: '.stk-block-map__canvas',
			styleRule: 'height',
			attrName: 'height',
			format: '%spx',
			responsive: 'all',
		},
		{
			renderIn: 'save',
			selector: '.stk-block-map__canvas, iframe',
			styleRule: 'height',
			attrName: 'height',
			format: '%spx',
			responsive: 'all',
		},
	]
}

const BlockStyles = memo( props => {
	const mapStyles = useStyles( getStyleParams() )

	return (
		<>
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<StyleComponent
				styles={ mapStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...props }
			/>
		</>
	)
} )

BlockStyles.defaultProps = {
	isEditor: false,
	attributes: {},
	options: {},
}

BlockStyles.Content = props => {
	const {
		...propsToPass
	} = props

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	propsToPass.blockUniqueClassName = getUniqueBlockClass( propsToPass.attributes.uniqueId )
	const mapStyles = getStyles( propsToPass.attributes, getStyleParams() )

	const styles = (
		<>
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<StyleComponent.Content
				styles={ mapStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

export default BlockStyles
