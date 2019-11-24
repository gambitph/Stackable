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
import { BlockContainer, DivBackground } from '~stackable/components'
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'

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
		shadow = '',
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
	], applyFilters( 'stackable.accordion.itemclasses', {}, props ) )

	const headingClasses = classnames( [
		'ugb-accordion__heading',
	], applyFilters( 'stackable.accordion.headingclasses', {
		[ `ugb--shadow-${ shadow }` ]: show.headerBackground && shadow !== '',
	}, design, props ) )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } aria-expanded={ openStart ? 'true' : 'false' } render={ () => (
			<Fragment>
				<DivBackground
					className={ itemClasses }
					backgroundAttrName="container%s"
					blockProps={ props }
					showBackground={ show.containerBackground }
				>
					<DivBackground
						className={ headingClasses }
						backgroundAttrName="container%s"
						blockProps={ props }
						showBackground={ show.headerBackground }
						role="button"
						tabIndex="0"
					>
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
					</DivBackground>
					<div className="ugb-accordion__content" role="region">
						<div className="ugb-accordion__content-inner">
							<InnerBlocks.Content />
						</div>
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
