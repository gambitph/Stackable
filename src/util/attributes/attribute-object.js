/**
 * Internal dependencies
 */
import { expandAttributes } from '.'

/**
 * External dependencies
 */
import compareVersions from 'compare-versions'
import deepmerge from 'deepmerge'
import { getAttrName } from '~stackable/util'
import { upperFirst } from 'lodash'

/**
 * Attribute object, this manages the generation of attributes per version.
 */
export class AttributeObject {
	constructor( attributes = [] ) {
		this.attributes = attributes
		this.defaultValues = []
	}

	// Add a attribute object.
	add( {
		attributes,
		versionAdded,
		versionDeprecated,
		attrNameTemplate = '%s', // If provided, the template name will be applied to all attribute definitions
	} ) {
		this.attributes.push( {
			attributeObject: this.applyAttrNameTemplate( attributes, attrNameTemplate ),
			versionAdded: versionAdded || '',
			versionDeprecated: versionDeprecated || false,
		} )
	}

	// You can specify default values for attributes for a specific version.
	addDefaultValues( {
		attributes,
		versionAdded,
		versionDeprecated,
		attrNameTemplate = '%s', // If provided, the template name will be applied to all attribute definitions
	} ) {
		this.defaultValues.push( {
			defaultValuesObject: this.applyAttrNameTemplate( attributes, attrNameTemplate ),
			versionAdded: versionAdded || '',
			versionDeprecated: versionDeprecated || false,
		} )
	}

	applyAttrNameTemplate( attributes, attrNameTemplate = '%s' ) {
		if ( attrNameTemplate === '%s' || ! attrNameTemplate ) {
			return attributes
		}

		return Object.keys( attributes ).reduce( ( newAttributes, key ) => {
			const attributeName = getAttrName( attrNameTemplate, upperFirst( key ) )
			newAttributes[ attributeName ] = { ...attributes[ key ] }
			return newAttributes
		}, {} )
	}

	getDefaultValues( version = '' ) {
		return this.defaultValues
			.filter( ( { versionAdded, versionDeprecated } ) => {
				// If no version was given, just get everything that's not yet deprecated.
				if ( ! version ) {
					return !! versionDeprecated
				}

				// If given, get attributes which...
				return compareVersions( version, versionAdded ) >= 0 && // Were introduced on the same version.
					( ! versionDeprecated || compareVersions( version, versionDeprecated ) === -1 ) // Are not yet deprecated.
			} )
			.map( ( { defaultValuesObject } ) => defaultValuesObject ) // Get the attributes only.
	}

	getAttributes( version = '' ) {
		return this.attributes
			.filter( ( { versionAdded, versionDeprecated } ) => {
				// If no version was given, just get everything that's not yet deprecated.
				if ( ! version ) {
					return !! versionDeprecated
				}

				// If given, get attributes which...
				return compareVersions( version, versionAdded ) >= 0 && // Were introduced on the same version.
					( ! versionDeprecated || compareVersions( version, versionDeprecated ) === -1 ) // Are not yet deprecated.
			} )
			.map( ( { attributeObject } ) => attributeObject ) // Get the attributes only.
	}

	getMerged( version = '' ) {
		const attributes = expandAttributes(
			deepmerge.all( this.getAttributes( version ) )
		)

		// Apply the default values if there are any.
		if ( this.defaultValues.length ) {
			const defaultValues = deepmerge.all( this.getDefaultValues( version ) )
			Object.keys( defaultValues ).forEach( attrName => {
				const defaultValue = defaultValues[ attrName ]
				if ( typeof attributes[ attrName ] !== 'undefined' ) {
					attributes[ attrName ].default = defaultValue
				}
			} )
		}

		return attributes
	}
}
