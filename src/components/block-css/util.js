/**
 * Internal dependencies
 */
import {
	createUniqueClass, formAllPossibleAttributeNames, getAttributeName, getAttrName, getUniqueBlockClass,
} from '~stackable/util'

/**
 * External dependencies
 */
import compareVersions from 'compare-versions'

/**
 * Forms a media query string for the given devices.
 *
 * @param {string} devices A list of devices: desktop, tablet or mobile
 * @param {number} breakDesktop Tablet breakpoint
 * @param {number} breakTablet Mobile breakpoint
 * @return {string} A media query
 */
export const getMediaQuery = ( devices = 'desktop', breakDesktop = 1024, breakTablet = 768 ) => {
	 // const devices = sortBy( typeof _devices === 'string' ? _devices.split( ',' ).map( d => d.trim() ) : _devices )

	 // This should be identical to styles/breakpoints.scss
	 if ( devices === 'desktopTablet' ) {
		 return '@media screen and (min-width: ' + breakTablet + 'px)'
	 } else if ( devices === 'desktopOnly' ) {
		 return '@media screen and (min-width: ' + breakDesktop + 'px)'
	 } else if ( devices === 'tablet' ) {
		 return '@media screen and (max-width: ' + ( breakDesktop - 1 ) + 'px)'
	 } else if ( devices === 'tabletOnly' ) {
		 return '@media screen and (min-width: ' + breakTablet + 'px) and (max-width: ' + ( breakDesktop - 1 ) + 'px)'
	 } else if ( devices === 'mobile' ) {
		 return '@media screen and (max-width: ' + ( breakTablet - 1 ) + 'px)'
	 }
	 return null
}

/**
 * Gets the unique class name for the block, e.g. stk-123abc
 *
 * @param {string} uniqueId The uniqueId attribute of the block
 * @param {sting} clientId The clientId of the block - if in the editor, supply this. If rendering for the save function, leave this blank.
 *
 * @return {string} The block's unique class name
 */
export const getBlockUniqueClassname = ( uniqueId, clientId = '' ) => {
	// const attributeUniqueId = useBlockAttributesContext( attributes => attributes.uniqueId )
	const __blockUniqueClassName = getUniqueBlockClass( uniqueId )

	// If there's no blockUniqueClassName supplied, create one based from the
	// clientId so that we can still generate some styles.
	let _blockUniqueClassName = __blockUniqueClassName
	if ( ! __blockUniqueClassName && clientId ) {
		const tempUniqueId = createUniqueClass( clientId )
		_blockUniqueClassName = getUniqueBlockClass( tempUniqueId )
	}

	return _blockUniqueClassName
}

/**
 * Checks whether the given version is within a range.
 *
 * @param {string} version Semantic version
 * @param {string} versionAdded
 * @param {string} versionDeprecated
 *
 * @return {boolean} True if the version is supported
 */
export const isVersionSupported = ( version, versionAdded, versionDeprecated = '' ) => {
	// If no version was given, just get everything that's not yet deprecated.
	if ( ! version ) {
	  return !! versionDeprecated
	}

	// If given, get styles which...
	return (
	  compareVersions( version, versionAdded ) >= 0 && // Were introduced on the same version.
	  ( ! versionDeprecated || compareVersions( version, versionDeprecated ) === -1 ) // Are not yet deprecated.
	)
}

/**
 * Generates a list of all attribute names. This is fast (faster than the
 * getDependencyAttrnames above). This is fast because the attribute names
 * generated in the list aren't cross checked on whether they're really
 * specified in the block's schema.
 *
 * @param {Array} styleParams
 * @return {Array} All used attribute names
 */
export const getDependencyAttrnamesFast = styleParams => {
	const attrNames = []
	const {
		attrName: _attrName = '',
		dependencies = [], // If this style rerender depends on other attributes, add them here.
		attrNameTemplate = '',
		styles = {},
	} = styleParams

	// Add the attribute name.
	const attrName = attrNameTemplate ? getAttrName( attrNameTemplate, _attrName ) : _attrName
	if ( attrName && ! attrNames.includes( attrName ) ) {
		attrNames.push( attrName )
	}

	// Add the shorthand attributes. We allow multiple styleName to attribute mappings.
	Object.values( styles ).forEach( _attrName => {
		const attrName = attrNameTemplate ? getAttrName( attrNameTemplate, _attrName ) : _attrName
		if ( attrName && ! attrNames.includes( attrName ) ) {
			attrNames.push( attrName )
		}
	} )

	// Add the attribute dependencies.
	dependencies.forEach( _attrName => {
		const attrName = attrNameTemplate ? getAttrName( attrNameTemplate, _attrName ) : _attrName
		if ( attrName && ! attrNames.includes( attrName ) ) {
			attrNames.push( attrName )
		}
	} )

	return [
		...formAllPossibleAttributeNames( attrNames ),
		'uniqueId', // Always include this since this affects all css.
	]
}

/**
 * Prepends a class
 *
 * @param {string} selector
 * @param {string} prependString Prepend a class to the selector
 *
 * @return {string} New selector
 */
export const prependClass = ( selector, prependString ) => {
	const getSelector = s => {
		// Pseudoselectors should not be delimited by spaces.
		return `${ prependString || '' }${ s.startsWith( ':' ) ? '' : ' ' }${ s || '' }`.trim()
	}

	if ( Array.isArray( selector ) ) {
		return selector.map( getSelector ).join( ', ' )
	}

	return getSelector( selector )
}

/**
 * Appends a class
 *
 * @param {string} selector
 * @param {string} appendString Class to append
 *
 * @return {string} New selector
 */
export const appendClass = ( selector, appendString ) => {
	const getSelector = s => {
		return `${ s }${ appendString || '' }`.trim()
	}

	if ( Array.isArray( selector ) ) {
		return selector.map( getSelector ).join( ', ' )
	}

	return getSelector( selector )
}

/**
 * Creates a getAttribute function for easy getting of values for the current block.
 *
 * @param {Object} attributes Block attributes
 * @param {string} attrNameTemplate Attribute name template
 *
 * @return {Function} A getAttribute function that uses the attributes and the name template.
 */
export const getAttributeFunc = ( attributes, attrNameTemplate = '' ) => {
	const getAttribute = ( _attrName, device = 'desktop', state = 'normal', getInherited = false ) => {
		const attrName = attrNameTemplate ? getAttrName( attrNameTemplate, _attrName ) : _attrName
		const value = attributes[ getAttributeName( attrName, device, state ) ]

		if ( ! getInherited ) {
			return value
		}

		// If inheriting, return the value if we got one.
		if ( value !== '' && typeof value !== 'undefined' ) {
			return value
		}

		// This is the last inheritance that we can get.
		if ( device === 'desktop' ) {
			return value
		}

		// Try and get an inherited value (e.g. if no tablet is supplied, get the desktop value)
		const nextDevice = device === 'mobile' ? 'tablet' : 'desktop'
		return getAttribute( _attrName, nextDevice, state, getInherited )
	}

	return getAttribute
}
