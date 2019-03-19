import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { InnerBlocks } from '@wordpress/editor'

const save = props => {
	const {
		className,
	} = props

	const {
		contentAlign,
		textColor,
		backgroundColorType = '',
		backgroundColor,
		backgroundColor2,
		backgroundColorDirection = 0,
		backgroundType = '',
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
		height,
		contentLocation,
		verticalAlign,
		contentWidth,
		borderRadius = 12,
		shadow = 3,
		design = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-container',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], applyFilters( 'stackable.container.mainclasses', {
		[ `ugb-container--content-${ contentAlign }` ]: contentAlign,
		'ugb--has-background': ( backgroundColor && backgroundColor !== 'transparent' ) || backgroundImageURL,
		'ugb--has-background-image': backgroundImageURL,
		[ `ugb-container--height-${ height }` ]: height,
		[ `ugb-container--align-horizontal-${ contentLocation }` ]: contentLocation,
		[ `ugb--content-width` ]: contentWidth,
		[ `ugb--shadow-${ shadow }` ]: shadow !== 3,
		[ `ugb--has-background-gradient` ]: backgroundColorType === 'gradient',
		[ `ugb--has-background-video` ]: backgroundType === 'video',
	}, design, props ) )

	const mainStyle = {
		'--ugb-text-color': textColor ? textColor : undefined,
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': backgroundImageURL || backgroundColorType === 'gradient' ? backgroundColor : undefined,
		'--ugb-background-color2': backgroundColorType === 'gradient' && backgroundColor2 ? backgroundColor2 : undefined,
		'--ugb-background-direction': backgroundColorType === 'gradient' ? `${ backgroundColorDirection }deg` : undefined,
		'justify-content': ( height === 'full' || height === 'half' ) && verticalAlign ? verticalAlign : undefined,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	return (
		<div className={ mainClasses } style={ mainStyle }>
			{ backgroundType === 'video' && (
				<video
					className="ugb-video-background"
					autoPlay
					muted
					loop
					src={ backgroundImageURL }
				/>
			) }
			{ applyFilters( 'stackable.container.edit.output.before', null, design, props ) }
			<div className="ugb-container__wrapper">
				<div className="ugb-container__content-wrapper">
					<InnerBlocks.Content />
				</div>
			</div>
			{ applyFilters( 'stackable.container.edit.output.after', null, design, props ) }
		</div>
	)
}

export default save
