/**
 * External dependencies
 */
import { TableOfContentsIcon } from '~stackable/icons'
import { omit } from 'lodash'
import { i18n } from 'stackable'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import metadata from './block.json'
import schema from './schema'
import example from './example'
import deprecated from './deprecated'

/**
 * WordPress dependencies
 */
import { _x } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'

export const settings = {
	...metadata,
	icon: TableOfContentsIcon,
	attributes: schema,
	supports: {
		anchor: true,
		// Display additional blocks when editing the block's default style.
		stkSaveBlockStyle: [
			[ 'stackable/table-of-contents', {} ],
			// We need to add sample headings for the table of contents block to show things.
			[ 'core/heading', {
				content: _x( 'Introduction', 'Table of Contents example text', i18n ),
				anchor: 'heading',
				level: 2,
			} ],
			[ 'core/heading', {
				content: _x( 'Chapter 1: Abstract', 'Table of Contents example text', i18n ),
				anchor: 'heading',
				level: 2,
			} ],
			[ 'core/heading', {
				content: _x( 'Chapter 2: History', 'Table of Contents example text', i18n ),
				anchor: 'heading',
				level: 2,
			} ],
			[ 'core/heading', {
				content: _x( 'Chapter 3: Main Content', 'Table of Contents example text', i18n ),
				anchor: 'heading',
				level: 2,
			} ],
			[ 'core/heading', {
				content: _x( 'Chapter 4: Additional Thoughts', 'Table of Contents example text', i18n ),
				anchor: 'heading',
				level: 2,
			} ],
			[ 'core/heading', {
				content: _x( 'Conclusion', 'Table of Contents example text', i18n ),
				anchor: 'heading',
				level: 2,
			} ],
		],
	},
	example,

	deprecated,
	edit,
	save,
}

// When saving block styles, don't save the headings detected by the block.
addFilter( 'stackable.table-of-contents.design.filtered-block-attributes', 'stackable/table-of-contents', attributes => {
	return omit( attributes, [ 'headings' ] )
} )
