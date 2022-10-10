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
import { getUniqueBlockClass } from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	memo, Fragment, renderToString,
} from '@wordpress/element'

const containerDivOptions = {
	sizeSelector: '.stk-block-team-member__content',
	sizeHorizontalAlignRule: 'margin',
}

export const TeamMemberStyles = memo( props => {
	return (
		<Fragment>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<ContainerDiv.Style { ...props } { ...containerDivOptions } />
			<MarginBottom.Style { ...props } />
			<ContentAlign.Style { ...props } />
		</Fragment>
	)
} )

TeamMemberStyles.defaultProps = {
	isEditor: false,
}

TeamMemberStyles.Content = props => {
	const {
		...propsToPass
	} = props

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )

	const styles = (
		<Fragment>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<ContainerDiv.Style.Content { ...propsToPass } options={ containerDivOptions } />
			<MarginBottom.Style.Content { ...propsToPass } />
			<ContentAlign.Style.Content { ...propsToPass } />
		</Fragment>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

TeamMemberStyles.Content.defaultProps = {
	attributes: {},
}
