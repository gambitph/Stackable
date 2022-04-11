import { i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
import { dispatch } from '@wordpress/data'

const innerBlockColors = [
	{
		hoverEffect: 'background-color',
		attributes: {
			textColor1ParentHover: '#008de4',
			iconColor1ParentHover: '#008de4',
		},
	},
	{
		hoverEffect: 'inner-blocks-color',
		attributes: {
			textColor1ParentHover: '#ffffff',
			iconColor1ParentHover: '#ffffff',
		},
	},
]

const updateInnerBlocks = ( innerBlocks, remove = false, value ) => {
	const { updateBlockAttributes, __unstableMarkNextChangeAsNotPersistent } = dispatch( 'core/block-editor' )
	const innerBlockAttr = innerBlockColors.find( ( { hoverEffect: hoverEffect } ) => value === hoverEffect )
	const emptyAttribute = { textColor1ParentHover: '', iconColor1ParentHover: '' }
	innerBlocks.forEach( childBlock => {
		__unstableMarkNextChangeAsNotPersistent()
		if ( childBlock.innerBlocks.length > 0 ) {
			return updateInnerBlocks( childBlock.innerBlocks, remove, value )
		}
		if ( childBlock.name === 'stackable/button' ) {
			if ( value.includes( 'background-color' ) ) {
				updateBlockAttributes( childBlock.clientId, ! remove ? {
					textColor1ParentHover: '#008de4',
					buttonBackgroundColorParentHover: '#ffffff',
				} : emptyAttribute )
			}
		} else {
			updateBlockAttributes( childBlock.clientId, ! remove ? innerBlockAttr.attributes : emptyAttribute )
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
					containerShadow: 'none',
					containerShadowHover: '0px 10px 60px rgba(0, 0, 0, 0.1)',
				},
				isPremium: false,
			},
			{
				value: 'background-color',
				label: __( 'Background Color', i18n ),
				attributes: {
					containerBackgroundColorHover: '#008de4',
					hasContainer: 'true',
				},
				onApplyEffect: innerBlocks => {
					console.log( innerBlocks )
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
							updateInnerBlocks( childBlock.innerBlocks, true )
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
					containerShadowHover: '0px 10px 60px rgba(0, 0, 0, 0.1)',
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
							updateInnerBlocks( childBlock.innerBlocks, true )
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
					containerBackgroundColorHover: '',
				},
				onApplyEffect: innerBlocks => {
					const { updateBlockAttributes, __unstableMarkNextChangeAsNotPersistent } = dispatch( 'core/block-editor' )
					innerBlocks.forEach( childBlock => {
						__unstableMarkNextChangeAsNotPersistent()
						if ( childBlock.innerBlocks.length > 0 ) {
							updateInnerBlocks( childBlock.innerBlocks, undefined, 'inner-blocks-color' )
						}
						updateBlockAttributes( childBlock.clientId, { textColor1ParentHover: '#008de4', iconColor1ParentHover: '#008de4' } )
					} )
				},
				removeEffect: innerBlocks => {
					const { updateBlockAttributes, __unstableMarkNextChangeAsNotPersistent } = dispatch( 'core/block-editor' )
					innerBlocks.forEach( childBlock => {
						__unstableMarkNextChangeAsNotPersistent()
						if ( childBlock.innerBlocks.length > 0 ) {
							updateInnerBlocks( childBlock.innerBlocks, true )
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
					containerBorderColorHover: 'var(--stk-global-color-20226, #008de4)',
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
]

