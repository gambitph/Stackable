import { applyFilters } from '@wordpress/hooks'
import { ButtonEdit } from '@stackable/components'
import classnames from 'classnames'
import { RichText } from '@wordpress/block-editor'

const save = props => {
	const { className } = props
	const {
		buttonURL,
		buttonText,
		buttonColor,
		buttonTextColor,
		buttonDesign,
		buttonIcon,
		cornerButtonRadius,
		size,
		title,
		titleColor,
		subtitle,
		subtitleColor,
		contentAlign = 'center',
		backgroundColorType = '',
		backgroundColor,
		backgroundColor2,
		backgroundColorDirection = 0,
		backgroundType = '',
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
		design = 'basic',
		borderRadius = 12,
		shadow = 3,
		align,
		contentWidth = false,
		buttonNewTab,
		invert = false,
		fullHeight = false,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-header',
		'ugb-header--v2',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
		[ `ugb-header--design-${ design }` ],
	], applyFilters( 'stackable.header.mainclasses', {
		'ugb--has-background': design !== 'plain' &&
		                       ( backgroundColor || backgroundImageURL ),
		'ugb--has-background-image': design !== 'plain' &&
		                             backgroundImageURL,
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
		[ `ugb--content-width` ]: align === 'full' && contentWidth,
		'ugb-header--invert': invert,
		'ugb-header--full-height': fullHeight,
		[ `ugb--has-background-gradient` ]: backgroundColorType === 'gradient',
		[ `ugb--has-background-video` ]: backgroundType === 'video',
	}, design, props ) )

	const mainBackgroundStyles = design === 'plain' ? {} : {
		'--ugb-background-color': backgroundImageURL || backgroundColorType === 'gradient' ? backgroundColor : undefined,
		'--ugb-background-color2': backgroundColorType === 'gradient' && backgroundColor2 ? backgroundColor2 : undefined,
		'--ugb-background-direction': backgroundColorType === 'gradient' ? `${ backgroundColorDirection }deg` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	const styles = applyFilters( 'stackable.header.styles', {
		main: {
			textAlign: contentAlign ? contentAlign : undefined,
			...mainBackgroundStyles,
		},
		title: {
			color: titleColor ? titleColor :
				   design === 'plain' ? undefined :
				   '#ffffff',
			textAlign: contentAlign ? contentAlign : undefined,
		},
		subtitle: {
			color: subtitleColor ? subtitleColor :
				   design === 'plain' ? undefined :
				   '#ffffff',
			textAlign: contentAlign ? contentAlign : undefined,
		},
	}, design, props )

	return (
		<div className={ mainClasses } style={ styles.main }>
			{ design !== 'plain' && backgroundType === 'video' && (
				<video
					className="ugb-video-background"
					autoPlay
					muted
					loop
					src={ backgroundImageURL }
				/>
			) }
			{ applyFilters( 'stackable.header.save.output.before', null, design, props ) }
			{ ( () => {
				const titleComp = ! RichText.isEmpty( title ) && (
					<RichText.Content
						tagName="h2"
						className="ugb-header__title"
						style={ styles.title }
						value={ title }
					/>
				)
				const subtitleComp = ! RichText.isEmpty( subtitle ) && (
					<RichText.Content
						tagName="p"
						className="ugb-header__subtitle"
						style={ styles.subtitle }
						value={ subtitle }
					/>
				)
				const buttonComp = buttonText && !! buttonText.length && (
					<ButtonEdit.Content
						size={ size }
						url={ buttonURL }
						newTab={ buttonNewTab }
						align={ contentAlign }
						color={ buttonTextColor }
						text={ buttonText }
						design={ buttonDesign }
						icon={ buttonIcon }
						backgroundColor={ buttonColor }
						borderRadius={ cornerButtonRadius }
					/>
				)
				const comps = {
					titleComp,
					subtitleComp,
					buttonComp,
				}
				return applyFilters( 'stackable.header.save.output', (
					<div className="ugb-content-wrapper">
						{ titleComp }
						{ subtitleComp }
						{ buttonComp }
					</div>
				), design, props, comps )
			} )() }
			{ applyFilters( 'stackable.header.save.output.after', null, design, props ) }
		</div>
	)
}

export default save
