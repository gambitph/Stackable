import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { getFontFamily } from './font'
import { range } from '@stackable/util'
import { RichText } from '@wordpress/block-editor'

const save = props => {
	const { className, attributes } = props
	const {
		columns,
		backgroundColorType = '',
		backgroundColor,
		backgroundColor2,
		backgroundColorDirection = 0,
		backgroundType = '',
		backgroundImageURL,
		fixedBackground,
		backgroundOpacity = 5,
		textColor,
		countColor,
		countSize,
		contentWidth,
		design = 'plain',
		align,
		borderRadius = 12,
		shadow = 3,
		countFont,
		countFontWeight,
	} = attributes

	const show = applyFilters( 'stackable.count-up.edit.show', {
		background: design !== 'plain',
	}, design, props )

	const designHasBackground = design === 'basic'

	const mainClasses = classnames( [
		className,
		'ugb-countup',
		'ugb-countup--v3', // For backward compatibility.
		`ugb-countup--columns-${ columns }`,
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], applyFilters( 'stackable.count-up.mainclasses', {
		// 'ugb-has-background': backgroundColor || backgroundImageURL,
		'ugb--has-background-image': backgroundImageURL,
		[ `ugb--content-width` ]: align === 'full' && contentWidth,
		[ `ugb-countup--design-${ design }` ]: design !== 'plain',
		[ `ugb--shadow-${ shadow }` ]: design === 'basic' && shadow !== 3,
		[ `ugb--has-background-gradient` ]: design === 'basic' && backgroundColorType === 'gradient',
		[ `ugb--has-background-video` ]: design === 'basic' && backgroundType === 'video',
	}, design, props ) )

	const backgroundStyle = ! designHasBackground ? {} : {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		'--ugb-background-color': backgroundImageURL || backgroundColorType === 'gradient' ? backgroundColor : undefined,
		'--ugb-background-color2': backgroundColorType === 'gradient' && backgroundColor2 ? backgroundColor2 : undefined,
		'--ugb-background-direction': backgroundColorType === 'gradient' ? `${ backgroundColorDirection }deg` : undefined,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	const mainStyle = applyFilters( 'stackable.count-up.mainstyle', {
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		...backgroundStyle,
	}, design, props )

	const countStyle = {
		color: countColor ? countColor : undefined,
		fontSize: countSize ? countSize + 'px' : undefined,
		// fontFamily: countFont && countFont !== 'theme' ? getFontFamily( countFont ) : undefined,
		fontWeight: countFontWeight ? countFontWeight : undefined,
	}
	if ( countFont && countFont !== 'theme' ) {
		countStyle.fontFamily = getFontFamily( countFont )
	}

	return (
		<div className={ mainClasses } style={ mainStyle }>
			{ show.background && backgroundType === 'video' && (
				<video
					className="ugb-video-background"
					autoPlay
					muted
					loop
					src={ backgroundImageURL }
				/>
			) }
			{ applyFilters( 'stackable.count-up.save.output.before', null, design, props ) }
			<div className="ugb-content-wrapper">
				{ range( 1, columns + 1 ).map( i => {
					const title = attributes[ `title${ i }` ]
					const description = attributes[ `description${ i }` ]
					const countText = attributes[ `countText${ i }` ]

					const titleComp = ! RichText.isEmpty( title ) && (
						<RichText.Content
							tagName="h4"
							className="ugb-countup__title"
							style={ { color: textColor ? textColor : undefined } }
							value={ title }
						/>
					)
					const countComp = ! RichText.isEmpty( countText ) && (
						<RichText.Content
							tagName="div"
							className="ugb-countup__counter"
							style={ countStyle }
							value={ countText }
							data-duration="1000"
							data-delay="16"
						/>
					)
					const descriptionComp = ! RichText.isEmpty( description ) && (
						<RichText.Content
							tagName="p"
							className="ugb-countup__description"
							style={ { color: textColor ? textColor : undefined } }
							value={ description }
						/>
					)
					const comps = {
						i,
						titleComp,
						countComp,
						descriptionComp,
					}
					return applyFilters( 'stackable.count-up.save.output', (
						<div className="ugb-countup__item" key={ i }>
							{ titleComp }
							{ countComp }
							{ descriptionComp }
						</div>
					), comps, i, props )
				} ) }
			</div>
			{ applyFilters( 'stackable.count-up.save.output.after', null, design, props ) }
		</div>
	)
}

export default save
