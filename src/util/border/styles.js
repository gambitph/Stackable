/**
 * Internal dependencies
 */
import { appendImportantAll } from '../'

/**
 * External dependencies
 */
import { __getValue } from '~stackable/util'
import { camelCase } from 'lodash'
import deepmerge from 'deepmerge'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

/**
 * Generates button styles
 *
 * @param {string} attrNameTemplate Template name where to get the attributes from
 * @param {string} mainClassName The classname that will be used for the CSS generation
 * @param {Object} blockAttributes The attributes of the block
 *
 * @return {Object} CSS Styles object
 */
export const createBorderStyleSet = ( attrNameTemplate = '%s', mainClassName = '', blockAttributes = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = __getValue( blockAttributes, getAttrName )

	const styles = []

	if ( ! getValue( 'BorderType' ) ) {
		return styles
	}

	styles.push( {
		[ mainClassName ]: appendImportantAll( {
			borderStyle: getValue( 'BorderType' ),
			borderColor: getValue( 'BorderColor' ) || '#000000',
			borderTopWidth: getValue( 'BorderWidthTop', '%spx' ) || '1px',
			borderRightWidth: getValue( 'BorderWidthRight', '%spx' ) || '1px',
			borderBottomWidth: getValue( 'BorderWidthBottom', '%spx' ) || '1px',
			borderLeftWidth: getValue( 'BorderWidthLeft', '%spx' ) || '1px',
		} ),
		tablet: {
			[ mainClassName ]: appendImportantAll( {
				borderTopWidth: getValue( 'TabletBorderWidthTop', '%spx' ),
				borderRightWidth: getValue( 'TabletBorderWidthRight', '%spx' ),
				borderBottomWidth: getValue( 'TabletBorderWidthBottom', '%spx' ),
				borderLeftWidth: getValue( 'TabletBorderWidthLeft', '%spx' ),
			} ),
		},
		mobile: {
			[ mainClassName ]: appendImportantAll( {
				borderTopWidth: getValue( 'MobileBorderWidthTop', '%spx' ),
				borderRightWidth: getValue( 'MobileBorderWidthRight', '%spx' ),
				borderBottomWidth: getValue( 'MobileBorderWidthBottom', '%spx' ),
				borderLeftWidth: getValue( 'MobileBorderWidthLeft', '%spx' ),
			} ),
		},
	} )

	return deepmerge.all( styles )
}
