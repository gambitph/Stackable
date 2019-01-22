import { merge, omit } from 'lodash'

export const deprecatedSave_0_7 = props => {
	const {
		url,
		text,
		textAlignment,
		color,
		size,
		cornerButtonRadius,
		borderThickness,
	} = props.attributes

	const buttonStyle = {
		borderColor: color,
		color: color,
		borderRadius: cornerButtonRadius + 'px',
		borderWidth: borderThickness + 'px',
	}

	return (
		<div className={ `ugb-button-${ textAlignment }` }>
			<a href={ url } className={ `wp-ugb-button ugb-button-${ size } ugb-ghost-button` } style={ buttonStyle }>
				{ text }
			</a>
		</div>
	)
}

export const deprecatedSchema_0_7 = {
	url: {
		type: 'string',
		source: 'attribute',
		selector: 'a',
		attribute: 'href',
	},
	text: {
		type: 'array',
		source: 'children',
		selector: 'a',
	},
	textAlignment: {
		type: 'string',
		default: 'center',
	},
	color: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	size: {
		type: 'string',
		default: 'normal',
	},
	cornerButtonRadius: {
		type: 'number',
		default: '4',
	},
	borderThickness: {
		type: 'number',
		default: '1',
	},
}

const deprecated = [
	{
		attributes: deprecatedSchema_0_7,
		migrate: attributes => {
			return omit( merge( attributes, { align: attributes.textAlignment } ), [ 'textAlignment' ] )
		},
		save: deprecatedSave_0_7,
	},
]

export default deprecated
