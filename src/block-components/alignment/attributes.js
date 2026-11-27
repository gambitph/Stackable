import { deprecatedAddAttributes } from './deprecated/index'

export const addAttributes = ( attrObject, attrNameTemplate = '%s' ) => {
	deprecatedAddAttributes( attrObject, attrNameTemplate )

	// Assume that the block uses the BlockDiv Block Component and has a
	// uniqueId attribute
	attrObject.add( {
		attributes: {
			// We need to add this in because a deprecated wide/full width block
			// will lose its align attribute (Gutenberg issue)
			// @see https://github.com/WordPress/gutenberg/issues/50281
			align: {
				type: 'string',
			},
			contentAlign: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},
			rowAlign: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},
			columnJustify: {
				type: 'string',
				default: '',
				stkResponsive: true,
			},
			columnAlign: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},
			innerBlockOrientation: {
				stkResponsive: true,
				type: 'string',
				default: 'vertical',
			},
			// Flex.
			innerBlockJustify: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},
			innerBlockAlign: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},
			innerBlockWrap: {
				type: 'string',
				default: '',
			},
			innerBlockColumnGap: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	attrObject.add( {
		attributes: {
			innerBlockRowGap: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},
			containerHeight: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},
		},
		attrNameTemplate,
		versionAdded: '3.16.0',
		versionDeprecated: '',
	} )
}
