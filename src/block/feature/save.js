import { applyFilters } from '@wordpress/hooks'
import { ButtonEdit } from '@stackable/components'
import classnames from 'classnames'
import { RichText } from '@wordpress/block-editor'
import striptags from 'striptags'

const save = props => {
	const {
		className,
	} = props

	const {
		invert,
		contentAlign,
		textColor,
		imageAlt = '',
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
		backgroundColorType = '',
		backgroundColor,
		backgroundColor2,
		backgroundColorDirection = 0,
		backgroundType = '',
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
	], applyFilters( 'stackable.feature.mainclasses', {
		[ `ugb-feature--content-${ contentAlign }` ]: contentAlign,
		'ugb-feature--invert': invert,
		'ugb--has-background': design !== 'plain' && ( backgroundColor || backgroundImageURL ),
		'ugb--has-background-image': design !== 'plain' && backgroundImageURL,
		[ `ugb--content-width` ]: align === 'full' && contentWidth,
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
		[ `ugb--has-background-gradient` ]: design !== 'plain' && backgroundColorType === 'gradient',
		[ `ugb--has-background-video` ]: design !== 'plain' && backgroundType === 'video',
	}, design, props ) )

	const imageClasses = classnames( [
		'ugb-feature__image',
	], applyFilters( 'stackable.feature.imageclasses', {
		[ `ugb--shadow-${ shadow }` ]: design === 'plain',
	}, design, props ) )

	const backgroundStyles = design === 'plain' ? {} : {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': backgroundImageURL || backgroundColorType === 'gradient' ? backgroundColor : undefined,
		'--ugb-background-color2': backgroundColorType === 'gradient' && backgroundColor2 ? backgroundColor2 : undefined,
		'--ugb-background-direction': backgroundColorType === 'gradient' ? `${ backgroundColorDirection }deg` : undefined,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	const styles = applyFilters( 'stackable.feature.styles', {
		main: {
			'--image-size': imageSize ? `${ imageSize }px` : undefined,
			...backgroundStyles,
		},
		image: {
			borderRadius: design === 'plain' ? borderRadius : undefined,
		},
	}, design, props )

	const titleComp = ! RichText.isEmpty( title ) && (
		<RichText.Content
			tagName="h2"
			className="ugb-feature__title"
			style={ { color: textColor } }
			value={ title }
		/>
	)
	const descriptionComp = ! RichText.isEmpty( description ) && (
		<RichText.Content
			tagName="p"
			className="ugb-feature__description"
			style={ { color: textColor } }
			value={ description }
		/>
	)
	const buttonComp = ! RichText.isEmpty( buttonText ) && (
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
	)
	const imageComp = imageUrl && (
		<img
			className={ imageClasses }
			style={ styles.image }
			src={ imageUrl }
			alt={ striptags( title ? title : imageAlt ) }
		/>
	)
	const comps = {
		titleComp,
		descriptionComp,
		buttonComp,
		imageComp,
	}

	return (
		<div className={ mainClasses } style={ styles.main }>
			{ design === 'basic' && backgroundType === 'video' && (
				<video
					className="ugb-video-background"
					autoPlay
					muted
					loop
					src={ backgroundImageURL }
				/>
			) }
			{ applyFilters( 'stackable.feature.save.output.before', null, design, props ) }
			{ applyFilters( 'stackable.feature.save.output', (
				<div className="ugb-content-wrapper">
					<div className="ugb-feature__content">
						{ titleComp }
						{ descriptionComp }
						{ buttonComp }
					</div>
					<div className="ugb-feature__image-side">
						{ imageComp }
					</div>
				</div>
			), comps, props ) }
			{ applyFilters( 'stackable.feature.save.output.after', null, design, props ) }
		</div>
	)
}

export default save
