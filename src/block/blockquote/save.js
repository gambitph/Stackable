import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { QUOTE_ICONS } from './quotes'
import { RichText } from '@wordpress/block-editor'

const save = props => {
	const { className } = props
	const {
		color,
		text,
		quoteColor,
		backgroundColorType = '',
		backgroundColor,
		backgroundColor2,
		backgroundColorDirection = 0,
		backgroundType = '',
		backgroundImageURL,
		backgroundOpacity = 5,
		fixedBackground,
		quotationMark = 'round-thin',
		quotationSize = 70,
		align,
		contentWidth,
		design = 'plain',
		borderRadius = 12,
		shadow = 3,
	} = props.attributes

	const designHasBackground = [ 'basic', 'top-icon' ].includes( design )

	const mainClasses = classnames( [
		className,
		'ugb-blockquote',
		'ugb-blockquote--v2',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
		`ugb-blockquote--design-${ design }`,
	], applyFilters( 'stackable.blockquote.mainclasses', {
		'ugb--has-background': designHasBackground && ( backgroundColor || backgroundImageURL ),
		'ugb--has-background-image': designHasBackground && backgroundImageURL,
		[ `ugb--shadow-${ shadow }` ]: designHasBackground && shadow !== 3,
		[ `ugb-content-width` ]: align === 'full' && contentWidth,
		'ugb-blockquote--small-quote': quotationSize < 60,
		[ `ugb--has-background-gradient` ]: backgroundColorType === 'gradient',
		[ `ugb--has-background-video` ]: backgroundType === 'video',
	}, design, props ) )

	const basicStyles = ! designHasBackground ? {} : {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': backgroundImageURL || backgroundColorType === 'gradient' ? backgroundColor : undefined,
		'--ugb-background-color2': backgroundColorType === 'gradient' && backgroundColor2 ? backgroundColor2 : undefined,
		'--ugb-background-direction': backgroundColorType === 'gradient' ? `${ backgroundColorDirection }deg` : undefined,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	const styles = applyFilters( 'stackable.blockquote.styles', {
		main: {
			'--quote-color': quoteColor ? quoteColor : undefined,
			...basicStyles,
		},
		text: {
			color: color,
		},
	}, design, props )

	return (
		<blockquote
			className={ mainClasses }
			style={ styles.main }>
			{ designHasBackground && backgroundType === 'video' && (
				<video
					className="ugb-video-background"
					autoPlay
					muted
					loop
					src={ backgroundImageURL }
				/>
			) }
			{ applyFilters( 'stackable.blockquote.save.output.before', null, design, props ) }
			<div className="ugb-content-wrapper">
				{ QUOTE_ICONS[ quotationMark ].iconFunc( {
					fill: quoteColor,
					width: quotationSize,
					height: quotationSize,
				} ) }
				{ applyFilters( 'stackable.blockquote.save.output',
					<RichText.Content
						tagName="p"
						className="ugb-blockquote__text"
						style={ styles.text }
						value={ text }
					/>,
					design, props
				) }
			</div>
			{ applyFilters( 'stackable.blockquote.save.output.after', null, design, props ) }
		</blockquote>
	)
}

export default save
