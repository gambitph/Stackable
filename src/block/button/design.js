/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Remove text from block designs being applied.
addFilter( 'stackable.button.design.no-text-attributes', 'stackable/button', attributes => {
	return omit( attributes, [
		'button1Text',
		'button2Text',
		'button3Text',
	] )
} )

// Ignore these attributes when exporting / applying designs.
addFilter( 'stackable.button.design.filtered-block-attributes', 'stackable/button', attributes => {
	return omit( attributes, [
		'button1Url',
		'button1NewTab',
		'button1NoFollow',
		'button2Url',
		'button2NewTab',
		'button2NoFollow',
		'button3Url',
		'button3NewTab',
		'button3NoFollow',
	] )
} )
