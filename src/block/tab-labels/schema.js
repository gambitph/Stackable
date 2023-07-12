/**
 * External dependencies
 */
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	Style,
	CustomCSS,
	Responsive,
	Advanced,
	Typography,
	Alignment,
	MarginBottom,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Transform,
	Icon,
	Button,
} from '~stackable/block-components'

export const defaultIcon = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bars" class="svg-inline--fa fa-bars fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path></svg>'

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	BlockDiv.addAttributes( attrObject )
	Style.addAttributes( attrObject )
	EffectsAnimations.addAttributes( attrObject )
	CustomAttributes.addAttributes( attrObject )
	CustomCSS.addAttributes( attrObject )
	Responsive.addAttributes( attrObject )
	ConditionalDisplay.addAttributes( attrObject )
	Advanced.addAttributes( attrObject )
	Transform.addAttributes( attrObject )
	Alignment.addAttributes( attrObject )
	MarginBottom.addAttributes( attrObject )
	Typography.addAttributes( attrObject, '.stk-block-tab-labels__text', { hasTextTag: false, attrNameTemplate: 'tab%s' } )
	Icon.addAttributes( attrObject )
	Button.addAttributes( attrObject, { attrNameTemplate: 'tab%s' } )
	Button.addAttributes( attrObject, { attrNameTemplate: 'activeTab%s' } )

	attrObject.add( {
		attributes: {
			tabLabels: {
				type: 'array',
				default: [
					{ label: '', icon: '' },
					{ label: '', icon: '' },
					{ label: '', icon: '' },
				],
			},
			tabAlignment: {
				type: 'string',
				default: '',
				stkResponsive: true,
			},
			fullWidth: {
				type: 'boolean',
				default: false,
			},
			scrollableOnMobile: {
				type: 'boolean',
				default: true,
			},
			columnGap: {
				type: 'number',
				default: '',
				stkResponsive: true,
			},
			rowGap: {
				type: 'number',
				default: '',
				stkResponsive: true,
			},

			tabTextColor1: {
				type: 'string',
				default: '',
				stkHover: true,
			},
			tabIconColor1: {
				type: 'string',
				default: '',
				stkHover: true,
			},
			activeTabTextColor: {
				type: 'string',
				default: '',
				stkHover: true,
			},
			activeTabIconColor1: {
				type: 'string',
				default: '',
				stkHover: true,
			},

			showIcon: {
				type: 'boolean',
				default: false,
			},
			iconPosition: {
				type: 'string',
				default: '',
			},
			activeBackgroundColor: {
				type: 'string',
				default: '',
				stkHover: true,
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	attrObject.addDefaultValues( {
		attributes: {
			icon: defaultIcon,
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )
