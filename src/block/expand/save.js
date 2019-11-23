/**
 * Internal dependencies
 */
import createStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { BlockContainer } from '~stackable/components'
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { RichText } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'

const save = props => {
	const { className } = props
	const {
		showTitle = true,
		titleTag = 'h4',
		title = '',
		text,
		moreLabel,
		moreText,
		lessLabel,
		design = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-expand--v2',
	], applyFilters( 'stackable.expand.mainclasses', {}, design, props ) )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } aria-expanded="false" render={ () => (
			<Fragment>
				{ showTitle && ! RichText.isEmpty( title ) &&
					<RichText.Content
						tagName={ titleTag || 'h4' }
						className="ugb-expand__title"
						value={ title }
					/>
				}
				<div className="ugb-expand__less-text">
					{ ! RichText.isEmpty( text ) && (
						<RichText.Content
							multiline="p"
							value={ text }
						/>
					) }
				</div>
				<div className="ugb-expand__more-text" style={ { display: 'none' } }>
					{ ! RichText.isEmpty( moreText ) && (
						<RichText.Content
							multiline="p"
							value={ moreText }
						/>
					) }
				</div>
				<div className="ugb-expand__toggle-wrapper">
					{ /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
					<a className="ugb-expand__toggle" href="#">
						<RichText.Content
							className="ugb-expand__more-toggle-text"
							tagName="span"
							value={ moreLabel }
						/>
						<RichText.Content
							className="ugb-expand__less-toggle-text"
							tagName="span"
							value={ lessLabel }
							style={ { display: 'none' } }
						/>
					</a>
				</div>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
