/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Remove text from block designs being applied.
addFilter( 'stackable.icon.design.no-text-attributes', 'stackable/icon', attributes => {
	return omit( attributes, [
		'icon1',
		'icon2',
		'icon3',
		'icon4',
		'icon5',
		'icon6',
		'icon7',
		'icon8',
		'url1',
		'url2',
		'url3',
		'url4',
		'url5',
		'url6',
		'url7',
		'url8',
		'newTab1',
		'newTab2',
		'newTab3',
		'newTab4',
		'newTab5',
		'newTab6',
		'newTab7',
		'newTab8',
		'noFollow1',
		'noFollow2',
		'noFollow3',
		'noFollow4',
		'noFollow5',
		'noFollow6',
		'noFollow7',
		'noFollow8',
		'title1',
		'title2',
		'title3',
		'title4',
		'title5',
		'title6',
		'title7',
		'title8',
	] )
} )
