// TODO: Search and replace BLOCKSLUG with slug of block e.g. "heading"
/**
 * Internal dependencies
 */
import createStyles from './style'
import { showOptions } from './util'

/**
 * External dependencies
 */
import {
	ButtonEditHelper, BlockContainer, Image, DivBackground,
} from '~stackable/components'
import { withUniqueClass, withBlockStyles } from '~stackable/higher-order'
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
		design = 'basic',
		titleTag = '',
		title,
		description = '',
		showTitle = true,
		showDescription = true,
		showButton = true,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-BLOCKSLUG--v2',
		`ugb-BLOCKSLUG--design-${ design }`,
	], applyFilters( 'stackable.BLOCKSLUG.mainclasses', {
	}, props ) )

	const show = showOptions( props )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ /* TODO: add save markup */ }
				{ showTitle && ! RichText.isEmpty( title ) &&
					<RichText.Content
						tagName={ titleTag || 'h2' }
						className="ugb-BLOCKSLUG__title"
						value={ title }
					/>
				}
				{ showDescription && ! RichText.isEmpty( description ) &&
					<RichText.Content
						tagName="p"
						className="ugb-BLOCKSLUG__description"
						value={ description }
					/>
				}
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
