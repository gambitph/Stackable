import { addFilter } from '@wordpress/hooks'

addFilter( 'stackable.designs.blog-posts.edit', 'core/designs', ( ret, design, props ) => {
	const {
		i, category, featuredImage, author, date, comments, title, excerpt, readMore,
	} = props
	const {
		displayDate, displayAuthor, displayComments,
	} = props.attributes

	if ( design === 'list' ) {
		return (
			<article key={ i } className="ugb-blog-posts__item">
				{ featuredImage }
				<div className="ugb-blog-posts__side">
					{ category }
					{ title }
					{ ( displayDate || displayAuthor || displayComments ) &&
					<aside className="entry-meta ugb-blog-posts__meta">
						{ author }
						{ displayAuthor && ( displayDate || displayComments ) &&
							<span className="ugb-blog-posts__sep">&middot;</span>
						}
						{ date }
						{ displayDate && displayComments &&
							<span className="ugb-blog-posts__sep">&middot;</span>
						}
						{ comments }
					</aside>
					}
					{ excerpt }
					{ readMore }
				</div>
			</article>
		)
	}

	return ret
} )
