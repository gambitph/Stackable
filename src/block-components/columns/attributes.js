import { deprecatedAddAttributes } from './deprecated/index'

export const addAttributes = ( attrObject, attrNameTemplate = '%s' ) => {
	deprecatedAddAttributes( attrObject, attrNameTemplate )

	attrObject.add( {
		attributes: {
			columnWrapDesktop: { // Only applies to desktops
				type: 'boolean',
				default: false,
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	attrObject.add( {
		attributes: {
			columnGap: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},
			rowGap: {
				stkResponsive: true,
				type: 'string',
				default: '',
			},
			columnSpacing: {
				stkResponsive: true,
				stkUnits: 'px',
				type: 'string',
				default: '',
			},
		},
		attrNameTemplate,
		versionAdded: '3.16.0',
		versionDeprecated: '',
	} )
}
