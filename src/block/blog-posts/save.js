/**
 * External dependencies
 */
import { BlockContainer, ButtonEditHelper } from '~stackable/components'
import {
	withBlockStyles, withUniqueClass,
} from '~stackable/higher-order'
import classnames from 'classnames'

/**
 * Internal dependencies
 */
import createStyles from './style'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'

const save = props => {
	const { className, attributes } = props
	const {
		uniqueClass = '',
		columns = 2,
		design = 'basic',
		categoryHighlighted = false,
		columnBackgroundColor = '',
		columnBackgroundColor2 = '',
		showLoadMoreButton = false,
		loadMoreItems = '',
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-blog-posts--v2',
		`ugb-blog-posts--design-${ design }`,
		`ugb-blog-posts--columns-${ columns }`,
	], applyFilters( 'stackable.blog-posts.mainclasses', {
		'ugb-blog-posts--cat-highlighted': categoryHighlighted,
		'ugb-blog-posts--has-bg-color': columnBackgroundColor || columnBackgroundColor2,
	}, props ) )

	const propsToPass = {}
	if ( showLoadMoreButton ) {
		propsToPass[ 'data-load-items' ] = loadMoreItems
		propsToPass[ 'data-id' ] = uniqueClass
	}

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } { ...propsToPass } render={ () => {
			return (
				<Fragment>
					{ showLoadMoreButton && (
						<ButtonEditHelper.Content
							className="ugb-blog-posts__load-more-button"
							attrNameTemplate={ `loadMoreButton%s` }
							blockAttributes={ props.attributes }
							url="#0"
							role="button"
						/>
					) }
				</Fragment>
			)
		} } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
