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
	hasBackgroundOverlay,
	createVideoBackground,
} from '~stackable/util'
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
		design = '',
		shadow = 3,
		contentWidth = 100,
		restrictContentWidth = false,
	} = props.attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		'ugb-container--v2',
		`ugb-container--design-${ design }`,
	], applyFilters( 'stackable.container.mainclasses', {
		'ugb-container--width-small': contentWidth <= 50,
	}, props ) )

	const wrapperClasses = classnames( [
		'ugb-container__wrapper',
	], applyFilters( 'stackable.container.wrapperClasses', {
		[ `ugb--shadow-${ shadow }` ]: shadow !== 3,
		'ugb--has-background-overlay': show.columnBackground && hasBackgroundOverlay( 'column%s', props.attributes ),
		'ugb--restrict-content-width': show.restrictContent && restrictContentWidth,
	}, props ) )

	const contentWrapperClasses = classnames( [
		'ugb-container__content-wrapper',
	], {
		'ugb-content-wrapper': show.restrictContent && restrictContentWidth, // We need this for .ugb--restrict-content-width to work.
	} )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } aria-expanded="false" render={ () => (
			<Fragment>
				<div className={ wrapperClasses }>
					{ show.columnBackground && createVideoBackground( 'column%s', props ) }
					{ applyFilters( 'stackable.container.save.wrapper.output', null, props ) }
					<div className="ugb-container__side">
						<div className={ contentWrapperClasses }>
							<InnerBlocks.Content />
						</div>
					</div>
				</div>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
