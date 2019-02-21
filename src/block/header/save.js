import { applyFilters } from '@wordpress/hooks'
import { ButtonEdit } from '@stackable/components'
import classnames from 'classnames'
import { RichText } from '@wordpress/editor'

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
		backgroundColor,
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
	}, design, props ) )

	const styles = applyFilters( 'stackable.header.styles', {
		main: {
			'--ugb-background-color': design !== 'plain' && backgroundImageURL ? backgroundColor : undefined,
			backgroundAttachment: design !== 'plain' && fixedBackground ? 'fixed' : undefined,
			backgroundColor: design !== 'plain' && backgroundColor ? backgroundColor : undefined,
			backgroundImage: design !== 'plain' && backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
			borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
			textAlign: contentAlign ? contentAlign : undefined,
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
		</div>
	)
}

export default save
