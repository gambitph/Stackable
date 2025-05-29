import { deprecatedAddAttributes } from './deprecated'

export const sizeAttributes = {
	width: {
		stkResponsive: true,
		stkUnits: 'px',
		type: 'number',
		default: '',
	},

	verticalAlign: {
		stkResponsive: true,
		type: 'string',
		default: '',
	},
	horizontalAlign: {
		stkResponsive: true,
		type: 'string',
		default: '',
	},

	margin: {
		stkResponsive: true,
		stkUnits: 'px',
		type: 'object',
	},
	padding: {
		stkResponsive: true,
		stkHover: true,
		stkUnits: 'px',
		type: 'object',
	},
}

export const addSizeAttributes = ( attrObject, attrNameTemplate = '%s' ) => {
	deprecatedAddAttributes( attrObject, attrNameTemplate )

	attrObject.add( {
		attributes: sizeAttributes,
		attrNameTemplate,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	attrObject.add( {
		attributes: {
			height: {
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
