/**
 * External dependencies
 */
import {
	Icon,
	Advanced,
	Alignment,
	BlockDiv,
	EffectsAnimations,
} from '~stackable/block-components'
import {
	useBlockAttributes, useDeviceType,
} from '~stackable/hooks'
import {
	getUniqueBlockClass,
} from '~stackable/util'
import {
	Fragment, renderToString,
} from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const iconStyleOptions = {
	selector: '.stk--svg-wrapper',
	hoverSelector: ':hover .stk--svg-wrapper',
}

const alignmentOptions = {
	selector: '.stk--svg-wrapper',
	hasJustifyContentAlign: true,
}

export const IconStyles = props => {
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
			<Alignment.Style { ...propsToPass } options={ alignmentOptions } />
			<BlockDiv.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<EffectsAnimations.Style { ...propsToPass } />
			<Icon.Style { ...propsToPass } options={ iconStyleOptions } />
		</Fragment>
	)
}

IconStyles.defaultProps = {
	isEditor: false,
}

IconStyles.Content = props => {
	const {
		...propsToPass
	} = props

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )

	const styles = (
		<Fragment>
			<Alignment.Style.Content { ...propsToPass } options={ alignmentOptions } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<Icon.Style.Content { ...propsToPass } options={ iconStyleOptions } />
		</Fragment>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}
