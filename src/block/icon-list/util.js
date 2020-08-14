/**
 * Internal dependencies
 */
import { deprecatedIcon_2_9_1 } from './deprecated'

/**
 * External dependencies
 */
import { range } from 'lodash'
import { sprintf, __ } from '@wordpress/i18n'
import { i18n } from 'stackable'

/**
 * Handles icon atttribute deprecation in 2.9.1
 *
 * @param {string} icon
 * @param {string} iconShape
 *
 * @return {string} SVG String
 */
export const updateIconAttribute = ( icon = '', iconShape = 'default' ) => {
	if ( ! icon ) {
		return deprecatedIcon_2_9_1[ `check-default` ]
	}
	const updatedIcon = deprecatedIcon_2_9_1[ `${ icon }-${ iconShape || 'default' }` ]
	return updatedIcon ? updatedIcon : icon
}

/**
 * Creates text attributes for Icon List Block
 *
 * @since 2.10.0
 * @param {string} attrNameTemplate
 * @param {number} number of text attributes
 * @return {Object} Generated attributes
 */
export const createIconListTextAttributes = ( attrNameTemplate = 'text%d', number = 6 ) => {
	if ( number < 1 ) {
		return null
	}

	const attributes = {}

	range( 1, number + 1 ).forEach( index => {
		attributes[ sprintf( attrNameTemplate, index ) ] = {
			source: 'html',
			selector: `.ugb-icon-list--text${ index }`,
			default: sprintf( __( 'Line %d', i18n ), index ),
		}
	} )

	return attributes
}

/**
 * Creates icon attributes for Icon List Block
 *
 * @since 2.10.0
 * @param {string} attrNameTemplate
 * @param {number} number of icon attributes
 * @return {Object} Generated attributes
 *
 */
export const createIconListIconAttributes = ( attrNameTemplate = 'icon%d', number = 6 ) => {
	if ( number < 1 ) {
		return null
	}

	const attrNameFormat = ( index = 1 ) => sprintf( attrNameTemplate, index )

	const createIconListIconAttribute = ( index = 1 ) => ( {
		[ `${ attrNameFormat( index ) }` ]: {
			type: 'string',
			source: 'html',
			selector: `.ugb-icon-list--icon${ index }`,
			default: '',
		},
	} )

	let attributes = {}

	range( 1, number + 1 ).forEach( index => {
		attributes = {
			...attributes,
			...createIconListIconAttribute( index ),
		}
	} )

	return attributes
}
