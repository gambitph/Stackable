import {
	Advanced,
	Alignment,
	BlockDiv,
	Style,
	ConditionalDisplay,
	CustomAttributes,
	CustomCSS,
	EffectsAnimations,
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
	EffectsAnimations.addAttributes( attrObject )
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
			showArrows: {
				type: 'boolean',
				default: true,
			},
			showArrowsOnMobile: {
				type: 'boolean',
				default: true,
			},
			showDots: {
				type: 'boolean',
				default: true,
			},
			showDotsOnMobile: {
				type: 'boolean',
				default: true,
			},
			slidesToShow: {
				type: 'number',
				default: '',
				stkResponsive: true,
			},
			fadeOutOtherSlides: {
				type: 'boolean',
				default: true,
			},
			slideColumnGap: {
				type: 'number',
				default: '',
				stkResponsive: true,
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )