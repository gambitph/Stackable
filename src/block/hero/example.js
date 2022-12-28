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
		uniqueId: 'c5a87cb', hasBackground: false, hasBorders: false, hasContainer: true, containerBackgroundColor: '#000000', containerHeight: 500, containerVerticalAlign: 'center', contentAlign: 'center', effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], displayCondition: {}, hideDesktop: false, hideTablet: false, hideMobile: false, blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', containerBackgroundCustomSizeUnit: '%', containerBackgroundCustomSizeUnitTablet: '%', containerBackgroundCustomSizeUnitMobile: '%',
	}, innerBlocks: [ {
		name: 'stackable/heading', attributes: {
			uniqueId: 'ab8669f', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, textColorClass: 'has-white-color', textColor1: '#FFFFFF', hasP: false, show: true, showText: true, text: __( 'Header Title', i18n ), textTag: 'h2', blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', lineHeightUnit: 'em', lineHeightUnitTablet: 'em', lineHeightUnitMobile: 'em',
		}, innerBlocks: [],
	}, {
		name: 'stackable/text', attributes: {
			uniqueId: '49b0171', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, textColorClass: 'has-white-color', textColor1: '#FFFFFF', hasP: false, show: true, showText: true, text: __( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', i18n ), blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', lineHeightUnit: 'em', lineHeightUnitTablet: 'em', lineHeightUnitMobile: 'em',
		}, innerBlocks: [],
	}, {
		name: 'stackable/button-group', attributes: {
			uniqueId: '869a544', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%',
		}, innerBlocks: [ {
			name: 'stackable/button', attributes: {
				uniqueId: '12e2b68', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, linkHasLink: true, linkNewTab: false, linkHasTitle: true, showBackgroundShape: false, hasP: false, show: true, showText: true, text: __( 'Button', i18n ), blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', lineHeightUnit: 'em', lineHeightUnitTablet: 'em', lineHeightUnitMobile: 'em',
			}, innerBlocks: [],
		} ],
	} ],
}
