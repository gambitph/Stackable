/**
 * External dependencies
 */
import {
	pickBy, isEmpty, isUndefined, uniqBy,
} from 'lodash'
/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data'
import { applyFilters } from '@wordpress/hooks'
import { useMemo } from '@wordpress/element'

/**
 * Custom hook for getting posts
 *
 * @param {Object} attributes
 * @return {Array} posts
 */
export const usePostsQuery = attributes => {
	const {
		type,
		orderBy,
		order,
		taxonomyType,
		taxonomy,
		taxonomyFilterType,
		postOffset,
		postExclude,
		postInclude,
		numberOfItems = 6,
		excludeCurrentPost,
	} = attributes

	const postQuery = useMemo( () => {
		const postQuery = pickBy( {
			...applyFilters( 'stackable.posts.postQuery', {
				order,
				orderby: orderBy,
				per_page: numberOfItems, // eslint-disable-line camelcase
			}, attributes ),
		}, value => {
			// Exludes and includes can be empty.
			if ( Array.isArray( value ) ) {
				return ! isEmpty( value )
			}
			// Don't include empty values.
			return ! isUndefined( value ) && value !== ''
		} )

		if ( taxonomy && taxonomyType ) {
			// Categories.
			if ( taxonomyType === 'category' ) {
				postQuery[ taxonomyFilterType === '__in' ? 'categories' : 'categories_exclude' ] = taxonomy
				// Tags.
			} else if ( taxonomyType === 'post_tag' ) {
				postQuery[ taxonomyFilterType === '__in' ? 'tags' : 'tags_exclude' ] = taxonomy
				// Custom taxonomies.
			} else {
				postQuery[ taxonomyFilterType === '__in' ? taxonomyType : `${ taxonomyType }_exclude` ] = taxonomy
			}
		}

		return postQuery
	}, [
		type,
		orderBy,
		order,
		taxonomyType,
		taxonomy,
		taxonomyFilterType,
		postOffset,
		postExclude,
		postInclude,
		numberOfItems,
		excludeCurrentPost,
	] )

	// Only subscribe to resolution changes. This will avoid unneccessary rerenders.
	const isRequesting = useSelect( select => {
		return ! select( 'core' ).hasFinishedResolution( 'getEntityRecords', [
			'postType',
			type,
			postQuery,
		] )
	}, [ postQuery ] )

	const getEntityRecords = useSelect( select => select( 'core' ).getEntityRecords )
	const posts = useMemo( () => {
		const posts = getEntityRecords( 'postType', type, postQuery )
		return ! Array.isArray( posts ) ? posts : uniqBy( posts, 'id' )
	},
	[
		getEntityRecords,
		isRequesting,
		postQuery,
	] )

	return {
		posts,
		hasPosts: Array.isArray( posts ) && !! posts.length,
		isRequesting,
	}
}
