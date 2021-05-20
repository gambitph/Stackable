/**
 * Internal dependencies
 */
import { blockStyles } from './variations'

/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv, Column, ContainerDiv, Image,
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

	const blockStyle = useMemo( () => getBlockStyle( blockStyles, attributes.className ), [ attributes.className ] )

	return (
		<Fragment>
			<Alignment.Style { ...propsToPass } />
			<BlockDiv.Style { ...propsToPass } />
			<Column.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<ContainerDiv.Style
				{ ...propsToPass }
				options={ {
					sizeSelector: '.stk-card__content',
					sizeVerticalAlignRule: 'justifyContent',
					sizeHorizontalAlignRule: 'alignSelf',
				} }
			/>
			<Image.Style
				{ ...propsToPass }
				options={ {
					enableWidth: blockStyle === 'horizontal',
					enableHeight: blockStyle !== 'horizontal',
					selector: '.stk-card__image',
				} }
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
	const blockStyle = getBlockStyle( blockStyles, props.attributes.className )

	const styles = (
		<Fragment>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Column.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<ContainerDiv.Style.Content
				{ ...propsToPass }
				options={ {
					sizeSelector: '.stk-card__content',
					sizeVerticalAlignRule: 'justifyContent',
					sizeHorizontalAlignRule: 'alignSelf',
				} }
			/>
			<Image.Style.Content
				{ ...propsToPass }
				options={ {
					enableWidth: blockStyle === 'horizontal',
					enableHeight: blockStyle !== 'horizontal',
					selector: '.stk-card__image',
				} }
			/>
		</Fragment>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

CardStyles.Content.defaultProps = {
	attributes: {},
}
