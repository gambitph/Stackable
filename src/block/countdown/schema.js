import { Divider } from './divider'

/**
 * External dependencies
 */
import { AttributeObject } from '~stackable/util'
import { version as VERSION } from 'stackable'
import {
	BlockDiv,
	Style,
	ContainerDiv,
	CustomCSS,
	Responsive,
	Advanced,
	Alignment,
	MarginBottom,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Transform,
	Typography,
} from '~stackable/block-components'

import { __, i18n } from '@wordpress/i18n'
import { date } from '@wordpress/date'

const DEFAULT_DATE = date( 'Y-m-d\\TH:i', Date.now() + 345600000 )

const countdownAttributes = {
	countdownType: {
		type: 'string',
		selector: '[data-stk-countdown-type]',
		source: 'attribute',
		attribute: 'data-stk-countdown-type',
		default: 'dueDate',
	},
	date: {
		type: 'string',
		selector: '[data-stk-countdown-date]',
		source: 'attribute',
		attribute: 'data-stk-countdown-date',
		default: DEFAULT_DATE,
	},
	restartInterval: {
		type: 'string',
		selector: '[data-stk-countdown-restart-interval]',
		source: 'attribute',
		attribute: 'data-stk-countdown-restart-interval',
		default: '',
	},
	actionOnExpiration: {
		type: 'string',
		selector: '[data-stk-countdown-action]',
		source: 'attribute',
		attribute: 'data-stk-countdown-action',
		default: '',
	},
	timezone: {
		type: 'string',
		selector: '[data-stk-countdown-timezone]',
		source: 'attribute',
		attribute: 'data-stk-countdown-timezone',
		default: '',
	},
	dayText: {
		type: 'string',
		selector: '.stk-block-countdown__label_day',
		source: 'html',
		default: __( 'Days', i18n ),
	},
	hourText: {
		type: 'string',
		selector: '.stk-block-countdown__label_hour',
		source: 'html',
		default: __( 'Hours', i18n ),
	},
	minuteText: {
		type: 'string',
		selector: '.stk-block-countdown__label_minute',
		source: 'html',
		default: __( 'Minutes', i18n ),
	},
	secondText: {
		type: 'string',
		selector: '.stk-block-countdown__label_second',
		source: 'html',
		default: __( 'Seconds', i18n ),
	},
	daysLeft: {
		type: 'number',
		default: '',
	},
	hoursLeft: {
		type: 'number',
		default: '',
	},
	minutesLeft: {
		type: 'number',
		default: '',
	},
	secondsLeft: {
		type: 'number',
		default: '',
	},
	boxGap: {
		type: 'number',
		default: '16',
	},
	labelMarginTop: {
		type: 'number',
		default: '8',
	},
	dayShow: {
		type: 'boolean',
		default: true,
	},
	hourShow: {
		type: 'boolean',
		default: true,
	},
	minuteShow: {
		type: 'boolean',
		default: true,
	},
	secondShow: {
		type: 'boolean',
		default: true,
	},
	digitFontSize: {
		type: 'number',
		default: '40',
	},
	dividerType: {
		type: 'string',
		default: ':',
	},
	is00: {
		type: 'boolean',
		default: true,
	},
}

export const attributes = ( version = VERSION ) => {
	const attrObject = new AttributeObject()

	Divider.addAttributes( attrObject )
	BlockDiv.addAttributes( attrObject )
	ContainerDiv.addAttributes( attrObject )
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

	Typography.addAttributes( attrObject, '.stk-block-countdown__digit', {
		hasTextTag: false,
		hasTextContent: false,
		attrNameTemplate: 'digit%s',
	} )

	Typography.addAttributes( attrObject, '.stk-block-countdown__label', {
		hasTextTag: false,
		hasTextContent: false,
		attrNameTemplate: 'label%s',
	} )

	Typography.addAttributes( attrObject, '.stk-block-countdown__message', {
		hasTextTag: true,
		hasTextContent: true,
		attrNameTemplate: 'message%s',
	} )

	attrObject.add( {
		attributes: countdownAttributes,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	attrObject.addDefaultValues( {
		attributes: {
			boxGap: 16,
			labelMarginTop: 8,
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	return attrObject.getMerged( version )
}

export default attributes( VERSION )

