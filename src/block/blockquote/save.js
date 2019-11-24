/**
 * Internal dependencies
 */
import { QUOTE_ICONS } from './quotes'
import createStyles from './style'
import { showOptions } from './util'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { RichText } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'

/**
 * External dependencies
 */
import { BlockContainer, DivBackground } from '~stackable/components'
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'
import classnames from 'classnames'

const save = props => {
	const { className } = props

	const {
		blockTag = '',
		design = 'plain',
		shadow = '',
		text = '',
		showQuote = true,
		quoteIcon = 'round-thin',
		quoteSize = 70,
	} = props.attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		'ugb-blockquote--v3',
		`ugb-blockquote--design-${ design }`,
	], applyFilters( 'stackable.blockquote.mainclasses', {
		'ugb-blockquote--small-quote': quoteSize < 60,
	}, design, props ) )

	const itemClasses = classnames( [
		'ugb-blockquote__item',
	], {
		[ `ugb--shadow-${ shadow }` ]: show.containerBackground && shadow !== '',
	} )

	return (
		<BlockContainer.Save blockTag={ blockTag || 'blockquote' } className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<DivBackground
					className={ itemClasses }
					backgroundAttrName="container%s"
					blockProps={ props }
					showBackground={ show.containerBackground }
				>
					{ showQuote && QUOTE_ICONS[ quoteIcon ].iconFunc( {}, {
						className: 'ugb-blockquote__quote',
						width: quoteSize,
						height: quoteSize,
					} ) }
					<div className="ugb-blockquote__content">
						<RichText.Content
							tagName="p"
							className="ugb-blockquote__text"
							value={ text }
						/>
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
