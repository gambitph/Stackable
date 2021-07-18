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
import _metadata from './block.json'

/**
 * External dependencies
 */
import { FeatureIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { disabledBlocks } from 'stackable'
import { applyFilters, addFilter } from '@wordpress/hooks'

const {
	name,
	...metadata
} = _metadata

export { name }

export const settings = {
	...metadata,
	icon: FeatureIcon,
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
		'advanced-custom-attributes': true,
		'advanced-responsive': true,
		'block-background': {
			importantBackgroundSize: true,
		},
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
