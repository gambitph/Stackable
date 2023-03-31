/**
 * External dependencies
 */
import {
	BlockDiv,
	Alignment,
	Advanced,
	EffectsAnimations,
	ContainerDiv,
	MarginBottom,
	Transform,
	ContentAlign,
} from '~stackable/block-components'
import { BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const containerDivOptions = {
	sizeSelector: '.stk-block-team-member__content',
	sizeHorizontalAlignRule: 'margin',
}

export const TeamMemberStyles = memo( props => {
	return (
		<>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<ContainerDiv.Style { ...props } { ...containerDivOptions } />
			<MarginBottom.Style { ...props } />
			<ContentAlign.Style { ...props } />
		</>
	)
} )

TeamMemberStyles.defaultProps = {
	version: '',
}

TeamMemberStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			<Alignment.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<ContainerDiv.Style.Content { ...props } { ...containerDivOptions } />
			<MarginBottom.Style.Content { ...props } />
			<ContentAlign.Style.Content { ...props } />
		</BlockCssCompiler>
	)
}

TeamMemberStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}
