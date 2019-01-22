import { merge, omit } from 'lodash'
import { __ } from '@wordpress/i18n'

export const deprecatedSave_0_7 = props => {
	const {
		color, text, borderColor,
	} = props.attributes

	return (
		<blockquote
			className="ugb-pullquote"
			style={ {
				borderTopColor: borderColor,
				borderBottomColor: borderColor,
			} }>
			<p style={ { color: color } }>{ text }</p>
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
		default: '#2091e1',
	},
	borderColor: {
		type: 'string',
		default: '#2091e1',
	},
}

const deprecated = [
	{
		attributes: deprecatedSchema_0_7,
		migrate: attributes => {
			return omit( merge( attributes, { quoteColor: attributes.borderColor } ), [ 'borderColor' ] )
		},
		save: deprecatedSave_0_7,
	},
]

export default deprecated
