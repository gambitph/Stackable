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
		quotationMark,
		quotationSize,
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
	], {
		'ugb--has-background': designHasBackground && ( backgroundColor || backgroundImageURL ),
		'ugb--has-background-image': designHasBackground && backgroundImageURL,
		[ `ugb--shadow-${ shadow }` ]: designHasBackground && shadow !== 3,
		[ `ugb-content-width` ]: align === 'full' && contentWidth,
		...applyFilters( 'stackable.blockquote.mainclasses', {}, props ),
	} )

	const mainStyle = {
		'--quote-color': quoteColor ? quoteColor : undefined,
		backgroundColor: designHasBackground && backgroundColor ? backgroundColor : undefined,
		backgroundImage: designHasBackground && backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: designHasBackground && fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': designHasBackground && backgroundImageURL ? backgroundColor : undefined,
		borderRadius: designHasBackground && borderRadius !== 12 ? borderRadius : undefined,
		...applyFilters( 'stackable.blockquote.mainstyle', {}, props ),
	}

	return (
		<blockquote
			className={ mainClasses }
			style={ mainStyle }>
			<div className="ugb-content-wrapper">
				{ QUOTE_ICONS[ quotationMark ].iconFunc( {
					fill: quoteColor,
					width: quotationSize,
					height: quotationSize,
				} ) }
				{ applyFilters( 'stackable.blockquote.text',
					<RichText.Content
						tagName="p"
						className="ugb-blockquote__text"
						style={ { color } }
						value={ text }
					/>,
					props
				) }
			</div>
		</blockquote>
	)
}

export default save
