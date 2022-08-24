/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export default {
	attributes: {
		uniqueId: '8a219b3', hasBackground: false, hasBorders: false, htmlTag: 'details', effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, startOpen: true, blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%',
	}, innerBlocks: [ {
		name: 'stackable/column', attributes: {
			uniqueId: '77f0868', hasBackground: false, hasBorders: false, hasContainer: true, htmlTag: 'summary', effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, blockLinkHasLink: true, blockLinkNewTab: false, blockLinkHasTitle: true, templateLock: 'insert', blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', containerBackgroundCustomSizeUnit: '%', containerBackgroundCustomSizeUnitTablet: '%', containerBackgroundCustomSizeUnitMobile: '%', className: 'stk--container-small stk-block-accordion__heading', containerBackgroundColor: '#FFFFFF',
		}, innerBlocks: [ {
			name: 'stackable/icon-label', attributes: {
				uniqueId: 'ffe2f68', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%',
			}, innerBlocks: [ {
				name: 'stackable/heading', attributes: {
					uniqueId: '352ae36', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, hasP: true, show: true, showText: true, text: __( 'Title for This Block', i18n ), textTag: 'h4', blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', lineHeightUnit: 'em', lineHeightUnitTablet: 'em', lineHeightUnitMobile: 'em',
				}, innerBlocks: [],
			}, {
				name: 'stackable/icon', attributes: {
					uniqueId: '9ad9c69', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, icon: '<svg data-prefix="fas" data-icon="chevron-down" class="svg-inline--fa fa-chevron-down fa-w-14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>', showBackgroundShape: false, linkHasLink: false, linkNewTab: false, linkHasTitle: true, blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%',
				}, innerBlocks: [],
			} ],
		} ],
	}, {
		name: 'stackable/column', attributes: {
			uniqueId: '2912fed', hasBackground: false, hasBorders: false, hasContainer: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, blockLinkHasLink: true, blockLinkNewTab: false, blockLinkHasTitle: true, templateLock: false, blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', containerBackgroundCustomSizeUnit: '%', containerBackgroundCustomSizeUnitTablet: '%', containerBackgroundCustomSizeUnitMobile: '%', className: 'stk-block-accordion__content',
		}, innerBlocks: [ {
			name: 'stackable/text', attributes: {
				uniqueId: '9610635', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, hasP: false, show: true, showText: true, text: __( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', i18n ), blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', lineHeightUnit: 'em', lineHeightUnitTablet: 'em', lineHeightUnitMobile: 'em',
			}, innerBlocks: [],
		} ],
	} ],
}
