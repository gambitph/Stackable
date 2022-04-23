/**
 * Internal dependencies
 */
import {
	Icon,
	Advanced,
	Alignment,
	BlockDiv,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import { withGeneratedCss } from '~stackable/higher-order'
import { useBlockAttributes, useDeviceType } from '~stackable/hooks'
import { getUniqueBlockClass } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { Fragment, renderToString } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const iconStyleOptions = {
	selector: '.stk--svg-wrapper',
	hoverSelector: '.stk--svg-wrapper:hover',
}

export const IconStyles = withGeneratedCss( props => {
	const {
		...propsToPass
	} = props

	const deviceType = useDeviceType()
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	propsToPass.blockUniqueClassName = getUniqueBlockClass( attributes.uniqueId )
	propsToPass.deviceType = deviceType
	propsToPass.attributes = { ...attributes, clientId }

	return (
		<Fragment>
			<Alignment.Style { ...propsToPass } />
			<BlockDiv.Style { ...propsToPass } options={ { selector: '.stk-block', hoverSelector: '.stk-block:hover' } } />
			<Advanced.Style { ...propsToPass } />
			<Transform.Style { ...propsToPass } />
			<EffectsAnimations.Style { ...propsToPass } />
			<Icon.Style { ...propsToPass } options={ iconStyleOptions } />
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
