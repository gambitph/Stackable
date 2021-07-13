/**
 * External dependencies
 */
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	CustomCSS,
	Responsive,
	Advanced,
	Typography,
	Alignment,
	MarginBottom,
	CustomAttributes,
	EffectsAnimations,
} from '~stackable/block-components'

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	Alignment.addAttributes( attrObject )
	BlockDiv.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	MarginBottom.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	Typography.addAttributes( attrObject, '.stk-heading__text', {
		defaultTextTag: 'h2',
	} )

	attrObject.add( {
		attributes: {
			showTopLine: {
				type: 'boolean',
				default: '',
			},
			topLineWidth: {
				type: 'number',
				default: '',
				stkUnits: 'px',
				stkHover: true,
			},
			topLineHeight: {
				type: 'number',
				default: '',
			},
			topLineColor: {
				type: 'string',
				default: '',
				stkHover: true,
			},
			topLineMargin: {
				type: 'number',
				default: '',
				stkResponsive: true,
			},
			topLineAlign: {
				type: 'string',
				default: '',
				stkResponsive: true,
			},
			showBottomLine: {
				type: 'boolean',
				default: '',
			},
			bottomLineWidth: {
				type: 'number',
				default: '',
				stkUnits: 'px',
				stkHover: true,
			},
			bottomLineHeight: {
				type: 'number',
				default: '',
			},
			bottomLineColor: {
				type: 'string',
				default: '',
				stkHover: true,
			},
			bottomLineMargin: {
				type: 'number',
				default: '',
				stkResponsive: true,
			},
			bottomLineAlign: {
				type: 'string',
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
