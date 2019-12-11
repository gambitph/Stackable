/**
 * Internal dependencies
 */
import { createButtonStyleSet } from '../'

/**
 * External dependencies
 */
import { camelCase } from 'lodash'
import deepmerge from 'deepmerge'
import { __getValue } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

export const createSocialButtonStyleSet = ( attrNameTemplate = '%s', mainClassName = '', blockAttributes = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = __getValue( blockAttributes, getAttrName, '' )

	const styles = []

	// We use the button styles and override them since social buttons are based on them.
	styles.push( { ...createButtonStyleSet( attrNameTemplate, mainClassName, blockAttributes, true ) } )

	if ( ! getValue( 'UseSocialColors' ) ) {
		return deepmerge.all( styles )
	}

	// Basic design.
	if ( getValue( 'Design' ) === '' || getValue( 'Design' ) === 'basic' ) {
		styles.push( {
			[ `.${ mainClassName }` ]: {
				backgroundColor: undefined,
				backgroundImage: undefined,
			},
			[ `.${ mainClassName } .ugb-button--inner, .${ mainClassName } svg` ]: {
				color: undefined,
			},
			[ `.${ mainClassName }:hover .ugb-button--inner, .${ mainClassName }:hover svg` ]: {
				color: undefined,
			},
			[ `.${ mainClassName }:hover` ]: {
				backgroundColor: undefined,
			},
			[ `.${ mainClassName }:before` ]: {
				content: undefined,
				backgroundImage: undefined,
			},
		} )
	}

	// Ghost design.
	if ( getValue( 'Design' ) === 'ghost' ) {
		styles.push( {
			[ `.${ mainClassName }` ]: {
				borderColor: undefined,
			},
			[ `.${ mainClassName } .ugb-button--inner, .${ mainClassName }.ugb-button--has-icon.ugb-button--has-icon svg` ]: {
				color: undefined,
			},
			[ `.${ mainClassName }:hover` ]: {
				borderColor: undefined,
			},
			[ `.${ mainClassName }:hover .ugb-button--inner, .${ mainClassName }.ugb-button--has-icon.ugb-button--has-icon:hover svg` ]: {
				color: undefined,
			},
		} )

		// Hover gradient.
		const hasHoverGradientEffect = getValue( 'HoverGhostToNormal' )
		if ( hasHoverGradientEffect ) {
			styles.push( {
				[ `.${ mainClassName }:before` ]: {
					content: undefined,
					backgroundImage: undefined,
					top: undefined,
					right: undefined,
					bottom: undefined,
					left: undefined,
				},
				[ `.${ mainClassName }:hover .ugb-button--inner, .${ mainClassName }.ugb-button--has-icon.ugb-button--has-icon:hover svg` ]: {
					color: undefined,
				},
			} )
		}
	}

	if ( getValue( 'Design' ) === 'plain' ) {
		styles.push( {
			[ `.${ mainClassName } .ugb-button--inner, .${ mainClassName }.ugb-button--has-icon.ugb-button--has-icon svg` ]: {
				color: undefined,
			},
			[ `.${ mainClassName }:hover .ugb-button--inner, .${ mainClassName }.ugb-button--has-icon.ugb-button--has-icon:hover svg` ]: {
				color: undefined,
			},
		} )
	}

	return deepmerge.all( styles )
}
