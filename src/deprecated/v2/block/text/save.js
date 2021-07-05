/**
 * Internal dependencies
 */
import createStyles from './style'
import { showOptions } from './util'

/**
 * External dependencies
 */
import { BlockContainer } from '~stackable/components'
import {
	withUniqueClass, withBlockStyles,
} from '../../higher-order'
import classnames from 'classnames'
import { range } from 'lodash'

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
		title = '',
		showTitle = false,
		titleTag = '',
		showSubtitle = false,
		subtitle = '',
		showColumnRule = false,
		subtitleOnTop = false,
	} = attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		`ugb-text--design-${ design }`,
		`ugb-text--columns-${ columns }`,
	], applyFilters( 'stackable.text.mainclasses', {
		'ugb-text--reverse-title': show.reverseTitle && reverseTitle,
		'ugb-text--has-rule': showColumnRule,
		'ugb-text--subtitle-top': subtitleOnTop,
	}, props ) )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ ( ( showTitle && ! RichText.isEmpty( title ) ) || ( showSubtitle && ! RichText.isEmpty( subtitle ) ) ) &&
					<div className="ugb-text__title-wrapper">
						{ showTitle && ! RichText.isEmpty( title ) &&
							<RichText.Content
								tagName={ titleTag || 'h2' }
								className="ugb-text__title"
								value={ title }
							/>
						}
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
					{ range( columns || 1 ).map( i => {
						const index = i + 1
						return (
							<Fragment key={ i }>
								<div className="ugb-text__text">
									<RichText.Content
										tagName="p"
										className={ `ugb-text__text-${ index }` }
										value={ attributes[ `text${ index }` ] }
									/>
								</div>
								{ showColumnRule && i !== columns - 1 &&
									<div className={ `ugb-text__rule ugb-text__rule-${ index }` } role="presentation" />
								}
							</Fragment>
						)
					} ) }
				</div>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
