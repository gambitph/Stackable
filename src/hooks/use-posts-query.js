/**
 * External dependencies
 */
import {
	pickBy, isEmpty, isUndefined,
} from 'lodash'
/**
 * WordPress dependencies
 */
import { addQueryArgs } from '@wordpress/url'
import apiFetch from '@wordpress/api-fetch'
import { applyFilters } from '@wordpress/hooks'
import {
	useMemo, useState, useEffect,
} from '@wordpress/element'

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
		excerptLength,
	} = attributes

	const [ isRequesting, setIsRequesting ] = useState( true )
	const [ posts, setPosts ] = useState( null )

	const postQuery = useMemo( () => {
		setIsRequesting( true )
		const postQuery = pickBy( {
			...applyFilters( 'stackable.posts.postQuery', {
				order,
				orderby: [ orderBy, 'ID' ].join( ' ' ),
				posts_per_page: numberOfItems, // eslint-disable-line camelcase
				max_excerpt: excerptLength, // eslint-disable-line camelcase
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
			const _taxonomy = taxonomy.split( ',' ).map( s => parseInt( s, 10 ) ).filter( i => ! isNaN( i ) )
			// Categories.
			if ( taxonomyType === 'category' ) {
				postQuery[ taxonomyFilterType === '__in' ? 'category__in' : 'category__not_in' ] = _taxonomy
				// Tags.
			} else if ( taxonomyType === 'post_tag' ) {
				postQuery[ taxonomyFilterType === '__in' ? 'tag__in' : 'tag__not_in' ] = _taxonomy
				// Custom taxonomies.
			} else {
				postQuery.tax_query = [ { // eslint-disable-line camelcase
					taxonomy: taxonomyType,
					terms: _taxonomy,
					operator: taxonomyFilterType === '__in' ? 'IN' : 'NOT IN',
				} ]
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

	useEffect( () => {
		apiFetch( {
			// eslint-disable-next-line camelcase
			path: addQueryArgs( `/stackable/v3/get_posts`, { post_type: type, ...postQuery } ),
			method: 'GET',
		} ).then( _posts => {
			setPosts( _posts )
			setIsRequesting( false )
		} )
	}, [ postQuery ] )

	return {
		posts,
		hasPosts: Array.isArray( posts ) && !! posts.length,
		isRequesting,
	}
}
