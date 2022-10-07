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
import { getUniqueBlockClass } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { memo, renderToString } from '@wordpress/element'

const BlockStyles = memo( props => {
	return (
		<>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<ContainerDiv.Style { ...props } />
			<Column.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Separator.Style { ...props } />
			<ContentAlign.Style { ...props } />
		</>
	)
} )

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
		</>
	)

	return renderToString( stylesToRender ) ? <style>{ stylesToRender }</style> : null
}

BlockStyles.Content.defaultProps = {
	attributes: {},
}

export default BlockStyles
