/**
 * BLOCK: Pricing Box Block.
 */

import { __ } from '@wordpress/i18n'
import { descriptionPlaceholder } from '@stackable/util'
import { disabledBlocks } from 'stackable'
import { PricingBoxIcon } from '@stackable/icons'

const schema = {
	pricingBoxColor: {
		type: 'string',
	},
	priceColor: {
		type: 'string',
	},
	perMonthLabelColor: {
		type: 'string',
	},
	buttonColor: {
		type: 'string',
	},
	buttonTextColor: {
		type: 'string',
	},
	buttonDesign: {
		type: 'string',
		default: 'basic',
	},
	buttonIcon: {
		type: 'string',
	},
	featureListColor: {
		type: 'string',
	},
	columns: {
		type: 'number',
		default: 2,
	},
	size: {
		type: 'string',
		default: 'normal',
	},
	cornerButtonRadius: {
		type: 'number',
		default: 4,
	},
	design: {
		type: 'string',
		default: 'basic',
	},
	borderRadius: {
		type: 'number',
		default: 12,
	},
	shadow: {
		type: 'number',
		default: 3,
	},
}
// Wrap in curly or else statement will merge with the previous one and will error out.
{ [ 1, 2, 3 ].forEach( i => {
	const index = i === 1 ? '' : i
	schema[ `url${ index }` ] = {
		type: 'string',
		source: 'attribute',
		selector: `.ugb-pricing-box__item:nth-child(${ i }) .ugb-button`,
		attribute: 'href',
	}
	schema[ `newTab${ index }` ] = {
		type: 'boolean',
		source: 'attribute',
		selector: `.ugb-pricing-box__item:nth-child(${ i }) .ugb-button`,
		attribute: 'target',
		default: false,
	}
	schema[ `imageURL${ index }` ] = {
		type: 'string',
	}
	schema[ `imageID${ index }` ] = {
		type: 'string',
	}
	schema[ `pricingBoxTitle${ index }` ] = {
		source: 'html',
		selector: `.ugb-pricing-box__item:nth-child(${ i }) .ugb-pricing-box__title`,
		default: __( 'Title' ),
	}
	schema[ `price${ index }` ] = {
		source: 'html',
		selector: `.ugb-pricing-box__item:nth-child(${ i }) .ugb-pricing-box__price`,
		default: `${ index }9`,
	}
	schema[ `pricePrefix${ index }` ] = {
		source: 'html',
		selector: `.ugb-pricing-box__item:nth-child(${ i }) .ugb-pricing-box__price-prefix`,
		default: '$',
	}
	schema[ `priceSuffix${ index }` ] = {
		source: 'html',
		selector: `.ugb-pricing-box__item:nth-child(${ i }) .ugb-pricing-box__price-suffix`,
		default: '.00',
	}
	schema[ `perMonthLabel${ index }` ] = {
		source: 'html',
		selector: `.ugb-pricing-box__item:nth-child(${ i }) .ugb-pricing-box__subprice`,
		default: __( 'Description' ),
	}
	schema[ `buttonText${ index }` ] = {
		source: 'html',
		selector: `.ugb-pricing-box__item:nth-child(${ i }) .ugb-button span`,
		default: __( 'Button text' ),
	}
	schema[ `featureList${ index }` ] = {
		source: 'html',
		selector: `.ugb-pricing-box__item:nth-child(${ i }) .ugb-pricing-box__description`,
		default: descriptionPlaceholder( 'medium' ),
	}
} ) }

export const name = 'ugb/pricing-box'

export const settings = {
	title: __( 'Pricing Box' ),
	description: __( 'Display the different pricing tiers of your business.' ),
	icon: PricingBoxIcon,
	category: 'stackable',
	keywords: [
		__( 'Pricing Box' ),
		__( 'Stackable' ),
	],
	attributes: schema,
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/pricing-table-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
