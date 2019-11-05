/**
 * Internal dependencies
 */
import createStyles from './style'
import { showOptions } from './util'
import SVGArrowIcon from './images/arrow.svg'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { BlockContainer } from '~stackable/components'
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'
import { createVideoBackground, hasBackgroundOverlay } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { InnerBlocks, RichText } from '@wordpress/block-editor'
import { applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'

// Accessibility: https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html
const save = props => {
	const { className } = props
	const {
		design = 'basic',
		shadow = 3,
		titleTag = '',
		title = '',
		openStart = false,
		showArrow = true,
		onlyOnePanelOpen = false,
	} = props.attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		'ugb-accordion--v2',
		`ugb-accordion--design-${ design }`,
	], applyFilters( 'stackable.accordion.mainclasses', {
		'ugb-accordion--open': openStart,
		'ugb-accordion--single-open': onlyOnePanelOpen,
	}, props ) )

	const itemClasses = classnames( [
		'ugb-accordion__item',
	], applyFilters( 'stackable.accordion.itemclasses', {
		'ugb--has-background-overlay': show.containerBackground && hasBackgroundOverlay( 'container%s', props.attributes ),
	}, props ) )

	const headingClasses = classnames( [
		'ugb-accordion__heading',
	], applyFilters( 'stackable.accordion.headingclasses', {
		[ `ugb--shadow-${ shadow }` ]: show.headerBackground && shadow !== 3,
		'ugb--has-background-overlay': show.headerBackground && hasBackgroundOverlay( 'container%s', props.attributes ),
	}, design, props ) )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } aria-expanded={ openStart ? 'true' : 'false' } render={ () => (
			<Fragment>
				<div className={ itemClasses }>
					{ show.containerBackground && createVideoBackground( 'container%s', props ) }
					<div className={ headingClasses }
						role="button"
						tabIndex="0"
					>
						{ show.headerBackground && createVideoBackground( 'container%s', props ) }
						<RichText.Content
							tagName={ titleTag || 'h4' }
							className="ugb-accordion__title"
							role="heading"
							aria-level="3"
							value={ title }
						/>
						{ showArrow &&
							<SVGArrowIcon className="ugb-accordion__arrow" width="20" height="20" />
						}
					</div>
					<div className="ugb-accordion__content" role="region">
						<div className="ugb-accordion__content-inner">
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
