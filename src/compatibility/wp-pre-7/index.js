/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

/**
 * Internal dependencies
 */
import { semverCompare } from '~stackable/util'
import { wpVersion } from 'stackable'

addFilter( 'stackable.block-css.editor-preview-breakpoints', 'stackable/wp-pre-7', breakpoints => {
	if ( wpVersion && semverCompare( wpVersion, '<', '7.0' ) ) {
		return {
			tablet: 781,
			mobile: 361,
		}
	}

	return breakpoints
} )
