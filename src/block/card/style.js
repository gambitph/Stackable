/** Internal dependencies
 */
import variations from './variations'

/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv, Column, ContainerDiv, EffectsAnimations, Image, Transform,
} from '~stackable/block-components'
import {
	useBlockAttributes, useDeviceType, getBlockStyle,
} from '~stackable/hooks'
import {
	getUniqueBlockClass,
} from '~stackable/util'
import {
	Fragment, renderToString, useMemo,
} from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const containerDivOptions = {
	sizeSelector: '.stk-block-card__content',
	sizeVerticalAlignRule: 'justifyContent',
	sizeHorizontalAlignRule: 'alignSelf',
}

export const CardStyles = props => {
	const {
		...propsToPass
	} = props

	const deviceType = useDeviceType()
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	propsToPass.blockUniqueClassName = getUniqueBlockClass( attributes.uniqueId )
	propsToPass.deviceType = deviceType
	propsToPass.attributes = { ...attributes, clientId }

	const blockStyle = useMemo( () => getBlockStyle( variations, attributes.className ), [ attributes.className ] )
	const imageOptions = useMemo( () => {
		return {
			enableWidth: blockStyle === 'horizontal',
			enableHeight: blockStyle !== 'horizontal',
			selector: '.stk-block-card__image',
		}
	}, [ blockStyle ] )

	return (
		<Fragment>
			<Alignment.Style { ...propsToPass } />
			<BlockDiv.Style { ...propsToPass } />
			<Column.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Transform.Style { ...propsToPass } />
			<EffectsAnimations.Style { ...propsToPass } />
			<ContainerDiv.Style
				{ ...propsToPass }
				options={ containerDivOptions }
			/>
			<Image.Style
				{ ...propsToPass }
				options={ imageOptions }
			/>
		</Fragment>
	)
}

CardStyles.defaultProps = {
	isEditor: false,
}

CardStyles.Content = props => {
	const {
		...propsToPass
	} = props

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	const blockStyle = getBlockStyle( variations, props.attributes.className )

	const styles = (
		<Fragment>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Column.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<ContainerDiv.Style.Content
				{ ...propsToPass }
				options={ {
					sizeSelector: '.stk-block-card__content',
					sizeVerticalAlignRule: 'justifyContent',
					sizeHorizontalAlignRule: 'alignSelf',
				} }
			/>
			<Image.Style.Content
				{ ...propsToPass }
				options={ {
					enableWidth: blockStyle.name === 'horizontal',
					enableHeight: blockStyle.name !== 'horizontal',
					selector: '.stk-block-card__image',
				} }
			/>
		</Fragment>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

CardStyles.Content.defaultProps = {
	attributes: {},
}
