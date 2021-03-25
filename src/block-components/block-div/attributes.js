import { backgroundAttributes } from '../helpers'
import { convertResponsiveAttributes, getAttrName } from '~stackable/util'
import { upperFirst } from 'lodash'

const _attributes = convertResponsiveAttributes( {
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
} )

// Add the typical background attributes.
export const attributes = Object.keys( backgroundAttributes ).reduce( ( attributes, key ) => {
	const attributeName = getAttrName( 'block%s', upperFirst( key ) )
	attributes[ attributeName ] = { ...backgroundAttributes[ key ] }
	return attributes
}, _attributes )
