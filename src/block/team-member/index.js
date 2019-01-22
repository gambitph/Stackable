/**
 * BLOCK: Team Member Block.
 */

import { __ } from '@wordpress/i18n'
import { descriptionPlaceholder } from '@stackable/util'
import { disabledBlocks } from 'stackable'
import { TeamMemberIcon } from '@stackable/icons'

export const schema = {
	href1: {
		type: 'url',
	},
	href2: {
		type: 'url',
	},
	href3: {
		type: 'url',
	},
	mediaID1: {
		type: 'number',
	},
	mediaID2: {
		type: 'number',
	},
	mediaID3: {
		type: 'number',
	},
	mediaURL1: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-team-member__item:nth-child(1) .ugb-team-member__image',
		attribute: 'data-src',
	},
	mediaURL2: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-team-member__item:nth-child(2) .ugb-team-member__image',
		attribute: 'data-src',
	},
	mediaURL3: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-team-member__item:nth-child(3) .ugb-team-member__image',
		attribute: 'data-src',
	},
	name1: {
		source: 'html',
		selector: '.ugb-team-member__item:nth-child(1) .ugb-team-member__name',
		default: __( 'Name' ),
	},
	name2: {
		source: 'html',
		selector: '.ugb-team-member__item:nth-child(2) .ugb-team-member__name',
		default: __( 'Name' ),
	},
	name3: {
		source: 'html',
		selector: '.ugb-team-member__item:nth-child(3) .ugb-team-member__name',
		default: __( 'Name' ),
	},
	position1: {
		source: 'html',
		selector: '.ugb-team-member__item:nth-child(1) .ugb-team-member__position',
		default: __( 'Position' ),
	},
	position2: {
		source: 'html',
		selector: '.ugb-team-member__item:nth-child(2) .ugb-team-member__position',
		default: __( 'Position' ),
	},
	position3: {
		source: 'html',
		selector: '.ugb-team-member__item:nth-child(3) .ugb-team-member__position',
		default: __( 'Position' ),
	},
	description1: {
		source: 'html',
		selector: '.ugb-team-member__item:nth-child(1) .ugb-team-member__description',
		default: descriptionPlaceholder( 'medium' ),
	},
	description2: {
		source: 'html',
		selector: '.ugb-team-member__item:nth-child(2) .ugb-team-member__description',
		default: descriptionPlaceholder( 'medium' ),
	},
	description3: {
		source: 'html',
		selector: '.ugb-team-member__item:nth-child(3) .ugb-team-member__description',
		default: descriptionPlaceholder( 'medium' ),
	},
	nameColor: {
		type: 'string',
	},
	posColor: {
		type: 'string',
	},
	desColor: {
		type: 'string',
	},
	columns: {
		type: 'number',
		default: 2,
	},
	shapes: {
		type: 'string',
		default: 'circle',
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

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	href: {
		type: 'url',
	},
	hrefTwo: {
		type: 'url',
	},
	hrefThree: {
		type: 'url',
	},
	mediaID: {
		type: 'number',
	},
	mediaIDTwo: {
		type: 'number',
	},
	mediaIDThree: {
		type: 'number',
	},
	mediaURL: {
		type: 'string',
	},
	mediaURLTwo: {
		type: 'string',
	},
	mediaURLThree: {
		type: 'string',
	},
	name: {
		type: 'string',
	},
	nameTwo: {
		type: 'string',
	},
	nameThree: {
		type: 'string',
	},
	position: {
		type: 'string',
	},
	positionTwo: {
		type: 'string',
	},
	positionThree: {
		type: 'string',
	},
	des: {
		type: 'string',
	},
	desTwo: {
		type: 'string',
	},
	desThree: {
		type: 'string',
	},
	iconColor: {
		type: 'string',
	},
}

export const name = 'ugb/team-member'

export const settings = {
	title: __( 'Team Member' ),
	description: __( 'Display members of your team or your office. Use multiple Team Member blocks if you have a large team.' ),
	icon: TeamMemberIcon,
	category: 'stackable',
	keywords: [
		__( 'Team Member' ),
		__( 'Stackable' ),
	],
	attributes: schema,
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/team-member-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
