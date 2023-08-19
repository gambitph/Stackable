/**
 * External dependencies
 */
import { compact } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'

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
				{ compact( contents ).map( ( content, i ) => <Fragment key={ i }>{ content }</Fragment> ) }
			</article>
		</>
	)
}

addFilter( 'stackable.posts.edit.item.output', 'list', list )
addFilter( 'stackable.posts.save.item.output', 'list', list )
