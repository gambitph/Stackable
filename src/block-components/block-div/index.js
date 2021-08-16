import { addAttributes } from './attributes'
import { useUniqueId } from './use-unique-id'
import { Style } from './style'
import { Edit } from './edit'

import classnames from 'classnames'
import { Div } from '~stackable/components'
import { useBlockAttributes } from '~stackable/hooks'
import { getUniqueBlockClass } from '~stackable/util'

import { useBlockEditContext } from '@wordpress/block-editor'
import { applyFilters } from '@wordpress/hooks'
import { getHtmlTag } from '../advanced/use-html-tag'
import { CustomAttributes } from '../custom-attributes'

export const BlockDiv = props => {
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	useUniqueId()

	// The HTML Tag selected of the block in the Advanced tab.
	const htmlTag = getHtmlTag( attributes )
	const customAttributes = props.applyCustomAttributes ? CustomAttributes.getCustomAttributes( attributes ) : {}

	const classNames = classnames( [
		props.className,
		'stk-block',
		getUniqueBlockClass( attributes.uniqueId ),
	],
	applyFilters( 'stackable.block-components.block-div.classnames', [], attributes ),
	{
		'stk-block-background': attributes.hasBackground,
	} )

	return <Div
		{ ...props }
		{ ...customAttributes }
		className={ classNames }
		id={ props.applyAdvancedAttributes && ( attributes.anchor || undefined ) }
		data-block-id={ attributes.uniqueId }
		blockTag={ htmlTag }
		hasBackground={ attributes.hasBackground }
		backgroundUrl={ attributes.blockBackgroundMediaUrl }
		backgroundUrlTablet={ attributes.blockBackgroundMediaUrlTablet }
		backgroundUrlMobile={ attributes.blockBackgroundMediaUrlMobile }
		backgroundColorType={ attributes.blockBackgroundColorType }
		{ ...applyFilters( 'stackable.block-components.block-div.attributes', {}, attributes ) }
	/>
}

BlockDiv.defaultProps = {
	className: '',
	applyCustomAttributes: true,
	applyAdvancedAttributes: true,
}

BlockDiv.Content = props => {
	const {
		attributes,
		...propsToPass
	} = props

	// The HTML Tag selected of the block in the Advanced tab.
	const htmlTag = getHtmlTag( attributes )
	const customAttributes = props.applyCustomAttributes ? CustomAttributes.getCustomAttributes( attributes ) : {}

	const classNames = classnames( [
		props.className,
		'stk-block',
		getUniqueBlockClass( attributes.uniqueId ),
	],
	applyFilters( 'stackable.block-components.block-div.classnames.content', [], attributes ),
	{
		'stk-block-background': attributes.hasBackground,
	} )

	return <Div.Content
		{ ...propsToPass }
		{ ...customAttributes }
		className={ classNames }
		id={ props.applyAdvancedAttributes && ( attributes.anchor || undefined ) }
		data-block-id={ attributes.uniqueId }
		blockTag={ htmlTag }
		hasBackground={ attributes.hasBackground }
		backgroundUrl={ attributes.blockBackgroundMediaUrl }
		backgroundUrlTablet={ attributes.blockBackgroundMediaUrlTablet }
		backgroundUrlMobile={ attributes.blockBackgroundMediaUrlMobile }
		backgroundColorType={ attributes.blockBackgroundColorType }
		{ ...applyFilters( 'stackable.block-components.block-div.attributes.content', {}, attributes ) }
	/>
}

BlockDiv.Content.defaultProps = {
	className: '',
	attributes: {},
	applyCustomAttributes: true,
	applyAdvancedAttributes: true,
}

BlockDiv.InspectorControls = Edit

BlockDiv.addAttributes = addAttributes

BlockDiv.Style = Style
