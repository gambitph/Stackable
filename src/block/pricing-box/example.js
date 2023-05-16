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
		uniqueId: '093422b', hasBackground: false, hasBorders: false, hasContainer: true, contentAlign: 'center', effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], displayCondition: {}, hideDesktop: false, hideTablet: false, hideMobile: false, blockLinkHasLink: true, blockLinkNewTab: false, blockLinkHasTitle: true, blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', containerBackgroundCustomSizeUnit: '%', containerBackgroundCustomSizeUnitTablet: '%', containerBackgroundCustomSizeUnitMobile: '%', className: 'is-style-basic',
	}, innerBlocks: [ {
		name: 'stackable/heading', attributes: {
			uniqueId: '5012c51', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, hasP: false, show: true, showText: true, text: __( 'Title', i18n ), textTag: 'h3', blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', lineHeightUnit: 'em', lineHeightUnitTablet: 'em', lineHeightUnitMobile: 'em',
		}, innerBlocks: [],
	}, {
		name: 'stackable/price', attributes: {
			uniqueId: '9de41dd', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%',
		}, innerBlocks: [ {
			name: 'stackable/text', attributes: {
				uniqueId: '8268936', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, htmlTag: 'span', hasP: false, show: true, showText: true, text: __( '$', i18n ), innerTextTag: 'span', blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', lineHeightUnit: 'em', lineHeightUnitTablet: 'em', lineHeightUnitMobile: 'em',
			}, innerBlocks: [],
		}, {
			name: 'stackable/text', attributes: {
				uniqueId: 'e63a742', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, htmlTag: 'span', hasP: false, show: true, showText: true, text: __( '99', i18n ), innerTextTag: 'span', blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', lineHeightUnit: 'em', lineHeightUnitTablet: 'em', lineHeightUnitMobile: 'em', className: 'stk-block-price__price',
			}, innerBlocks: [],
		}, {
			name: 'stackable/text', attributes: {
				uniqueId: 'cb8d508', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, htmlTag: 'span', hasP: false, show: true, showText: true, text: __( '.00', i18n ), innerTextTag: 'span', blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', lineHeightUnit: 'em', lineHeightUnitTablet: 'em', lineHeightUnitMobile: 'em',
			}, innerBlocks: [],
		} ],
	}, {
		name: 'stackable/subtitle', attributes: {
			uniqueId: 'f466288', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, hasP: false, show: true, showText: true, text: __( 'Subtitle for This Block', i18n ), blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', lineHeightUnit: 'em', lineHeightUnitTablet: 'em', lineHeightUnitMobile: 'em',
		}, innerBlocks: [],
	}, {
		name: 'stackable/icon-list', attributes: {
			uniqueId: '438b4fe', hasBackground: false, hasBorders: false, customAttributes: [], effectAnimationOut: {}, effectAnimationIn: {}, hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, hasP: false, show: true, showText: true, text: `<li>${ __( 'Package inclusion one', i18n ) }</li><li>${ __( 'Package inclusion two', i18n ) }</li><li>${ __( 'Package inclusion three', i18n ) }</li>`, ordered: false, icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 190"><polygon points="173.8,28.4 60.4,141.8 15.7,97.2 5.1,107.8 60.4,163 184.4,39 173.8,28.4"/></svg>', icons: {}, blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', lineHeightUnit: 'em', lineHeightUnitTablet: 'em', lineHeightUnitMobile: 'em', contentAlign: 'center',
		}, innerBlocks: [],
	}, {
		name: 'stackable/button-group', attributes: {
			uniqueId: '7fdb95b', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%',
		}, innerBlocks: [ {
			name: 'stackable/button', attributes: {
				uniqueId: 'fe3d631', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, linkHasLink: true, linkNewTab: false, linkHasTitle: true, showBackgroundShape: false, hasP: false, show: true, showText: true, text: __( 'Button', i18n ), blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', lineHeightUnit: 'em', lineHeightUnitTablet: 'em', lineHeightUnitMobile: 'em',
			}, innerBlocks: [],
		} ],
	} ],
}
