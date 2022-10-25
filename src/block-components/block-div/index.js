import { addAttributes } from './attributes'
import { createUniqueClass, useUniqueId } from './use-unique-id'
import { Style } from './style'
import { Edit } from './edit'

import classnames from 'classnames'
import { Div } from '~stackable/components'
import { useVariationPicker } from '~stackable/hooks'
import { getUniqueBlockClass, useQueryLoopInstanceId } from '~stackable/util'

import { useBlockProps } from '@wordpress/block-editor'
import { applyFilters } from '@wordpress/hooks'
import { getHtmlTag } from '../advanced/use-html-tag'
import { CustomAttributes } from '../custom-attributes'

export { useUniqueId }

export const BlockDiv = props => {
	const {
		className,
		applyCustomAttributes,
		applyAdvancedAttributes,
		renderHtmlTag,
		enableVariationPicker,
		withUniqueClass,
		blockHoverClass,
		clientId,
		attributes,
		...propsToPass
	} = props

	useUniqueId( attributes, ! enableVariationPicker )

	// If there's no uniqueId yet, generate one so at least we can have styles
	// applied to the block correctly.
	const tempUniqueId = createUniqueClass( clientId )
	const instanceId = useQueryLoopInstanceId( attributes.uniqueId || tempUniqueId )
	let uniqueBlockClass = getUniqueBlockClass( attributes.uniqueId || tempUniqueId )
	uniqueBlockClass = instanceId ? uniqueBlockClass + `-${ instanceId }` : uniqueBlockClass

	// Variation picker will show up if there's no uniqueId yet (which will be
	// the case when enableVariationPicker = true)
	const variationPicker = useVariationPicker( clientId, attributes.uniqueId )
	if ( variationPicker && enableVariationPicker ) {
		return variationPicker
	}

	// The HTML Tag selected of the block in the Advanced tab.
	const htmlTag = getHtmlTag( attributes )
	const customAttributes = applyCustomAttributes ? CustomAttributes.getCustomAttributes( attributes ) : {}
	const classNames = classnames( [
		className,
		'stk-block',
		blockHoverClass,
		attributes.className, // Custom CSS classes.
		{
			[ uniqueBlockClass ]: withUniqueClass,
		},
	],
	applyFilters( 'stackable.block-components.block-div.classnames', [], attributes ),
	{
		'stk-block-background': attributes.hasBackground,
	} )

	return <Div
		{ ...propsToPass }
		{ ...customAttributes }
		className={ classNames }
		id={ ( applyAdvancedAttributes && ( attributes.anchor || undefined ) ) || undefined }
		data-block-id={ attributes.uniqueId || tempUniqueId }
		blockTag={ renderHtmlTag ? htmlTag : 'div' }
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
	renderHtmlTag: true, // If true, this renders the HTML Tag based from the block attributes.
	enableVariationPicker: false,
	withUniqueClass: true,
	blockHoverClass: '',
}

BlockDiv.Content = props => {
	const {
		className,
		attributes,
		applyCustomAttributes,
		applyAdvancedAttributes,
		...propsToPass
	} = props

	// The HTML Tag selected of the block in the Advanced tab.
	const htmlTag = getHtmlTag( attributes )
	const customAttributes = applyCustomAttributes ? CustomAttributes.getCustomAttributes( attributes ) : {}

	const classNames = classnames( [
		className,
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
		{ ...useBlockProps.save( { className: classNames } ) }
		id={ ( applyAdvancedAttributes && ( attributes.anchor || undefined ) ) || undefined }
		data-block-id={ attributes.uniqueId || undefined }
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
