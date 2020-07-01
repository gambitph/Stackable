/**
 * Internal dependencies
 */
import { appendImportant } from '../'

/**
 * External dependencies
 */
import {
	__getValue,
} from '~stackable/util'
import { camelCase } from 'lodash'
import deepmerge from 'deepmerge'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

/**
 * Generates button styles
 *
 * @param {string} attrNameTemplate Template name where to get the attributes from
 * @param {string} mainClassName The classname that will be used for the CSS generation
 * @param {Object} blockAttributes The attributes of the block
 *
 * @return {Object} CSS Styles object
 */
export const createIconStyleSet = ( attrNameTemplate = '%s', mainClassName = '', blockAttributes = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = __getValue( blockAttributes, getAttrName )

	const styles = []

	styles.push( {
		[ `.${ mainClassName } .ugb-icon-inner-svg, .${ mainClassName } .ugb-icon-inner-svg svg` ]: {
			width: appendImportant( getValue( 'Size', '%spx' ) ),
			height: appendImportant( getValue( 'Size', '%spx' ) ),
		},
		tablet: {
			[ `.${ mainClassName } .ugb-icon-inner-svg, .${ mainClassName } .ugb-icon-inner-svg svg` ]: {
				width: appendImportant( getValue( 'TabletSize', '%spx' ) ),
				height: appendImportant( getValue( 'TabletSize', '%spx' ) ),
			},
		},
		mobile: {
			[ `.${ mainClassName } .ugb-icon-inner-svg, .${ mainClassName } .ugb-icon-inner-svg svg` ]: {
				width: appendImportant( getValue( 'MobileSize', '%spx' ) ),
				height: appendImportant( getValue( 'MobileSize', '%spx' ) ),
			},
		},
		[ `.${ mainClassName } .ugb-icon-inner-svg` ]: {
			color: appendImportant( getValue( 'Color' ) ),
			transform: appendImportant( getValue( 'Rotation', 'rotate(%sdeg)' ) ),
		},
		[ `.${ mainClassName }` ]: {
			opacity: appendImportant( getValue( 'Opacity' ) ),
		},
	} )

	if ( getValue( 'Design' ) === 'shaped' || getValue( 'Design' ) === 'outlined' ) {
		styles.push( {
			[ `.${ mainClassName } .ugb-icon__design-wrapper` ]: {
				borderRadius: appendImportant( getValue( 'BorderRadius', '%s%', '100%' ) ),
				padding: appendImportant( getValue( 'Padding', '%spx' ) ),
			},
		} )
	}

	if ( getValue( 'Design' ) === 'shaped' ) {
		styles.push( {
			[ `.${ mainClassName } .ugb-icon__design-wrapper` ]: {
				background: appendImportant( getValue( 'BackgroundColor' ) ),
			},
		} )
	}
	if ( getValue( 'Design' ) === 'outlined' ) {
		styles.push( {
			[ `.${ mainClassName } .ugb-icon__design-wrapper` ]: {
				borderColor: appendImportant( getValue( 'BackgroundColor' ) ),
				borderWidth: appendImportant( getValue( 'OutlineWidth', '%spx' ) ),
			},
		} )
	}

	return deepmerge.all( applyFilters( 'stackable.icon-style-set.styles', styles, getValue, mainClassName, blockAttributes ) )
}
