/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Remove text from block designs being applied.
addFilter( 'stackable.number-box.design.no-text-attributes', 'stackable/number-box', attributes => {
	return omit( attributes, [
		'num1',
		'num2',
		'num3',
		'title1',
		'title2',
		'title3',
		'description1',
		'description2',
		'description3',
	] )
} )
