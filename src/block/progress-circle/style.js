/**
 * External dependencies
 */
import {
	Alignment,
	Advanced,
	BlockDiv,
	EffectsAnimations,
	Transform,
	ProgressBar,
	Typography,
} from '~stackable/block-components'

import { getUniqueBlockClass } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { memo, renderToString } from '@wordpress/element'

const typographyOptions = {
	selector: '.stk-progress-circle__inner-text',
}

const ProgressCircleStyles = memo( props => {
	return (
		<>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<ProgressBar.Style { ...props } />
			<Typography.Style { ...props } { ...typographyOptions } />
		</>
	)
} )

ProgressCircleStyles.defaultProps = {
	isEditor: false,
}

ProgressCircleStyles.Content = props => {
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
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<ProgressBar.Style.Content { ...propsToPass } />
			<Typography.Style.Content { ...propsToPass } options={ typographyOptions } />
		</>
	)

	return renderToString( stylesToRender ) ? <style>{ stylesToRender }</style> : null
}

ProgressCircleStyles.Content.defaultProps = {
	attributes: {},
}

export default ProgressCircleStyles
