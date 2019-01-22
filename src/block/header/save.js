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
		contentAlign,
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
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-header',
		'ugb-header--v2',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
		[ `ugb-header--design-${ design }` ],
	], {
		'ugb--has-background': design !== 'plain' &&
		                       ( backgroundColor || backgroundImageURL ),
		'ugb--has-background-image': design !== 'plain' &&
		                             backgroundImageURL,
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
		[ `ugb--content-width` ]: align === 'full' && contentWidth,
	} )

	const mainStyle = {
		'--ugb-background-color': design !== 'plain' && backgroundImageURL ? backgroundColor : undefined,
		backgroundAttachment: design !== 'plain' && fixedBackground ? 'fixed' : undefined,
		backgroundColor: design !== 'plain' && backgroundColor ? backgroundColor : undefined,
		backgroundImage: design !== 'plain' && backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
		textAlign: contentAlign ? contentAlign : undefined,
	}

	return (
		<div className={ mainClasses } style={ mainStyle }>
			<div className="ugb-content-wrapper">
				{ ! RichText.isEmpty( title ) && (
					<RichText.Content
						tagName="h2"
						className="ugb-header__title"
						style={ {
							color: titleColor ? titleColor :
							       design === 'plain' ? undefined : '#ffffff',
						} }
						value={ title }
					/>
				) }
				{ ! RichText.isEmpty( subtitle ) && (
					<RichText.Content
						tagName="p"
						className="ugb-header__subtitle"
						style={ {
							color: subtitleColor ? subtitleColor :
							       design === 'plain' ? undefined : '#ffffff',
						} }
						value={ subtitle }
					/>
				) }
				{ buttonText && !! buttonText.length && (
					<ButtonEdit.Content
						size={ size }
						url={ buttonURL }
						buttonNewTab={ buttonNewTab }
						align={ contentAlign }
						color={ buttonTextColor }
						text={ buttonText }
						design={ buttonDesign }
						icon={ buttonIcon }
						backgroundColor={ buttonColor }
						borderRadius={ cornerButtonRadius }
					/>
				) }
			</div>
		</div>
	)
}

export default save
