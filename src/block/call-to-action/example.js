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
		uniqueId: 'e1cf244', hasBackground: false, hasBorders: false, hasContainer: true, contentAlign: 'center', effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], displayCondition: {}, hideDesktop: false, hideTablet: false, hideMobile: false, blockLinkHasLink: true, blockLinkNewTab: false, blockLinkHasTitle: true, blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', containerBackgroundCustomSizeUnit: '%', containerBackgroundCustomSizeUnitTablet: '%', containerBackgroundCustomSizeUnitMobile: '%',
	}, innerBlocks: [ {
		name: 'stackable/heading', attributes: {
			uniqueId: '0482a4d', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, hasP: false, show: true, showText: true, text: __( 'Title for This Block', i18n ), textTag: 'h3', blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', lineHeightUnit: 'em', lineHeightUnitTablet: 'em', lineHeightUnitMobile: 'em',
		}, innerBlocks: [],
	}, {
		name: 'stackable/text', attributes: {
			uniqueId: '3d22629', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, hasP: false, show: true, showText: true, text: __( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', i18n ), blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', lineHeightUnit: 'em', lineHeightUnitTablet: 'em', lineHeightUnitMobile: 'em',
		}, innerBlocks: [],
	}, {
		name: 'stackable/button-group', attributes: {
			uniqueId: 'e1e1c84', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%',
		}, innerBlocks: [ {
			name: 'stackable/button', attributes: {
				uniqueId: '852fde3', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, linkHasLink: true, linkNewTab: false, linkHasTitle: true, showBackgroundShape: false, hasP: false, show: true, showText: true, text: __( 'Button', i18n ), blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', lineHeightUnit: 'em', lineHeightUnitTablet: 'em', lineHeightUnitMobile: 'em',
			}, innerBlocks: [],
		} ],
	} ],
}
