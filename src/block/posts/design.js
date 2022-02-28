/**
 * External dependencies
 */
import { compact } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// List Output
const list = ( output, style, attributes, comps ) => {
	if ( style !== 'list' ) {
		return output
	}

	const {
		contentOrder = [],
	} = attributes

	// If style is vertical, put the image wrapper outside of the article tag.
	const contents = contentOrder.map( key => {
		if ( key === 'featured-image' ) {
			return null
		}

		const comp = comps[ key ]
		return comp
	} )

	return (
		<>
			{ comps[ 'featured-image' ] }
			<article className="stk-container-padding">
				{ compact( contents ).map( content => content ) }
			</article>
		</>
	)
}

// Vertical 2
const invertedVertical = ( output, style, attributes, comps ) => {
	if ( style !== 'inverted-vertical' ) {
		return output
	}

	const {
		contentOrder = [],
	} = attributes

	// If style is vertical, put the image wrapper outside of the article tag.
	const contents = contentOrder.map( key => {
		if ( key === 'featured-image' ) {
			return null
		}

		const comp = comps[ key ]
		return comp
	} )

	return (
		<>
			<article className="stk-container-padding">
				{ compact( contents ).map( content => content ) }
			</article>
			{ comps[ 'featured-image' ] }
		</>
	)
}

addFilter( 'stackable.posts.edit.item.output', 'list', list )
addFilter( 'stackable.posts.save.item.output', 'list', list )
addFilter( 'stackable.posts.edit.item.output', 'invertedVertical', invertedVertical )
addFilter( 'stackable.posts.save.item.output', 'invertedVertical', invertedVertical )
