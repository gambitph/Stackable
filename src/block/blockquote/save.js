import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { QUOTE_ICONS } from './quotes'
import { RichText } from '@wordpress/editor'

const save = props => {
	const { className } = props
	const {
		color,
		text,
		quoteColor,
		backgroundColor,
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
	}, design, props ) )

	const styles = applyFilters( 'stackable.blockquote.styles', {
		main: {
			'--quote-color': quoteColor ? quoteColor : undefined,
			backgroundColor: designHasBackground && backgroundColor ? backgroundColor : undefined,
			backgroundImage: designHasBackground && backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
			backgroundAttachment: designHasBackground && fixedBackground ? 'fixed' : undefined,
			'--ugb-background-color': designHasBackground && backgroundImageURL ? backgroundColor : undefined,
			borderRadius: designHasBackground && borderRadius !== 12 ? borderRadius : undefined,
		},
		text: {
			color: color,
		},
	}, design, props )

	return (
		<blockquote
			className={ mainClasses }
			style={ styles.main }>
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
		</blockquote>
	)
}

export default save
