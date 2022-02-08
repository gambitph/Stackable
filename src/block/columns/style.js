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
	ContentAlign,
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
import { applyFilters } from '@wordpress/hooks'

const alignmentOptions = {
	editorSelectorCallback: getAttribute => `.stk--block-align-${ getAttribute( 'uniqueId' ) } > .block-editor-inner-blocks > .block-editor-block-list__layout`,
}

const BlockStyles = props => {
	const {
		...propsToPass
	} = props

	const deviceType = useDeviceType()
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	propsToPass.blockUniqueClassName = getUniqueBlockClass( attributes.uniqueId )
	propsToPass.deviceType = deviceType
	propsToPass.attributes = { ...attributes, clientId }
	propsToPass.options = {
		...propsToPass.options,
	}

	const columnStyleOptions = {
		numColumns: ( propsToPass.attributes.columnArrangementMobile || '' ).split( ',' ).length,
	}

	const columnsStyles = useStyles( attributes, applyFilters( 'stackable.block-component.columns.get-style-params', [], columnStyleOptions, '' ) )

	return (
		<>
			<Alignment.Style { ...propsToPass } options={ alignmentOptions } />
			<BlockDiv.Style { ...propsToPass } />
			<MarginBottom.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Transform.Style { ...propsToPass } />
			<EffectsAnimations.Style { ...propsToPass } />
			<Separator.Style { ...propsToPass } />
			<ContentAlign.Style { ...propsToPass } />
			<StyleComponent
				styles={ columnsStyles }
				versionAdded="3.1.0"
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

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	propsToPass.options = {
		...propsToPass.options,
	}

	const columnStyleOptions = {
		numColumns: ( props.attributes.columnArrangementMobile || '' ).split( ',' ).length,
	}

	const columnsStyles = getStyles( props.attributes, applyFilters( 'stackable.block-component.columns.get-style-params', [], columnStyleOptions, '' ) )

	const stylesToRender = (
		<>
			<Alignment.Style.Content { ...propsToPass } options={ alignmentOptions } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<MarginBottom.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<Separator.Style.Content { ...propsToPass } />
			<ContentAlign.Style.Content { ...propsToPass } />
			<StyleComponent.Content
				styles={ columnsStyles }
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
