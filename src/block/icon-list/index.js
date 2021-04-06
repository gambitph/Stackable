/**
 * BLOCK: Icon List Block.
 */

/**
 * External dependencies
 */
import { IconListIcon } from '~stackable/icons'
import { range } from 'lodash'
import { disabledBlocks, i18n } from 'stackable'

/**
 * Internal dependencies
 */
import './design'
import deprecated from './deprecated'
import edit from './edit'
import save from './save'
import schema from './schema'
import example from './example'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters, addFilter } from '@wordpress/hooks'

export const name = 'ugb/icon-list'

export const settings = {
	title: __( 'Icon List', i18n ),
	description: __( 'An unordered list with icons. You can use this as a list of features or benefits.', i18n ),
	icon: IconListIcon,
	category: 'common',
	keywords: [
		__( 'Icon List', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	example,
	supports: {
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
		// 'advanced-column-spacing': true,
		'advanced-responsive': true,
		'advanced-conditional-display': true,
		'block-background': true,
		'block-separators': true,
		'block-title': true,
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.icon-list.custom-css.default', '' ),
		},
	},
}

// If the user changes the icon in the inspector, change all icons
addFilter( 'stackable.icon-list.setAttributes', 'stackable/icon-list/icon', ( attributes, blockProps ) => {
	if ( typeof attributes.icon === 'undefined' ) {
		return attributes
	}

	range( 1, 21 ).forEach( index => {
		if ( blockProps.attributes[ `icon${ index }` ] ) {
			attributes[ `icon${ index }` ] = undefined
		}
	} )

	return attributes
} )
