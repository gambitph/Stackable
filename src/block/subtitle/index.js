/**
 * BLOCK: Subtitle Block.
 */
/**
 * External dependencies
 */
import { TextIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import transforms from './transforms'
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import example from './example'
import deprecated from './deprecated'
import substitute from './substitute'

export const settings = {
	...metadata,
	icon: TextIcon,
	attributes: schema,
	supports: {
		anchor: true,
		spacing: true,
		splitting: true,
	},
	example,
	deprecated,
	edit,
	save,
	transforms,
	merge( attributes, attributesToMerge ) {
		// Make sure that the selection is always at the end of the text.
		// @see https://github.com/WordPress/gutenberg/blob/3da717b8d0ac7d7821fc6d0475695ccf3ae2829f/packages/block-library/src/paragraph/index.js
		return {
			text:
				( attributes.text || '' ) +
			( ( attributesToMerge.hasOwnProperty( 'content' ) ? attributesToMerge.content : attributesToMerge.text ) || '' ),
		}
	},
	substitute,
}
