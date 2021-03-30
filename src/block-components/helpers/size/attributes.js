import { convertResponsiveAttributes } from '~stackable/util'

export const sizeAttributes = convertResponsiveAttributes( {
	height_: {
		type: 'number',
		default: '',
	},
	heightUnit_: {
		type: 'string',
		default: 'px',
	},
	width_: {
		type: 'number',
		default: '',
	},
	widthUnit_: {
		type: 'string',
		default: 'px',
	},

	verticalAlign_: {
		type: 'string',
		default: '',
	},
	horizontalAlign_: {
		type: 'string',
		default: '',
	},

	marginTop_: {
		type: 'number',
		default: '',
	},
	marginRight_: {
		type: 'number',
		default: '',
	},
	marginBottom_: {
		type: 'number',
		default: '',
	},
	marginLeft_: {
		type: 'number',
		default: '',
	},
	marginUnit_: {
		type: 'string',
		default: 'px',
	},

	paddingTop_: {
		type: 'number',
		default: '',
	},
	paddingRight_: {
		type: 'number',
		default: '',
	},
	paddingBottom_: {
		type: 'number',
		default: '',
	},
	paddingLeft_: {
		type: 'number',
		default: '',
	},
	paddingUnit_: {
		type: 'string',
		default: 'px',
	},
} )

export const addSizeAttributes = ( attrObject, attrNameTemplate = '%s' ) => {
	attrObject.add( {
		attributes: sizeAttributes,
		attrNameTemplate,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
