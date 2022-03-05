/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export default {
	attributes: {
		example: `<li><a href="#0">${ __( 'Introduction', 'Table of Contents example text', i18n ) }<a/></li><li><a href="#0">${ __( 'Chapter 1: Abstract', 'Table of Contents example text', i18n ) }<a/></li><li><a href="#0">${ __( 'Chapter 2: History', 'Table of Contents example text', i18n ) }<a/></li><li><a href="#0">${ __( 'Chapter 3: Main Content', 'Table of Contents example text', i18n ) }<a/></li><li><a href="#0">${ __( 'Chapter 4: Additional Thoughts', 'Table of Contents example text', i18n ) }<a/></li><li><a href="#0">${ __( 'Conclusion', 'Table of Contents example text', i18n ) }<a/></li>`,
	}, innerBlocks: [],
}
