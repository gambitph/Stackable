export const substitute = {
	from: 'stackable/call-to-action',
	transform: ( oldAttributes, innerBlocks ) => {
		return [
			'stackable/columns',
			{
				// TODO: See if passing the entire oldAttributes works.
				...oldAttributes,
				// hasBackground: oldAttributes.hasBackground,
				// blockBackgroundMediaUrl: oldAttributes.blockBackgroundMediaUrl,
				// align: oldAttributes.align,
				// contentAlign: oldAttributes.contentAlign,
				// innerBlockContentAlign: oldAttributes.innerBlockContentAlign,
				// blockHeight: oldAttributes.blockHeight,
				// blockVerticalAlign: oldAttributes.blockVerticalAlign,
				// hasContainer: oldAttributes.hasContainer,
			},
			[ 'stackable/column', {}, innerBlocks ],
		]
	},
}

export default substitute
