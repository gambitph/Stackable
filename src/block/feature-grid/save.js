import { ButtonEdit } from '@stackable/components'
import classnames from 'classnames'
import { range } from '@stackable/util'
import { RichText } from '@wordpress/editor'
import striptags from 'striptags'

const save = props => {
	const { attributes, className } = props
	const {
		columns,
		imageSize,
		design,
		buttonColor,
		buttonTextColor,
		buttonSize,
		buttonBorderRadius,
		buttonDesign = 'link',
		buttonIcon,
		borderRadius = 12,
		shadow = 3,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-feature-grid',
		`ugb-feature-grid--columns-${ columns }`,
	], {
		[ `ugb-feature-grid--design-${ design }` ]: design && design !== 'basic',
	} )

	const itemClasses = classnames( [
		'ugb-feature-grid__item',
	], {
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	} )

	const itemStyle = {
		borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
	}

	return (
		<div className={ mainClasses }>
			{ range( 1, columns + 1 ).map( i => {
				const imageUrl = attributes[ `imageUrl${ i }` ]
				const title = attributes[ `title${ i }` ]
				const description = attributes[ `description${ i }` ]
				const linkUrl = attributes[ `linkUrl${ i }` ]
				const newTab = attributes[ `newTab${ i }` ]
				const linkText = attributes[ `linkText${ i }` ]
				return (
					<div className={ itemClasses } style={ itemStyle } key={ i }>
						{ imageUrl &&
							<div className="ugb-feature-grid__image">
								<img src={ imageUrl } style={ { width: `${ imageSize }%` } } alt={ striptags( title ) } />
							</div>
						}
						<div className="ugb-feature-grid__content">
							{ ! RichText.isEmpty( title ) && (
								<RichText.Content
									tagName="h5"
									className="ugb-feature-grid__title"
									value={ title }
								/>
							) }
							{ ! RichText.isEmpty( description ) && (
								<RichText.Content
									tagName="p"
									className="ugb-feature-grid__description"
									value={ description }
								/>
							) }
							{ ! RichText.isEmpty( linkText ) && (
								<ButtonEdit.Content
									size={ buttonSize }
									url={ linkUrl }
									newTab={ newTab }
									// align={ contentAlign }
									color={ buttonTextColor }
									text={ linkText }
									icon={ buttonIcon }
									design={ buttonDesign }
									backgroundColor={ buttonColor }
									borderRadius={ buttonBorderRadius }
								/>
							) }
						</div>
					</div>
				)
			} ) }
		</div>
	)
}

export default save
