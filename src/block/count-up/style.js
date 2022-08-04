/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
	Typography,
	Alignment,
	MarginBottom,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import { getUniqueBlockClass } from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	memo, Fragment, renderToString,
} from '@wordpress/element'

export const HeadingStyles = memo( props => {
	return (
		<Fragment>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Typography.Style
				{ ...props }
				selector=".stk-block-count-up__text"
			/>
			<EffectsAnimations.Style { ...props } />
		</Fragment>
	)
} )

HeadingStyles.defaultProps = {
	isEditor: false,
	attributes: {},
	options: {},
}

HeadingStyles.Content = props => {
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
			<Typography.Style.Content { ...{
				...propsToPass,
				options: {
					...propsToPass.options,
					selector: '.stk-block-count-up__text',
				},
			} } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<MarginBottom.Style.Content { ...propsToPass } />
		</Fragment>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

HeadingStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}
