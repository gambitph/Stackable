import classnames from 'classnames'
import { range } from '@stackable/util'
import { RichText } from '@wordpress/editor'

const save = props => {
	const { className, attributes } = props
	const {
		titleColor,
		subtitleColor,
		overlayColor,
		height,
		width,
		verticalAlign,
		horizontalAlign,
		align,
		columns,
		// design = 'basic',
		borderRadius = 12,
		shadow = 3,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-image-box',
		'ugb-image-box--v3',
		`ugb-image-box--columns-${ columns }`,
	] )

	const mainStyles = {
		textAlign: horizontalAlign ? horizontalAlign : undefined,
		'--overlay-color': overlayColor,
	}

	return (
		<div className={ mainClasses } style={ mainStyles }>
			{ range( 1, columns + 1 ).map( i => {
				const imageURL = attributes[ `imageURL${ i }` ]
				const title = attributes[ `title${ i }` ]
				const description = attributes[ `description${ i }` ]
				const link = attributes[ `link${ i }` ]
				const newTab = attributes[ `newTab${ i }` ]

				const boxStyles = {
					backgroundImage: imageURL ? `url(${ imageURL })` : undefined,
					maxWidth: align !== 'wide' && align !== 'full' && columns === 1 ? width : undefined,
					height: height,
					textAlign: horizontalAlign,
					justifyContent: verticalAlign,
					borderRadius: borderRadius,
				}

				const boxClasses = classnames( [
					'ugb-image-box__item',
				], {
					[ `ugb--shadow-${ shadow }` ]: shadow !== 3,
				} )

				return (
					<div className={ boxClasses } style={ boxStyles } key={ i }>
						{ /* eslint-disable-next-line */ }
						<a
							className="ugb-image-box__overlay"
							href={ link }
							target={ newTab ? '_blank' : undefined }
						/>
						<div className="ugb-image-box__content">
							{ ! RichText.isEmpty( title ) && (
								<RichText.Content
									tagName="h4"
									className="ugb-image-box__title"
									style={ { color: titleColor } }
									value={ title }
								/>
							) }
							{ ! RichText.isEmpty( description ) && (
								<RichText.Content
									tagName="p"
									className="ugb-image-box__description"
									style={ { color: subtitleColor } }
									value={ description }
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
