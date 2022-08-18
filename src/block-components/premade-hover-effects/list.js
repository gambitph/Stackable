import { i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
import { dispatch } from '@wordpress/data'

const innerBlockColors = [
	{
		hoverEffect: [ 'background-color', 'background-color-shadow' ],
		attributes: {
			textColor1ParentHover: '#ffffff',
			iconColor1ParentHover: '#ffffff',
		},
	},
	{
		hoverEffect: [ 'inner-blocks-color' ],
		attributes: {
			textColor1ParentHover: '#008de4',
			iconColor1ParentHover: '#008de4',
		},
	},
	{
		hoverEffect: [ 'none' ],
		attributes: {
			textColor1ParentHover: '',
			iconColor1ParentHover: '',
		},
	},
]

// TODO: fix impplmentation of how to apply attributes to child blocks. Can be more readable and simple.
const updateInnerBlocks = ( innerBlocks, remove = false, value ) => {
	const { updateBlockAttributes, __unstableMarkNextChangeAsNotPersistent } = dispatch( 'core/block-editor' )
	const innerBlockAttr = innerBlockColors.find( ( { hoverEffect: hoverEffect } ) => hoverEffect.includes( value ) )
	innerBlocks.forEach( childBlock => {
		__unstableMarkNextChangeAsNotPersistent()
		if ( childBlock.innerBlocks.length > 0 ) {
			return updateInnerBlocks( childBlock.innerBlocks, remove, value )
		}
		if ( childBlock.name === 'stackable/button' ) {
			if ( value.includes( 'background-color' ) || value === 'none' ) {
				updateBlockAttributes( childBlock.clientId, ! remove ? {
					textColor1ParentHover: '#008de4',
					buttonBackgroundColorParentHover: '#ffffff',
				} : {
					textColor1ParentHover: '',
					buttonBackgroundColorParentHover: '',
				} )
			}
			if ( value === 'inner-blocks-color' || value === 'none' ) {
				updateBlockAttributes( childBlock.clientId, ! remove ? {
					buttonBorderType: 'solid',
					textColor1ParentHover: '#008de4',
					buttonBackgroundColorParentHover: '#ffffff',
					buttonBorderColorParentHover: '#008de4',
					buttonBorderWidthParentHover: {
						top: 3,
						right: 3,
						bottom: 3,
						left: 3,
					},
					buttonBorderWidth: {
						top: 0,
						right: 0,
						bottom: 0,
						left: 0,
					},
				} : {
					buttonBorderType: '',
					textColor1ParentHover: '',
					buttonBackgroundColorParentHover: '',
					buttonBorderParentColorHover: '',
					buttonBorderWidthParentHover: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
					buttonBorderWidth: {
						top: '',
						right: '',
						bottom: '',
						left: '',
					},
				} )
			}
		} else {
			updateBlockAttributes( childBlock.clientId, innerBlockAttr.attributes )
		}
	} )
}

export const EFFECTS = [
	{
		effectsType: 'container',
		effects: [
			{
				value: 'shadow',
				label: __( 'Shadow', i18n ),
				attributes: {
					hasContainer: true,
					containerShadow: 'none',
					containerShadowHover: '0 5px 30px -10px rgba(18, 63, 82, 0.3)',
				},
				isPremium: false,
			},
			{
				value: 'background-color',
				label: __( 'Background Color', i18n ),
				attributes: {
					containerBackgroundColorHover: '#008de4',
					hasContainer: true,
				},
				onApplyEffect: innerBlocks => {
					const { updateBlockAttributes, __unstableMarkNextChangeAsNotPersistent } = dispatch( 'core/block-editor' )
					innerBlocks.forEach( childBlock => {
						__unstableMarkNextChangeAsNotPersistent()
						if ( childBlock.innerBlocks.length > 0 ) {
							updateInnerBlocks( childBlock.innerBlocks, undefined, 'background-color' )
						}
						updateBlockAttributes( childBlock.clientId, { textColor1ParentHover: '#ffffff', iconColor1ParentHover: '#ffffff' } )
					} )
				},
				removeEffect: innerBlocks => {
					const { updateBlockAttributes, __unstableMarkNextChangeAsNotPersistent } = dispatch( 'core/block-editor' )
					innerBlocks.forEach( childBlock => {
						__unstableMarkNextChangeAsNotPersistent()
						if ( childBlock.innerBlocks.length > 0 ) {
							updateInnerBlocks( childBlock.innerBlocks, true, 'none' )
						}
						updateBlockAttributes( childBlock.clientId, { textColor1ParentHover: '', iconColor1ParentHover: '' } )
					} )
				},
				isPremium: false,
			},
			{
				value: 'background-color-shadow',
				label: __( 'Background Color and Shadow', i18n ),
				attributes: {
					containerBackgroundColorHover: '#008de4',
					containerShadow: 'none',
					containerShadowHover: '0 5px 30px -10px rgba(18, 63, 82, 0.3)',
					hasContainer: true,
				},
				onApplyEffect: innerBlocks => {
					const { updateBlockAttributes, __unstableMarkNextChangeAsNotPersistent } = dispatch( 'core/block-editor' )
					innerBlocks.forEach( childBlock => {
						__unstableMarkNextChangeAsNotPersistent()
						if ( childBlock.innerBlocks.length > 0 ) {
							updateInnerBlocks( childBlock.innerBlocks, undefined, 'background-color-shadow' )
						}
						updateBlockAttributes( childBlock.clientId, { textColor1ParentHover: '#ffffff', iconColor1ParentHover: '#ffffff' } )
					} )
				},
				removeEffect: innerBlocks => {
					const { updateBlockAttributes, __unstableMarkNextChangeAsNotPersistent } = dispatch( 'core/block-editor' )
					innerBlocks.forEach( childBlock => {
						__unstableMarkNextChangeAsNotPersistent()
						if ( childBlock.innerBlocks.length > 0 ) {
							updateInnerBlocks( childBlock.innerBlocks, true, 'none' )
						}
						updateBlockAttributes( childBlock.clientId, { textColor1ParentHover: '', iconColor1ParentHover: '' } )
					} )
				},
				isPremium: false,
			},
			{
				value: 'inner-blocks-color',
				label: __( 'Inner Blocks Color', i18n ),
				attributes: {
					hasContainer: true,
				},
				onApplyEffect: innerBlocks => {
					const { updateBlockAttributes, __unstableMarkNextChangeAsNotPersistent } = dispatch( 'core/block-editor' )
					innerBlocks.forEach( childBlock => {
						__unstableMarkNextChangeAsNotPersistent()
						if ( childBlock.innerBlocks.length > 0 ) {
							updateInnerBlocks( childBlock.innerBlocks, false, 'inner-blocks-color' )
						}
						updateBlockAttributes( childBlock.clientId, { textColor1ParentHover: '#008de4', iconColor1ParentHover: '#008de4' } )
					} )
				},
				removeEffect: innerBlocks => {
					const { updateBlockAttributes, __unstableMarkNextChangeAsNotPersistent } = dispatch( 'core/block-editor' )
					innerBlocks.forEach( childBlock => {
						__unstableMarkNextChangeAsNotPersistent()
						if ( childBlock.innerBlocks.length > 0 ) {
							updateInnerBlocks( childBlock.innerBlocks, true, 'none' )
						}
						updateBlockAttributes( childBlock.clientId, { textColor1ParentHover: '', iconColor1ParentHover: '' } )
					} )
				},
				isPremium: false,
			},
			{
				value: 'border',
				label: __( 'Border', i18n ),
				attributes: {
					hasContainer: true,
					containerBorderType: 'solid',
					containerBorderColorHover: 'var(--stk-global-color-20226, #008de4)',
					containerBorderWidthHover: {
						top: 3,
						right: 3,
						bottom: 3,
						left: 3,
					},
					containerBorderWidth: {
						top: 0,
						right: 0,
						bottom: 0,
						left: 0,
					},
				},
				isPremium: false,
			},
		],
	},
	{
		effectsType: 'image',
		effects: [
			{
				value: 'image-zoom',
				label: __( 'Image Zoom', i18n ),
				attributes: {
					imageZoomHover: '1.25',
				},
			},
			{
				value: 'image-greyscale',
				label: __( 'Greyscale Image', i18n ),
				attributes: {
					imageFilter: 'grayscale(1)',
					imageFilterHover: 'grayscale(0)',
				},
			},
		],
	},
	{
		effectsType: 'button',
		effects: [
			{
				value: 'basic-shadow',
				label: __( 'Basic Shadow', i18n ),
				attributes: {
					buttonShadowHover: '0 5px 30px -10px rgba(18, 63, 82, 0.3)',
				},
			},
			{
				value: 'solid-shadow',
				label: __( 'Solid Shadow', i18n ),
				attributes: {
					buttonShadowHover: '6px 6px 0px 0px rgba(var(--stk-global-color-56986-rgba, 17, 17, 17), 1)',
				},
			},
			{
				value: 'color-hover',
				label: __( 'Color on Hover', i18n ),
				attributes: {
					buttonBackgroundColor: 'transparent',
					buttonBorderType: 'solid',
					buttonBackgroundColorHover: 'var(--stk-global-color-20226, #008de4)',
					buttonBackgroundColorParentHover: 'transparent',
					textColor1Hover: 'var(--stk-global-color-58834, #ffffff)',
				},
			},
			{
				value: 'opacity',
				label: __( 'Opacity', i18n ),
				attributes: {
					opacityHover: '0.8',
				},
			},
		],
	},
	{ //Created a separate object for posts since it has different attributes.
		effectsType: 'posts',
		effects: [
			{
				value: 'shadow',
				label: __( 'Shadow', i18n ),
				attributes: {
					hasContainer: true,
					containerShadow: 'none',
					containerShadowHover: '0 5px 30px -10px rgba(18, 63, 82, 0.3)',
				},
				isPremium: false,
			},
			{
				value: 'background-color',
				label: __( 'Background Color', i18n ),
				attributes: {
					hasContainer: true,
					containerBackgroundColorHover: '#008de4',
					titleHoverStateInContainer: true,
					categoryHoverStateInContainer: true,
					excerptHoverStateInContainer: true,
					metaHoverStateInContainer: true,
					readmoreHoverStateInContainer: true,
					titleTextColor1Hover: '#ffffff',
					categoryTextColor1Hover: '#ffffff',
					excerptTextColor1Hover: '#ffffff',
					metaTextColor1Hover: '#ffffff',
					readmoreTextColor1Hover: '#ffffff',
				},
			},
			{
				value: 'background-color-shadow',
				label: __( 'Background Color and Shadow', i18n ),
				attributes: {
					hasContainer: true,
					containerBackgroundColorHover: '#008de4',
					titleHoverStateInContainer: true,
					categoryHoverStateInContainer: true,
					excerptHoverStateInContainer: true,
					metaHoverStateInContainer: true,
					readmoreHoverStateInContainer: true,
					titleTextColor1Hover: '#ffffff',
					categoryTextColor1Hover: '#ffffff',
					excerptTextColor1Hover: '#ffffff',
					metaTextColor1Hover: '#ffffff',
					readmoreTextColor1Hover: '#ffffff',
				},
			},
			{
				value: 'inner-blocks-color',
				label: __( 'Inner Blocks Color', i18n ),
				attributes: {
					hasContainer: true,
					titleHoverStateInContainer: true,
					categoryHoverStateInContainer: true,
					excerptHoverStateInContainer: true,
					metaHoverStateInContainer: true,
					readmoreHoverStateInContainer: true,
					titleTextColor1Hover: '#008de4',
					categoryTextColor1Hover: '#008de4',
					excerptTextColor1Hover: '#008de4',
					metaTextColor1Hover: '#008de4',
					readmoreTextColor1Hover: '#008de4',
				},
			},
			{
				value: 'border',
				label: __( 'Border', i18n ),
				attributes: {
					hasContainer: true,
					containerBorderType: 'solid',
					containerBorderColorHover: 'var(--stk-global-color-20226, #008de4)',
					containerBorderWidthHover: {
						top: 3,
						right: 3,
						bottom: 3,
						left: 3,
					},
					containerBorderWidth: {
						top: 0,
						right: 0,
						bottom: 0,
						left: 0,
					},
				},
				isPremium: false,
			},
		],
	},
]

