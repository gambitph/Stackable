import { ButtonEdit } from '@stackable/components'
import classnames from 'classnames'
import { RichText } from '@wordpress/editor'
import striptags from 'striptags'

const save = props => {
	const {
		className,
	} = props

	const {
		invert,
		contentAlign,
		textColor,
		imageSize,
		imageUrl,
		title,
		description,
		buttonURL,
		buttonNewTab,
		buttonText,
		buttonColor,
		buttonTextColor,
		buttonSize,
		buttonBorderRadius,
		buttonDesign,
		buttonIcon,
		backgroundColor,
		backgroundImageURL,
		backgroundOpacity = 5,
		fixedBackground,
		contentWidth,
		align,
		design = 'plain',
		borderRadius = 12,
		shadow = 3,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-feature',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
		`ugb-feature--design-${ design }`,
	], {
		[ `ugb-feature--content-${ contentAlign }` ]: contentAlign,
		'ugb-feature--invert': invert,
		'ugb--has-background': design !== 'plain' && ( backgroundColor || backgroundImageURL ),
		'ugb--has-background-image': design !== 'plain' && backgroundImageURL,
		[ `ugb--content-width` ]: align === 'full' && contentWidth,
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	} )

	const mainStyle = {
		'--image-size': imageSize ? `${ imageSize }px` : undefined,
		backgroundColor: design !== 'plain' && backgroundColor ? backgroundColor : undefined,
		backgroundImage: design !== 'plain' && backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: design !== 'plain' && fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': design !== 'plain' && backgroundImageURL ? backgroundColor : undefined,
		borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
	}

	const imageClasses = classnames( [
		'ugb-feature__image',
	], {
		[ `ugb--shadow-${ shadow }` ]: design === 'plain',
	} )

	const imageStyle = {
		borderRadius: design === 'plain' ? borderRadius : undefined,
	}

	return (
		<div className={ mainClasses } style={ mainStyle }>
			<div className="ugb-content-wrapper">
				<div className="ugb-feature__content">
					{ ! RichText.isEmpty( title ) && (
						<RichText.Content
							tagName="h2"
							className="ugb-feature__title"
							style={ { color: textColor } }
							value={ title }
						/>
					) }
					{ ! RichText.isEmpty( description ) && (
						<RichText.Content
							tagName="p"
							className="ugb-feature__description"
							style={ { color: textColor } }
							value={ description }
						/>
					) }
					{ ! RichText.isEmpty( buttonText ) && (
						<ButtonEdit.Content
							size={ buttonSize }
							url={ buttonURL }
							newTab={ buttonNewTab }
							align={ contentAlign }
							color={ buttonTextColor }
							text={ buttonText }
							icon={ buttonIcon }
							design={ buttonDesign }
							backgroundColor={ buttonColor }
							borderRadius={ buttonBorderRadius }
						/>
					) }
				</div>
				<div className="ugb-feature__image-side">
					{ imageUrl && (
						<img
							className={ imageClasses }
							style={ imageStyle }
							src={ imageUrl }
							alt={ striptags( title ) }
						/>
					) }
				</div>
			</div>
		</div>
	)
}

export default save
