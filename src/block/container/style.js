/**
 * Internal dependencies
 */
import { blockStyles } from './block-styles'

/**
 * External dependencies
 */
import {
	Image,
	BlockDiv,
	Alignment,
	Advanced,
	EffectsAnimations,
	ContainerDiv,
	MarginBottom,
} from '~stackable/block-components'
import {
	useDeviceType, useBlockAttributes, getBlockStyle,
} from '~stackable/hooks'
import {
	getUniqueBlockClass,
} from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	Fragment, renderToString, useMemo,
} from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const containerDivOptions = {
	sizeSelector: '.stk-container__content',
	sizeVerticalAlignRule: 'justifyContent',
	sizeHorizontalAlignRule: 'alignSelf',
}

export const ContainerStyles = props => {
	const {
		...propsToPass
	} = props

	const deviceType = useDeviceType()
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	propsToPass.blockUniqueClassName = getUniqueBlockClass( attributes.uniqueId )
	propsToPass.deviceType = deviceType
	propsToPass.attributes = { ...attributes, clientId }

	const blockStyle = useMemo( () => getBlockStyle( blockStyles, attributes.className ), [ attributes.className ] )

	const imageOptions = useMemo( () => ( {
		enableWidth: blockStyle !== 'image',
		enableHeight: blockStyle === 'image',
		selector: '.stk-container__image',
	} ), [ blockStyle ] )

	return (
		<Fragment>
			<Alignment.Style { ...propsToPass } />
			<BlockDiv.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<EffectsAnimations.Style { ...propsToPass } />
			<ContainerDiv.Style { ...propsToPass } options={ containerDivOptions } />
			<MarginBottom.Style { ...propsToPass } />
			<Image.Style { ...propsToPass } options={ imageOptions } />
		</Fragment>
	)
}

ContainerStyles.defaultProps = {
	isEditor: false,
}

ContainerStyles.Content = props => {
	const {
		...propsToPass
	} = props

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )

	const blockStyle = getBlockStyle( blockStyles, props.attributes.className )

	const imageOptions = {
		enableWidth: blockStyle !== 'image',
		enableHeight: blockStyle === 'image',
		selector: '.stk-container__image',
	}

	const styles = (
		<Fragment>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<ContainerDiv.Style.Content { ...propsToPass } options={ containerDivOptions } />
			<MarginBottom.Style.Content { ...propsToPass } />
			<Image.Style.Content { ...propsToPass } options={ imageOptions } />
		</Fragment>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

ContainerStyles.Content.defaultProps = {
	attributes: {},
}
