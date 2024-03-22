import {
	Advanced,
	Alignment,
	BlockDiv,
	Style,
	ConditionalDisplay,
	CustomAttributes,
	CustomCSS,
	MarginBottom,
	Responsive,
	Row,
	Separator,
	Transform,
	ContentAlign,
	Columns,
} from '~stackable/block-components'
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'

export const defaultIconPrev = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left" class="svg-inline--fa fa-chevron-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="32" height="32"><path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path></svg>`
export const defaultIconNext = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" class="svg-inline--fa fa-chevron-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="32" height="32"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path></svg>`

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	BlockDiv.addAttributes( attrObject )
	Columns.addAttributes( attrObject )
	Style.addAttributes( attrObject )
	MarginBottom.addAttributes( attrObject )
	Row.addAttributes( attrObject )
	Alignment.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	Transform.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	ConditionalDisplay.addAttributes( attrObject )
	Separator.addAttributes( attrObject )
	ContentAlign.addAttributes( attrObject )

	attrObject.add( {
		attributes: {
			carouselType: {
				type: 'string',
				default: '',
			},
			fadeDuration: {
				type: 'number',
				default: '',
			},
			autoplay: {
				type: 'boolean',
				default: true,
			},
			autoplaySpeed: {
				type: 'number',
				default: '',
			},
			slidesToShow: {
				type: 'number',
				default: '',
				stkResponsive: true,
			},
			slideColumnGap: {
				type: 'number',
				default: '',
				stkResponsive: true,
			},
			infiniteScroll: {
				type: 'boolean',
				default: false,
			},

			/**
			 * Arrows.
			 */
			showArrows: {
				type: 'boolean',
				default: true,
			},
			showArrowsOnMobile: {
				type: 'boolean',
				default: true,
			},
			arrowIconPrev: {
				type: 'string',
				source: 'html',
				selector: '.stk-block-carousel__button__prev',
				default: '',
			},
			arrowIconNext: {
				type: 'string',
				source: 'html',
				selector: '.stk-block-carousel__button__next',
				default: '',
			},
			arrowPosition: {
				type: 'string',
				default: '',
			},
			arrowJustify: {
				type: 'string',
				default: '',
			},
			arrowAlign: {
				type: 'string',
				default: '',
			},
			arrowButtonOffset: {
				type: 'number',
				default: '',
				stkResponsive: true,
			},
			arrowButtonGap: {
				type: 'number',
				default: '',
				stkResponsive: true,
			},
			arrowButtonColor: {
				type: 'string',
				default: '',
				stkHover: true,
			},
			arrowIconColor: {
				type: 'string',
				default: '',
				stkHover: true,
			},
			arrowHeight: {
				type: 'number',
				default: '',
				stkUnits: 'px',
				stkResponsive: true,
			},
			arrowWidth: {
				type: 'number',
				default: '',
				stkUnits: 'px',
				stkResponsive: true,
			},
			arrowBorderRadius: {
				type: 'number',
				default: '',
			},
			arrowIconSize: {
				type: 'number',
				default: '',
				stkResponsive: true,
			},
			arrowOpacity: {
				type: 'number',
				default: '',
				stkHover: true,
			},

			/**
			 * Dots.
			 */
			showDots: {
				type: 'boolean',
				default: true,
			},
			dotsJustify: {
				type: 'string',
				default: '',
			},
			dotsOffset: {
				type: 'number',
				default: '',
				stkResponsive: true,
			},
			dotsGap: {
				type: 'number',
				default: '',
			},
			dotsStyle: {
				type: 'string',
				default: '',
			},
			dotsColor: {
				type: 'string',
				default: '',
				stkHover: true,
			},
			dotsActiveColor: {
				type: 'string',
				default: '',
			},
			dotsSize: {
				type: 'number',
				default: '',
			},
			dotsBorderRadius: {
				type: 'number',
				default: '',
			},
			dotsActiveWidth: {
				type: 'number',
				default: '',
			},
			dotsActiveHeight: {
				type: 'number',
				default: '',
			},
			showDotsOnMobile: {
				type: 'boolean',
				default: true,
			},

			/**
			 * Accessibility
			 */
			ariaLabelPrev: {
				type: 'string',
				default: '',
			},
			ariaLabelNext: {
				type: 'string',
				default: '',
			},
			ariaLabelSlide: {
				type: 'string',
				default: '',
			},
			ariaLabelSlideOf: {
				type: 'string',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
