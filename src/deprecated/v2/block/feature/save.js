/**
 * External dependencies
 */
import {
	BlockContainer,
} from '~stackable/components'
import {
	ButtonEdit, DivBackground, Image,
} from '../../components'
import {
	withUniqueClass, withBlockStyles,
} from '../../higher-order'
import classnames from 'classnames'
import striptags from 'striptags'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { RichText } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'

/**
 * Internal dependencies
 */
import createStyles from './style'
import { showOptions } from './util'

const save = props => {
	const {
		className,
	} = props

	const {
		title,
		design = 'basic',
		shadow = '',
		invert = false,
		showTitle = true,
		titleTag = '',
		showDescription = true,
		description = '',

		// Image.
		imageId = '',
		imageUrl = '',
		imageAlt = '',
		imageShape = '',
		imageHeight = '',
		imageShadow = '',
		imageShapeStretch = '',

		// Button.
		showButton = true,
		buttonUrl = '',
		buttonNewTab = false,
		buttonSize = 'normal',
		buttonText = '',
		buttonShadow = 0,
		buttonHoverEffect = '',
		buttonIcon = '',
		buttonIconPosition = '',
		buttonDesign = 'basic',
		buttonHoverGhostToNormal = false,
		buttonNoFollow = false,
		buttonSponsored = false,
		buttonUgc = false,
	} = props.attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		'ugb-feature--v2',
		`ugb-feature--design-${ design }`,
	], applyFilters( 'stackable.feature.mainclasses', {
		'ugb-feature--invert': show.reverseHorizontally && invert,
	}, design, props ) )

	const itemClasses = classnames( [
		'ugb-feature__item',
	], applyFilters( 'stackable.feature.itemclasses', {
		[ `ugb--shadow-${ shadow }` ]: show.columnBackground && ( design === 'basic' || design === 'half' ) && shadow !== '',
	}, props ) )

	const contentClasses = classnames( [
		'ugb-feature__content',
	], applyFilters( 'stackable.feature.contentclasses', {
		[ `ugb--shadow-${ shadow }` ]: show.columnBackground && design !== 'basic' && design !== 'half' && shadow !== '',
	}, props ) )

	const imageClasses = classnames( [
		'ugb-feature__image',
	], applyFilters( 'stackable.feature.imageclasses', {
		[ `ugb--shadow-${ imageShadow }` ]: show.columnBackground && design === 'plain' && imageShape === '',
		[ `ugb-feature__image-has-shape` ]: imageShape !== '',
	}, design, props ) )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<DivBackground
					className={ itemClasses }
					backgroundAttrName="column%s"
					blockProps={ props }
					showBackground={ show.columnBackground && design === 'basic' }
				>
					<DivBackground
						className={ contentClasses }
						backgroundAttrName="column%s"
						blockProps={ props }
						showBackground={ show.columnBackground && design !== 'basic' }
					>
						{ showTitle && ! RichText.isEmpty( title ) &&
							<RichText.Content
								tagName={ titleTag || 'h2' }
								className="ugb-feature__title"
								value={ title }
							/>
						}
						{ showDescription && ! RichText.isEmpty( description ) &&
							<RichText.Content
								tagName="p"
								className="ugb-feature__description"
								value={ description }
							/>
						}
						{ showButton && ! RichText.isEmpty( buttonText ) &&
							<ButtonEdit.Content
								size={ buttonSize !== '' ? buttonSize : 'normal' }
								text={ buttonText }
								icon={ buttonIcon }
								newTab={ buttonNewTab !== '' && buttonNewTab }
								url={ buttonUrl }
								noFollow={ buttonNoFollow }
								sponsored={ buttonSponsored }
								ugc={ buttonUgc }
								hoverEffect={ buttonHoverEffect }
								ghostToNormalEffect={ buttonHoverGhostToNormal }
								shadow={ buttonShadow }
								iconPosition={ buttonIconPosition }
								design={ buttonDesign !== '' ? buttonDesign : 'basic' }
							/>
						}
					</DivBackground>
					{ ! show.featuredImageAsBackground &&
						<div className="ugb-feature__image-side">
							<Image
								imageId={ imageId }
								className={ imageClasses }
								src={ imageUrl }
								height={ imageHeight }
								alt={ striptags( imageAlt ) }
								shape={ imageShape }
								shapeStretch={ imageShapeStretch }
								shadow={ imageShadow }
							/>
						</div>
					}
					{ show.featuredImageAsBackground &&
						<div
							className="ugb-feature__image"
							// style={ imageStyles }
						/>
					}
				</DivBackground>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
