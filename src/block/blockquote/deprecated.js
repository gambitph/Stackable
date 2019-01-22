import { merge, omit } from 'lodash'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import { RichText } from '@wordpress/editor'

const deprecatedSchema_1_10 = {
	text: {
		source: 'html',
		selector: 'p',
		default: descriptionPlaceholder( 'long' ),
	},
	color: {
		type: 'string',
		default: '',
	},
	quoteColor: {
		type: 'string',
		default: '',
	},
	backgroundColor: {
		type: 'string',
	},
	backgroundImageID: {
		type: 'number',
	},
	backgroundImageURL: {
		type: 'string',
	},
	backgroundOpacity: {
		type: 'number',
		default: 5,
	},
	fixedBackground: {
		type: 'boolean',
		default: false,
	},
}

const deprecatedSave_1_10 = props => {
	const { className } = props
	const {
		color,
		text,
		quoteColor,
		backgroundColor,
		backgroundImageURL,
		backgroundOpacity = 5,
		fixedBackground,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-blockquote',
		'ugb-has-background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], {
		'ugb-has-background': backgroundColor || backgroundImageURL,
		'ugb-has-background-image': backgroundImageURL,
	} )

	const mainStyle = {
		'--quote-color': quoteColor ? quoteColor : undefined,
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': backgroundImageURL ? backgroundColor : undefined,
	}

	return (
		<blockquote
			className={ mainClasses }
			style={ mainStyle }>
			<RichText.Content
				tagName="p"
				style={ { color } }
				value={ text }
			/>
		</blockquote>
	)
}

export const deprecatedSchema_1_4 = {
	text: {
		source: 'html',
		selector: 'p',
		default: __( 'It\'s okay to acknowledge that life can get complicated, but we musn\'t forget the beauty in its simplicity, too. From the multitude of stars above, to freshly mowed grass in the morning, life is simply wonderful.' ),
	},
	color: {
		type: 'string',
		default: '',
	},
	quoteColor: {
		type: 'string',
		default: '',
	},
}

export const deprecatedSave_1_4 = props => {
	const { className } = props
	const {
		color, text, quoteColor,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-blockquote',
	] )

	return (
		<blockquote
			className={ mainClasses }
			style={ { '--quote-color': quoteColor } }>
			<RichText.Content
				tagName="p"
				style={ { color } }
				value={ text }
			/>
		</blockquote>
	)
}

export const deprecatedSchema_0_7 = {
	text: {
		type: 'array',
		source: 'children',
		selector: 'p',
		default: __( 'It\'s okay to acknowledge that life can get complicated, but we musn\'t forget the beauty in its simplicity, too. From the multitude of stars above, to freshly mowed grass in the morning, life is simply wonderful.' ),
	},
	color: {
		type: 'string',
		default: '#424242',
	},
	borderColor: {
		type: 'string',
		default: '#2091e1',
	},
}

export const deprecatedSave_0_7 = props => {
	const {
		color, text, borderColor,
	} = props.attributes

	return (
		<blockquote
			className="ugb-blockquote"
			style={ {
				borderLeftColor: borderColor,
			} }>
			<p style={ { color: color } }>{ text }</p>
		</blockquote>
	)
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_10,
		save: deprecatedSave_1_10,
		migrate: attributes => {
			const className = ( attributes.className || '' ).replace( /align\w+/, '' ).trim()
			return {
				...attributes,
				design: attributes.backgroundColor || attributes.backgroundImageURL ? 'basic' : 'plain',
				borderRadius: 12,
				shadow: 3,
				quotationMark: 'round-thin',
				quotationSize: 70,
				contentWidth: false,
				className: className ? className : undefined,
				align: [ 'aligncenter', 'alignwide', 'alignfull' ].includes( attributes.className ) ? attributes.className.replace( /^align/, '' ) : attributes.align,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_4,
		save: deprecatedSave_1_4,
	},
	{
		attributes: deprecatedSchema_0_7,
		migrate: attributes => {
			return omit( merge( attributes, { quoteColor: attributes.borderColor } ), [ 'borderColor' ] )
		},
		save: deprecatedSave_0_7,
	},
]

export default deprecated
