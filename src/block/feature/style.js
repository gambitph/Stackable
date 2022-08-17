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
	Separator,
	Transform,
	ContainerDiv,
	ContentAlign,
} from '~stackable/block-components'
import { useBlockAttributes, useDeviceType } from '~stackable/hooks'
import {
	getUniqueBlockClass, useStyles, getStyles,
} from '~stackable/util'
import { renderToString } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

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

	const columnStyleOptions = {
		numColumns: ( propsToPass.attributes.columnArrangementMobile || '' ).split( ',' ).length,
	}

	const columnsStyles = useStyles( attributes, applyFilters( 'stackable.block-component.columns.get-style-params', [], columnStyleOptions, '' ) )

	return (
		<>
			<Alignment.Style { ...propsToPass } />
			<BlockDiv.Style { ...propsToPass } />
			<ContainerDiv.Style { ...propsToPass } />
			<Column.Style { ...propsToPass } />
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

	const columnStyleOptions = {
		numColumns: ( props.attributes.columnArrangementMobile || '' ).split( ',' ).length,
	}

	const columnsStyles = getStyles( props.attributes, applyFilters( 'stackable.block-component.columns.get-style-params', [], columnStyleOptions, '' ) )

	const stylesToRender = (
		<>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<ContainerDiv.Style.Content { ...propsToPass } />
			<Column.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
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
