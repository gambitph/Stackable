/**
 * External dependencies
 */
import {
	Icon,
	Advanced,
	Alignment,
	BlockDiv,
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

const iconStyleOptions = {
	selector: '.stk--svg-wrapper',
	hoverSelector: '.stk--svg-wrapper:hover',
}

export const IconStyles = memo( props => {
	return (
		<Fragment>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Icon.Style { ...props } { ...iconStyleOptions } />
		</Fragment>
	)
} )

IconStyles.defaultProps = {
	isEditor: false,
}

IconStyles.Content = props => {
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
			<Icon.Style.Content { ...propsToPass } options={ iconStyleOptions } />
		</Fragment>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}
