/**
 * BLOCK: Feature Block.
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

/**
 * External dependencies
 */
import { FeatureIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { disabledBlocks, i18n } from 'stackable'
import { applyFilters, addFilter } from '@wordpress/hooks'

export const name = 'ugb/feature'

export const settings = {
	title: __( 'Feature', i18n ),
	description: __( 'Display a product feature or a service in a large area.', i18n ),
	icon: FeatureIcon,
	category: 'layout',
	keywords: [
		__( 'Feature', i18n ),
		__( 'Stackable', i18n ),
	],
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
		anchor: true,
	},

	deprecated,
	edit,
	save,

	attributes: schema,
	example,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		// 'advanced-column-spacing': {
		// 	columnGap: false,
		// },
		'advanced-responsive': true,
		'advanced-conditional-display': true,
		'block-background': true,
		'block-separators': true,
		// 'block-title': true,
		'container-link': {
			// We will generate our own container link filter based on selected design.
			customFilters: true,
		},
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.feature.custom-css.default', '' ),
		},
	},
}

addFilter( 'stackable.feature.itemclasses', 'custom', ( classes, props ) => {
	const {
		showContainerLink = false,
		design = 'plain',
	} = props.attributes

	return {
		...classes,
		'ugb-container-link': showContainerLink && [ 'plain', 'basic', 'half' ].includes( design ),
	}
} )

addFilter( 'stackable.feature.contentclasses', 'custom', ( classes, props ) => {
	const {
		showContainerLink = false,
		design = 'plain',
	} = props.attributes

	return {
		...classes,
		'ugb-container-link': showContainerLink && ! [ 'plain', 'basic', 'half' ].includes( design ),
	}
} )
