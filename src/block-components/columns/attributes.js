import { deprecatedAddAttributes } from './deprecated'

export const addAttributes = attrObject => {
	deprecatedAddAttributes( attrObject )

	attrObject.add( {
		attributes: {
			columnSpacing: {
				stkResponsive: true,
				stkUnits: 'px',
				type: 'number',
				default: '',
			},
			columnGap: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
			rowGap: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
