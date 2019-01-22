import { ButtonEdit } from '@stackable/components'
import classnames from 'classnames'
import { RichText } from '@wordpress/editor'

const save = props => {
	const { className } = props
	const {
		url,
		buttonText,
		ctaTitle,
		bodyText,
		color,
		textColor,
		size,
		borderButtonRadius,
		bodyTextColor,
		titleColor,
		backgroundColor,
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
		buttonDesign,
		buttonIcon,
		design = 'basic',
		borderRadius = 12,
		shadow = 3,
		align,
		contentWidth,
		newTab,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-cta',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], {
		[ `ugb-cta--design-${ design }` ]: design !== 'basic',
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
		'ugb--has-background': backgroundColor || backgroundImageURL,
		'ugb--has-background-image': backgroundImageURL,
		[ `ugb--content-width` ]: align === 'full' && contentWidth,
	} )

	const mainStyle = {
		backgroundColor: design !== 'plain' && backgroundColor ? backgroundColor : undefined,
		backgroundImage: design !== 'plain' && backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': design !== 'plain' && backgroundImageURL ? backgroundColor : undefined,
		borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
	}

	return (
		<div className={ mainClasses } style={ mainStyle }>
			<div className="ugb-content-wrapper">
				{ ctaTitle && !! ctaTitle.length && (
					<RichText.Content
						tagName="h3"
						className="ugb-cta__title"
						style={ { color: titleColor } }
						value={ ctaTitle }
					/>
				) }
				{ bodyText && !! bodyText.length && (
					<RichText.Content
						tagName="p"
						className="ugb-cta__description"
						style={ { color: bodyTextColor } }
						value={ bodyText }
					/>
				) }
				{ buttonText && !! buttonText.length && (
					<ButtonEdit.Content
						size={ size }
						url={ url }
						color={ textColor }
						text={ buttonText }
						design={ buttonDesign }
						icon={ buttonIcon }
						backgroundColor={ color }
						borderRadius={ borderButtonRadius }
						newTab={ newTab }
					/>
				) }
			</div>
		</div>
	)
}

export default save
