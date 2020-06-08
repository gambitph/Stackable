/**
 * Internal dependencies
 */
import createStyles from './style'
import { showOptions } from './util'

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
		columns = 1,
		design = 'plain',
		reverseTitle = false,
		text = '',
		title = '',
		showTitle = false,
		titleTag = '',
		showSubtitle = false,
		subtitle = '',
		showColumnRule = false,
	} = attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		`ugb-text--design-${ design }`,
		`ugb-text--columns-${ columns }`,
	], applyFilters( 'stackable.text.mainclasses', {
		'ugb-text--reverse-title': show.reverseTitle && reverseTitle,
		'ugb-text--has-rule': showColumnRule,
	}, props ) )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ showTitle && ! RichText.isEmpty( title ) &&
					<div className="ugb-text__title-wrapper">
						<RichText.Content
							tagName={ titleTag || 'h2' }
							className="ugb-text__title"
							value={ title }
						/>
						{ showSubtitle && ! RichText.isEmpty( subtitle ) &&
							<RichText.Content
								tagName="p"
								className="ugb-text__subtitle"
								value={ subtitle }
							/>
						}
					</div>
				}
				<div className="ugb-text__text-wrapper">
					<RichText.Content
						tagName="p"
						className="ugb-text__text"
						value={ text }
					/>
				</div>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
