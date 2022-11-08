/**
 * Internal dependencies
 */
import { attributes } from './schema'
import { Save } from './save'

/**
 * External dependencies
 */
import { withVersion } from '~stackable/higher-order'
import compareVersions from 'compare-versions'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.table-of-contents.save.blockClasses', 'stackable/classesNotRendered', ( output, textClasses, props ) => {
	if ( compareVersions( props.version, '3.6.1' ) === 0 ) {
		output.push( textClasses )
		return output
	}

	return output
} )

addFilter( 'stackable.table-of-contents.save.tableOfContentsClasses', 'stackable/classesNotRendered', ( output, props ) => {
	if ( compareVersions( props.version, '3.6.1' ) === 0 ) {
		return 'stk-table-of-contents__table'
	}
	return output
} )

const deprecated = [
	 {
		 attributes: attributes( '3.6.1' ),
		 migrate: attributes => {
			return {
				 ...attributes,
				 titleShow: false,
			 }
		 },
		 save: withVersion( '3.6.1' )( Save ),
	 },
]

export default deprecated

