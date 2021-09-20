/**
 * BLOCK: Team Member Block.
 */

/**
 * Internal dependencies
 */
import './design'
import deprecated from './deprecated'
import edit from './edit'
import save from './save'
import schema from './schema'
import example from './example'
import _metadata from './block.json'

/**
 * External dependencies
 */
import { TeamMemberIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { disabledBlocks } from 'stackable'
import { addFilter, applyFilters } from '@wordpress/hooks'

const {
	name,
	...metadata
} = _metadata

export { name }

export const settings = {
	...metadata,
	title: metadata.title + ' (v2)',
	icon: TeamMemberIcon,
	attributes: schema,
	example,
	supports: {
		align: [ 'wide' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
		anchor: true,
	},

	deprecated,
	edit,
	save,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		'advanced-column-spacing': {
			paddings: false,
		},
		'advanced-custom-attributes': true,
		'advanced-responsive': true,
		'block-background': {
			importantBackgroundSize: true,
		},
		'block-separators': true,
		'block-title': {
			blockTitleMarginBottomImportant: true,
			blockDescriptionMarginBottomImportant: true,
		},
		'content-align': true,
		'block-designs': true,
		'container-link': true,
		'custom-css': {
			default: applyFilters( 'stackable.team-member.custom-css.default', '' ),
		},
	},
}

// Reset some attributes if some global attributes are set.
addFilter( 'stackable.team-member.setAttributes', 'stackable/team-member/imageShape', attributes => {
	if ( typeof attributes.imageShape !== 'undefined' ) {
		return {
			...attributes,
			image1Shape: '',
			image2Shape: '',
			image3Shape: '',
			image1ShapeFlipX: '',
			image1ShapeFlipY: '',
			image1ShapeStretch: '',
			image2ShapeFlipX: '',
			image2ShapeFlipY: '',
			image2ShapeStretch: '',
			image3ShapeFlipX: '',
			image3ShapeFlipY: '',
			image3ShapeStretch: '',
		}
	}

	if ( typeof attributes.imageShapeFlipX !== 'undefined' ) {
		return {
			...attributes,
			image1ShapeFlipX: '',
			image2ShapeFlipX: '',
			image3ShapeFlipX: '',
		}
	}

	if ( typeof attributes.imageShapeFlipY !== 'undefined' ) {
		return {
			...attributes,
			image1ShapeFlipY: '',
			image2ShapeFlipY: '',
			image3ShapeFlipY: '',
		}
	}

	if ( typeof attributes.imageShapeStretch !== 'undefined' ) {
		return {
			...attributes,
			image1ShapeStretch: '',
			image2ShapeStretch: '',
			image3ShapeStretch: '',
		}
	}

	if ( typeof attributes.columnBackgroundColor !== 'undefined' || typeof attributes.columnBackgroundColorType !== 'undefined' ) {
		return {
			...attributes,
			column1BackgroundColor: '',
			column2BackgroundColor: '',
			column3BackgroundColor: '',
		}
	}

	return attributes
} )

