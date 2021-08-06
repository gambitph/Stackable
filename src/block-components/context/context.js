/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { uniqBy } from 'lodash'

/**
 * WordPress dependencies
 */
import {
	addFilter, hasFilter,
} from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'

/**
 * Register our own context factory.
 */
if ( ! hasFilter( 'stackable.block-components.context', 'stackable/default-context' ) ) {
	const addAvailableContextValues = ( availableContext = [], context ) => {
		const newAvailableContext = []

		if ( context.postId ) {
			newAvailableContext.push( {
				label: __( 'Post Title', i18n ),
				value: 'postTitle',
				callback( select ) {
					return select( 'core' ).getEntityRecord( 'postType', 'post', context.postId )?.title?.rendered
				},
			} )
		}

		return uniqBy( [ ...availableContext, ...newAvailableContext ], 'value' )
	}

	addFilter( 'stackable.block-components.context', 'stackable/default-context', addAvailableContextValues )
}
