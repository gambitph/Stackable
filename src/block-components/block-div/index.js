import './deprecated'
import { addAttributes } from './attributes'
import { createUniqueClass, useUniqueId } from './use-unique-id'
import { addStyles } from './style'
import { Edit } from './edit'
import { firefoxHasPolyfill } from './firefox-has-polyfill'

import classnames from 'classnames/dedupe'
import { Div } from '~stackable/components'
import { useVariationPicker } from '~stackable/hooks'
import { getUniqueBlockClass, useQueryLoopInstanceId } from '~stackable/util'
import { memo } from '@wordpress/element'

import { useBlockProps } from '@wordpress/block-editor'
import { applyFilters } from '@wordpress/hooks'
import { getHtmlTag } from '../advanced/use-html-tag'
import { CustomAttributes } from '../custom-attributes'
import { version as VERSION } from 'stackable'

export { useUniqueId }
export { deprecateBlockBackgroundColorOpacity, deprecateBlockShadowColor } from './deprecated'

export const BlockDiv = memo( props => {
	const {
		className,
		applyCustomAttributes,
		renderHtmlTag,
		enableVariationPicker,
		withUniqueClass,
		blockHoverClass,
		clientId,
		attributes,
		blockTag,
		version: _version,
		...propsToPass
	} = props

	useUniqueId( attributes, ! enableVariationPicker )

	// If there's no uniqueId yet, generate one so at least we can have styles
	// applied to the block correctly.
	const tempUniqueId = createUniqueClass( clientId )
	const instanceId = useQueryLoopInstanceId( attributes.uniqueId || tempUniqueId )
	let uniqueBlockClass = getUniqueBlockClass( attributes.uniqueId || tempUniqueId )
	uniqueBlockClass = instanceId ? uniqueBlockClass + `-${ instanceId }` : uniqueBlockClass
	uniqueBlockClass = applyFilters( 'stackable.block-div.uniqueClass.edit', uniqueBlockClass )

	// The HTML Tag selected of the block in the Advanced tab.
	const htmlTag = getHtmlTag( attributes )
	const customAttributes = applyCustomAttributes ? CustomAttributes.getCustomAttributes( attributes ) : {}
	const classNames = classnames( applyFilters( 'stackable.block-components.block-div.classnames',
		[
			className,
			'stk-block',
			blockHoverClass,
			attributes.className, // Custom CSS classes.
			{
				[ uniqueBlockClass ]: withUniqueClass,
				'stk-block-background': attributes.hasBackground,
				// When the block has auto margins, we need to "add" those margins to
				// the main block div so we can simulate the effect inside the editor.
				// This works in conjunction with the styles in
				// block-components/alignment/editor.scss
				'stk--block-margin-top-auto': attributes.blockMargin?.top === 'auto',
				'stk--block-margin-right-auto': attributes.blockMargin?.right === 'auto',
				'stk--block-margin-bottom-auto': attributes.blockMargin?.bottom === 'auto',
				'stk--block-margin-left-auto': attributes.blockMargin?.left === 'auto',
			},
		],
		props
	) )

	// Variation picker will show up if there's no uniqueId yet (which will be
	// the case when enableVariationPicker = true)
	const variationPicker = useVariationPicker( clientId, attributes.uniqueId )
	if ( variationPicker && enableVariationPicker ) {
		return variationPicker
	}

	return <Div
		{ ...propsToPass }
		{ ...customAttributes }
		className={ classNames }
		id={ attributes.anchor || undefined }
		data-block-id={ attributes.uniqueId || tempUniqueId }
		blockTag={ renderHtmlTag ? htmlTag : blockTag }
		hasBackground={ attributes.hasBackground }
		backgroundUrl={ attributes.blockBackgroundMediaUrl || attributes.blockBackgroundMediaExternalUrl }
		backgroundUrlTablet={ attributes.blockBackgroundMediaUrlTablet || attributes.blockBackgroundMediaExternalUrlTablet }
		backgroundUrlMobile={ attributes.blockBackgroundMediaUrlMobile || attributes.blockBackgroundMediaExternalUrlMobile }
		backgroundThumbnailUrl={ attributes.blockBackgroundMediaThumbnailUrl }
		backgroundThumbnailUrlTablet={ attributes.blockBackgroundMediaThumbnailUrlTablet }
		backgroundThumbnailUrlMobile={ attributes.blockBackgroundMediaThumbnailUrlMobile }
		backgroundColorType={ attributes.blockBackgroundColorType }
		{ ...applyFilters( 'stackable.block-components.block-div.attributes', {}, attributes ) }
	>
		{ props.children }
		{ firefoxHasPolyfill( clientId, attributes ) }
	</Div>
} )

BlockDiv.defaultProps = {
	className: '',
	applyCustomAttributes: true,
	renderHtmlTag: true, // If true, this renders the HTML Tag based from the block attributes.
	enableVariationPicker: false,
	withUniqueClass: true,
	blockHoverClass: '',
	blockTag: 'div',
}

BlockDiv.Content = props => {
	const {
		className,
		attributes,
		applyCustomAttributes,
		blockTag,
		version: _version,
		...propsToPass
	} = props

	// The HTML Tag selected of the block in the Advanced tab.
	const htmlTag = getHtmlTag( attributes )
	const customAttributes = applyCustomAttributes ? CustomAttributes.getCustomAttributes( attributes ) : {}
	let uniqueBlockClass = getUniqueBlockClass( attributes.uniqueId )
	uniqueBlockClass = applyFilters( 'stackable.block-div.uniqueClass.save', uniqueBlockClass, attributes )

	const classNames = classnames( applyFilters( 'stackable.block-components.block-div.classnames.content',
		[
			className,
			'stk-block',
			uniqueBlockClass,
			{
				'stk-block-background': attributes.hasBackground,
				// When the block has auto top/bottom margins, we need to force the
				// parent container to be 100% height or else the auto won't have any
				// effect in the frontend. This is okay in the editor-side.
				'stk--block-margin-top-auto': attributes.blockMargin?.top === 'auto',
				'stk--block-margin-bottom-auto': attributes.blockMargin?.bottom === 'auto',
				// Advanced > Link > Has Lightbox support.
				'stk--has-lightbox': attributes.blockLinkHasLightbox || attributes.linkHasLightbox,
			},
		],
		props
	) )

	return <Div.Content
		{ ...propsToPass }
		{ ...customAttributes }
		{ ...useBlockProps.save( { className: classNames } ) }
		id={ attributes.anchor || undefined }
		data-block-id={ attributes.uniqueId || undefined }
		blockTag={ blockTag || htmlTag }
		hasBackground={ attributes.hasBackground }
		backgroundUrl={ attributes.blockBackgroundMediaUrl || attributes.blockBackgroundMediaExternalUrl }
		backgroundUrlTablet={ attributes.blockBackgroundMediaUrlTablet || attributes.blockBackgroundMediaExternalUrlTablet }
		backgroundUrlMobile={ attributes.blockBackgroundMediaUrlMobile || attributes.blockBackgroundMediaExternalUrlMobile }
		backgroundThumbnailUrl={ attributes.blockBackgroundMediaThumbnailUrl }
		backgroundThumbnailUrlTablet={ attributes.blockBackgroundMediaThumbnailUrlTablet }
		backgroundThumbnailUrlMobile={ attributes.blockBackgroundMediaThumbnailUrlMobile }
		backgroundColorType={ attributes.blockBackgroundColorType }
		{ ...applyFilters( 'stackable.block-components.block-div.attributes.content', {}, attributes ) }
	/>
}

BlockDiv.Content.defaultProps = {
	version: VERSION,
	className: '',
	attributes: {},
	applyCustomAttributes: true,
	blockTag: '',
}

BlockDiv.InspectorControls = Edit

BlockDiv.addAttributes = addAttributes

BlockDiv.addStyles = addStyles
