export const deprecatedSave_1_3 = props => {
	const { height } = props.attributes

	return (
		<div style={ { height: height + 'px' } }></div>
	)
}

export const deprecatedSchema_1_3 = {
	height: {
		default: 50,
		type: 'number',
	},
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_3,
		save: deprecatedSave_1_3,
	},
]

export default deprecated
