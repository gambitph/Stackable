import { applyFilters } from '@wordpress/hooks'
import { ButtonEdit } from '@stackable/components'
import classnames from 'classnames'
import { RichText } from '@wordpress/block-editor'

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
		backgroundColorType = '',
		backgroundColor,
		backgroundColor2,
		backgroundColorDirection = 0,
		backgroundType = '',
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

	const designHasBackground = design !== 'plain'

	const mainClasses = classnames( [
		className,
		'ugb-cta',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], applyFilters( 'stackable.cta.mainclasses', {
		[ `ugb-cta--design-${ design }` ]: design !== 'basic',
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
		'ugb--has-background': backgroundColor || backgroundImageURL,
		'ugb--has-background-image': backgroundImageURL,
		[ `ugb-content-width` ]: align === 'full' && contentWidth,
		[ `ugb--has-background-gradient` ]: designHasBackground && backgroundColorType === 'gradient',
		[ `ugb--has-background-video` ]: designHasBackground && backgroundType === 'video',
	}, design, props ) )

	const backgroundStyle = ! designHasBackground ? {} : {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		'--ugb-background-color': backgroundImageURL || backgroundColorType === 'gradient' ? backgroundColor : undefined,
		'--ugb-background-color2': backgroundColorType === 'gradient' && backgroundColor2 ? backgroundColor2 : undefined,
		'--ugb-background-direction': backgroundColorType === 'gradient' ? `${ backgroundColorDirection }deg` : undefined,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	const mainStyle = {
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		...backgroundStyle,
	}

	return (
		<div className={ mainClasses } style={ mainStyle }>
			{ designHasBackground && backgroundType === 'video' && (
				<video
					className="ugb-video-background"
					autoPlay
					muted
					loop
					src={ backgroundImageURL }
				/>
			) }
			{ applyFilters( 'stackable.cta.save.output.before', null, design, props ) }
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
			{ applyFilters( 'stackable.cta.save.output.after', null, design, props ) }
		</div>
	)
}

export default save
