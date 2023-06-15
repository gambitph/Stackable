/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { _x } from '@wordpress/i18n'

export default {
	attributes: {
		example: `<li><a href="#0">${ _x( 'Introduction', 'Table of Contents example text', i18n ) }<a/></li><li><a href="#0">${ _x( 'Chapter 1: Abstract', 'Table of Contents example text', i18n ) }<a/></li><li><a href="#0">${ _x( 'Chapter 2: History', 'Table of Contents example text', i18n ) }<a/></li><li><a href="#0">${ _x( 'Chapter 3: Main Content', 'Table of Contents example text', i18n ) }<a/></li><li><a href="#0">${ _x( 'Chapter 4: Additional Thoughts', 'Table of Contents example text', i18n ) }<a/></li><li><a href="#0">${ _x( 'Conclusion', 'Table of Contents example text', i18n ) }<a/></li>`,
	}, innerBlocks: [],
}
