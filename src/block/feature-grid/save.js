/**
 * Internal dependencies
 */
import createStyles from './style'
import { showOptions } from './util'

/**
 * External dependencies
 */
import {
	ButtonEdit, BlockContainer, Image,
} from '~stackable/components'
import {
	range, hasBackgroundOverlay, createVideoBackground,
} from '~stackable/util'
import { withUniqueClass, withBlockStyles } from '~stackable/higher-order'
import { i18n } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { RichText } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'

const save = props => {
	const { attributes, className } = props

	const {
		design = 'basic',
		columns = 3,
		imageShape = '',
		imageShapeStretch = false,
		imageWidth = '',
		imageShadow = '',
		titleTag = '',
		shadow = 3,
		showImage = true,
		showTitle = true,
		showDescription = true,
		showButton = true,
		buttonSize = '',
		buttonIcon = '',
		buttonDesign = 'plain',
		buttonShadow = '',
		buttonHoverEffect = '',
		buttonHoverGhostToNormal = '',
		buttonIconPosition = '',
	} = attributes

	const mainClasses = classnames( [
		className,
		`ugb-feature-grid--v2`,
		`ugb-feature-grid--columns-${ columns }`,
		`ugb-feature-grid--design-${ design }`,
	], applyFilters( 'stackable.feature-grid.mainclasses', {
	}, props ) )

	const show = showOptions( props )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ range( 1, columns + 1 ).map( i => {
					const imageUrl = attributes[ `image${ i }Url` ]
					const imageId = attributes[ `image${ i }Id` ]
					const imageAlt = attributes[ `image${ i }Alt` ]
					const title = attributes[ `title${ i }` ]
					const description = attributes[ `description${ i }` ]
					const buttonText = attributes[ `button${ i }Text` ] || __( 'Button text', i18n )
					const buttonNewWindow = attributes[ `button${ i }NewWindow` ]
					const buttonUrl = attributes[ `button${ i }Url` ]
					const buttonNoFollow = attributes[ `button${ i }NoFollow` ]

					const itemClasses = classnames( [
						'ugb-feature-grid__item',
						`ugb-feature-grid__item${ i }`,
					], applyFilters( 'stackable.feature-grid.itemclasses', {
						'ugb--has-background-overlay': show.columnBackground && hasBackgroundOverlay( 'column%s', props.attributes ),
						[ `ugb--shadow-${ shadow }` ]: show.columnBackground && shadow !== 3,
					}, props, i ) )

					return (
						<div className={ itemClasses } key={ i }>
							{ show.columnBackground && createVideoBackground( 'column%s', props ) }
							{ imageUrl && showImage &&
								<div className="ugb-feature-grid__image">
									<Image
										imageId={ imageId }
										src={ imageUrl }
										width={ imageWidth }
										alt={ imageAlt || ( showTitle && title ) }
										shadow={ imageShadow }
										shape={ attributes[ `image${ i }Shape` ] || imageShape }
										shapeStretch={ imageShapeStretch }
									/>
								</div>
							}
							<div className="ugb-feature-grid__content">
								{ showTitle && ! RichText.isEmpty( title ) &&
									<RichText.Content
										tagName={ titleTag || 'h5' }
										className="ugb-feature-grid__title"
										value={ title }
									/>
								}
								{ showDescription && ! RichText.isEmpty( description ) &&
									<RichText.Content
										tagName="p"
										className="ugb-feature-grid__description"
										value={ description }
									/>
								}
								{ showButton && !! buttonText.length &&
									<ButtonEdit.Content
										size={ buttonSize !== '' ? buttonSize : 'normal' }
										text={ buttonText }
										icon={ buttonIcon }
										newTab={ buttonNewWindow !== '' && buttonNewWindow }
										url={ buttonUrl }
										noFollow={ buttonNoFollow }
										hoverEffect={ buttonHoverEffect }
										ghostToNormalEffect={ buttonHoverGhostToNormal }
										shadow={ buttonShadow }
										iconPosition={ buttonIconPosition }
										design={ buttonDesign !== '' ? buttonDesign : 'plain' }
									/>
								}
							</div>
						</div>
					)
				} ) }
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
