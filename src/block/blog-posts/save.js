/**
 * External dependencies
 */
import { BlockContainer } from '~stackable/components'
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'
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

const save = props => {
	const { className, attributes } = props
	const {
		columns = 2,
		design = 'basic',
		categoryHighlighted = false,
		columnBackgroundColor = '',
		columnBackgroundColor2 = '',
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

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => null } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
