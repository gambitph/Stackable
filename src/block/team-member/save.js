/**
 * Internal dependencies
 */
import { createStyles } from './style'
import { showOptions } from './util'

/**
 * External dependencies
 */
import {
	BlockContainer,
	Image,
	SocialButtonEditHelper,
	DivBackground,
} from '~stackable/components'
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'
import { SOCIAL_SITES } from '~stackable/util'
import classnames from 'classnames'
import { range, upperFirst } from 'lodash'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { RichText } from '@wordpress/block-editor'

const save = props => {
	const { className, attributes } = props

	const {
		columns = 2,
		design = 'basic',
		shadow = '',
		imageShape = '',
		imageShapeStretch = false,
		imageShadow = '',
		imageWidth = '',
		nameTag = 'h4',
		showImage = true,
		showName = true,
		showPosition = true,
		showDescription = true,
		showSocial = true,
		socialNewTab = false,
	} = attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		'ugb-team-member--v3',
		`ugb-team-member--design-${ design }`,
		`ugb-team-member--columns-${ columns }`,
	], applyFilters( 'stackable.team-member.mainclasses', {
	}, props ) )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ range( 1, columns + 1 ).map( i => {
					const imageUrl = attributes[ `image${ i }Url` ]
					const imageId = attributes[ `image${ i }Id` ]
					const imageAlt = attributes[ `image${ i }Alt` ]
					const name = attributes[ `name${ i }` ]
					const position = attributes[ `position${ i }` ]
					const description = attributes[ `description${ i }` ]

					const itemClasses = classnames( [
						'ugb-team-member__item',
						`ugb-team-member__item${ i }`,
					], applyFilters( 'stackable.team-member.itemclasses', {
						[ `ugb--shadow-${ shadow }` ]: show.columnBackground && shadow !== '',
					}, props ) )

					return (
						<DivBackground
							className={ itemClasses }
							backgroundAttrName="column%s"
							blockProps={ props }
							showBackground={ show.columnBackground }
							key={ i }
						>
							{ showImage && ! show.imageAsBackground && imageUrl &&
								<div className="ugb-team-member__image">
									<Image
										imageId={ imageId }
										src={ imageUrl }
										width={ imageWidth }
										alt={ imageAlt || ( showName && name ) }
										shadow={ imageShadow }
										shape={ attributes[ `image${ i }Shape` ] || imageShape }
										shapeStretch={ attributes[ `image${ i }ShapeStretch` ] || imageShapeStretch }
									/>
								</div>
							}
							{ show.imageAsBackground &&
								<div className="ugb-team-member__image"></div>
							}
							<div className="ugb-team-member__content">
								{ ( ( showName && ! RichText.isEmpty( name ) ) || ( showPosition && ! RichText.isEmpty( position ) ) ) &&
									<div className="ugb-team-member__title">
										{ showName && ! RichText.isEmpty( name ) &&
											<RichText.Content
												tagName={ nameTag || 'h4' }
												className="ugb-team-member__name"
												value={ name }
											/>
										}
										{ showPosition && ! RichText.isEmpty( position ) &&
											<RichText.Content
												tagName="p"
												className="ugb-team-member__position"
												value={ position }
											/>
										}
									</div>
								}
								{ showDescription && ! RichText.isEmpty( description ) &&
									<RichText.Content
										tagName="p"
										className="ugb-team-member__description"
										value={ description }
									/>
								}
								{ showSocial && show.social &&
									<div className="ugb-team-member__buttons">
										<SocialButtonEditHelper.Content
											attrNameTemplate={ `social%s` }
											blockAttributes={ props.attributes }
											newTab={ socialNewTab }
											// Pass the show* props
											{ ...Object.keys( SOCIAL_SITES ).reduce( ( propsToPass, socialId ) => {
												return {
													...propsToPass,
													[ `${ socialId }Url` ]: props.attributes[ `social${ i }${ upperFirst( socialId ) }Url` ],
													[ `show${ upperFirst( socialId ) }` ]: props.attributes[ `show${ upperFirst( socialId ) }` ],
												}
											}, {} ) }
										/>
									</div>
								}
							</div>
						</DivBackground>
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
