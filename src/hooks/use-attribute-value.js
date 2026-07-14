/**
 * Selective attribute reads for inspector panels.
 *
 * Use with useAttributeEditHandlers (write-only) to avoid subscribing
 * to the full block attributes object on every change.
 *
 * Prefer co-located useAttributeValue calls at each read site.
 * useAttributeGetters is available for cases that need a getAttribute
 * helper (e.g. filters with dynamic attribute names).
 */

import { useCallback, useMemo } from '@wordpress/element'
import { getAttributeName, getAttrNameFunction } from '~stackable/util'
import { useBlockAttributesContext } from './use-block-attributes-context'

/**
 * Stable cache key for a logical attribute read.
 *
 * @param {string} attrName
 * @param {string} device
 * @param {string} state
 * @return {string} Cache key string.
 */
export const getAttributeCacheKey = ( attrName, device = 'desktop', state = 'normal' ) => {
	return `${ attrName }:${ device }:${ state }`
}

/**
 * Resolves the stored attribute key for a logical attribute read.
 *
 * @param {string} attrNameTemplate
 * @param {string} attrName
 * @param {string} device
 * @param {string} state
 * @return {string} Resolved attribute key.
 */
export const resolveAttributeKey = ( attrNameTemplate, attrName, device = 'desktop', state = 'normal' ) => {
	return getAttributeName( getAttrNameFunction( attrNameTemplate )( attrName ), device, state )
}

/**
 * Builds a context selector that picks only the watched attribute values.
 *
 * @param {string} attrNameTemplate
 * @param {Array}  watchSpecs
 * @return {Function} Context selector function.
 */
export const buildAttributeValuesSelector = ( attrNameTemplate, watchSpecs ) => {
	return attributes => {
		return watchSpecs.reduce( ( values, spec ) => {
			const [ attrName, device = 'desktop', state = 'normal' ] = Array.isArray( spec ) ? spec : [ spec ]
			const cacheKey = getAttributeCacheKey( attrName, device, state )
			const resolvedKey = resolveAttributeKey( attrNameTemplate, attrName, device, state )
			values[ cacheKey ] = attributes[ resolvedKey ]
			return values
		}, {} )
	}
}

/**
 * Reads a single block attribute value with a selective subscription.
 *
 * @param {string} attrName
 * @param {string} attrNameTemplate
 * @param {string} device
 * @param {string} state
 * @return {*} Attribute value.
 */
export const useAttributeValue = ( attrName, attrNameTemplate = '%s', device = 'desktop', state = 'normal' ) => {
	const resolvedKey = useMemo(
		() => resolveAttributeKey( attrNameTemplate, attrName, device, state ),
		[ attrNameTemplate, attrName, device, state ]
	)

	return useBlockAttributesContext( attributes => attributes[ resolvedKey ] )
}

/**
 * Reads multiple attribute values in one selective subscription.
 *
 * @param {string} attrNameTemplate
 * @param {Array}  watchSpecs
 * @return {Object} getAttribute helper.
 */
export const useAttributeGetters = ( attrNameTemplate = '%s', watchSpecs = [] ) => {
	const selector = useMemo(
		() => buildAttributeValuesSelector( attrNameTemplate, watchSpecs ),
		[ attrNameTemplate, watchSpecs ]
	)

	const values = useBlockAttributesContext( selector )

	const getAttribute = useCallback( ( attrName, device = 'desktop', state = 'normal' ) => {
		return values[ getAttributeCacheKey( attrName, device, state ) ]
	}, [ values ] )

	return { getAttribute, values }
}
