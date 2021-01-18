/**
 * Internal dependencies
 */
import createStyles from './style'

/**
 * External dependencies
 */
import { BlockContainer } from '~stackable/components'
import { withUniqueClass, withBlockStyles } from '~stackable/higher-order'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { RichText } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'

const save = props => {
	const { attributes, className } = props

	const {
		titleTag = '',
		title,
		showTitle = true,
		showSubtitle = true,
		subtitle = '',
		showTopLine = false,
		showBottomLine = false,
	} = attributes

	const mainClasses = classnames( [
		className,
	], applyFilters( 'stackable.heading.mainclasses', {
	}, props ) )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ showTopLine && <div className="ugb-heading__top-line" /> }
				{ showTitle && ! RichText.isEmpty( title ) &&
					<RichText.Content
						tagName={ titleTag || 'h2' }
						className="ugb-heading__title"
						value={ title }
					/>
				}
				{ showSubtitle && ! RichText.isEmpty( subtitle ) &&
					<RichText.Content
						tagName="p"
						className="ugb-heading__subtitle"
						value={ subtitle }
					/>
				}
				{ showBottomLine && <div className="ugb-heading__bottom-line" /> }
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
