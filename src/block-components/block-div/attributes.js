import { backgroundAttributes, borderAttributes } from '../helpers'
import { convertResponsiveAttributes, getAttrName } from '~stackable/util'
import { upperFirst } from 'lodash'

export const attributes = convertResponsiveAttributes( {
	uniqueId: {
		type: 'string',
		source: 'attribute',
		selector: '[data-id]',
		attribute: 'data-id',
		default: '',
	},
	hasBackground: {
		type: 'boolean',
		default: false,
	},
	hasBorders: {
		type: 'boolean',
		default: false,
	},

	// Background attributes
	...Object.keys( backgroundAttributes ).reduce( ( attributes, key ) => {
		const attributeName = getAttrName( 'block%s', upperFirst( key ) )
		attributes[ attributeName ] = { ...backgroundAttributes[ key ] }
		return attributes
	}, {} ),

	// Border attributes
	...Object.keys( borderAttributes ).reduce( ( attributes, key ) => {
		const attributeName = getAttrName( 'block%s', upperFirst( key ) )
		attributes[ attributeName ] = { ...borderAttributes[ key ] }
		return attributes
	}, {} ),
} )

