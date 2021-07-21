/**
 * Internal dependencies
 */
import createStyles from './style'
import { showOptions } from './util'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { BlockContainer } from '~stackable/components'
import {
	withBlockStyles, withUniqueClass,
} from '../../higher-order'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { InnerBlocks } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'

const save = props => {
	const { className } = props
	const {
		design = 'plain',
		columns = 3,
		reverseColumns = '',
		uniqueClass = '',
	} = props.attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		`ugb-columns--design-${ design }`,
		`ugb-columns--columns-${ columns }`,
	], applyFilters( 'stackable.columns.mainclasses', {
		'ugb-columns--reverse': show.reverseColumns && reverseColumns,
	}, props ) )

	const wrapperClasses = classnames( [
		'ugb-columns__item',
		`${ uniqueClass }-content-wrapper`,
	] )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<div className={ wrapperClasses }>
					<InnerBlocks.Content />
				</div>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
