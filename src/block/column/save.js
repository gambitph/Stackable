/**
 * Internal dependencies
 */
import createStyles from './style'
// import { showOptions } from './util'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { BlockContainer, DivBackground } from '~stackable/components'
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'

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
		shadow = '',
		// contentWidth = 100,
		// restrictContentWidth = false,
		uniqueClass = '',
	} = props.attributes

	// const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		`ugb-column--design-${ design }`,
	], applyFilters( 'stackable.columns.mainclasses', {
	}, props ) )

	const itemClasses = classnames( [
		'ugb-column__item',
		`${ uniqueClass }-column-wrapper`,
	], applyFilters( 'stackable.column.itemclasses', {
		[ `ugb--shadow-${ shadow }` ]: shadow !== '',
	}, props ) )

	// const wrapperClasses = classnames( [
	// 	'ugb-container__wrapper',
	// 	`${ uniqueClass }-wrapper`,
	// ], applyFilters( 'stackable.container.wrapperClasses', {
	// 	[ `ugb--shadow-${ shadow }` ]: shadow !== '',
	// 	'ugb--restrict-content-width': show.restrictContent && restrictContentWidth,
	// }, props ) )

	// const contentWrapperClasses = classnames( [
	// 	'ugb-container__content-wrapper',
	// 	`${ uniqueClass }-content-wrapper`,
	// ], {
	// 	'ugb-content-wrapper': show.restrictContent && restrictContentWidth, // We need this for .ugb--restrict-content-width to work.
	// } )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<DivBackground
					className={ itemClasses }
					backgroundAttrName="column%s"
					blockProps={ props }
				>
					<div className="ugb-column__content-wrapper">
						<InnerBlocks.Content />
					</div>
				</DivBackground>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
