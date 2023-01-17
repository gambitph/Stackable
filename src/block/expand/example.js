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
		uniqueId: '76cbc5c', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [ [ 'aria-expanded', 'false' ] ], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%',
	}, innerBlocks: [ {
		name: 'stackable/text', attributes: {
			uniqueId: 'f06aeac', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [ [ 'aria-hidden', 'false' ] ], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, hasP: false, show: true, showText: true, text: __( 'Some short text that can be expanded to show more details.', i18n ), blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', lineHeightUnit: 'em', lineHeightUnitTablet: 'em', lineHeightUnitMobile: 'em', className: 'stk-block-expand__short-text',
		}, innerBlocks: [],
	}, {
		name: 'stackable/button', attributes: {
			uniqueId: '8ea90fc', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [ [ 'aria-hidden', 'false' ], [ 'role', 'button' ] ], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, linkHasLink: true, linkUrl: '#', linkNewTab: false, linkHasTitle: true, showBackgroundShape: false, hasP: false, show: true, showText: true, text: __( 'Show more', i18n ), blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', lineHeightUnit: 'em', lineHeightUnitTablet: 'em', lineHeightUnitMobile: 'em', className: 'is-style-link stk-block-expand__show-button',
		}, innerBlocks: [],
	}, {
		name: 'stackable/text', attributes: {
			uniqueId: '45a5d67', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [ [ 'aria-hidden', 'true' ] ], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, hasP: false, show: true, showText: true, text: __( 'Some long text that will be expanded when the show more button is clicked by the visitor.', i18n ), blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', lineHeightUnit: 'em', lineHeightUnitTablet: 'em', lineHeightUnitMobile: 'em', className: 'stk-block-expand__more-text',
		}, innerBlocks: [],
	}, {
		name: 'stackable/button', attributes: {
			uniqueId: 'ff2b0aa', hasBackground: false, hasBorders: false, effectAnimationOut: {}, effectAnimationIn: {}, customAttributes: [ [ 'aria-hidden', 'true' ], [ 'role', 'button' ] ], hideDesktop: false, hideTablet: false, hideMobile: false, displayCondition: {}, linkHasLink: true, linkUrl: '#', linkNewTab: false, linkHasTitle: true, showBackgroundShape: false, hasP: false, show: true, showText: true, text: __( 'Show less', i18n ), blockBackgroundCustomSizeUnit: '%', blockBackgroundCustomSizeUnitTablet: '%', blockBackgroundCustomSizeUnitMobile: '%', lineHeightUnit: 'em', lineHeightUnitTablet: 'em', lineHeightUnitMobile: 'em', className: 'is-style-link stk-block-expand__hide-button',
		}, innerBlocks: [],
	} ],
}
