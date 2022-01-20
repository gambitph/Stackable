import { getAttributeName, getAttrNameFunction } from '~stackable/util'

import {
	useSelect, useDispatch,
} from '@wordpress/data'
import { useBlockEditContext } from '@wordpress/block-editor'
import {
	useCallback, useState, useEffect,
} from '@wordpress/element'

/**
 * Provides all the functions needed to get and update attributes for control
 * Components. This is mainly used if the names of the attributes being adjusted
 * are part of a pattern. e.g. blockBackgroundColor and blockBackgroundMediaUrl
 *
 * You don't need to use this hook if you're adjusting attributes directly. Just
 * directly use the blocks' `setAttributes` function and access the block's
 * `attribute` prop.
 *
 * @param {string} attrNameTemplate The name template for the attribute. The
 * attribute name of will be run through this fitler.
 * @return {Object} Functions
 */
export const useAttributeEditHandlers = ( attrNameTemplate = '%s' ) => {
	const { clientId } = useBlockEditContext()
	const { getBlockAttributes } = useSelect( select => ( {
		getBlockAttributes: select( 'core/block-editor' ).getBlockAttributes,
	} ), [ clientId ] )

	const { updateBlockAttributes: uBA } = useDispatch( 'core/block-editor' )
	const [ willUpdateAttrs, _setWillUpdateAttrs ] = useState( {} )

	const setWillUpdateAttrs = newAttrs => _setWillUpdateAttrs( curr => ( { ...curr, ...newAttrs } ) )

	useEffect( () => {
		const timeout = setTimeout( () => {
			if ( Object.keys( willUpdateAttrs ).length ) {
				uBA( clientId, willUpdateAttrs )
				_setWillUpdateAttrs( {} )
			}
		}, 50 )

		return () => clearTimeout( timeout )
	}, [ JSON.stringify( willUpdateAttrs ), clientId ] )

	const getAttrName = useCallback( ( attrName, device = 'desktop', state = 'normal' ) => {
		return getAttributeName( getAttrNameFunction( attrNameTemplate )( attrName ), device, state )
	}, [] )

	const getAttribute = useCallback( ( attrName, device = 'desktop', state = 'normal' ) => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		const attributes = Object.assign( {}, getBlockAttributes( clientId ) || {}, willUpdateAttrs )
		return attributes[ getAttributeName( getAttrName( attrName ), device, state ) ]
	}, [ clientId, attrNameTemplate, getBlockAttributes, JSON.stringify( willUpdateAttrs ) ] )

	const getAttributes = useCallback( () => {
		return Object.assign( {}, getBlockAttributes( clientId ) || {}, willUpdateAttrs )
	}, [ clientId, getBlockAttributes, JSON.stringify( willUpdateAttrs ) ] )

	const updateAttribute = useCallback( ( attrName, value, device = 'desktop', state = 'normal' ) => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		return setWillUpdateAttrs( {
			[ getAttributeName( getAttrName( attrName ), device, state ) ]: value,
		} )
	}, [ setWillUpdateAttrs ] )

	const updateAttributeHandler = useCallback( ( attrName, device = 'desktop', state = 'normal' ) => {
		return value => updateAttribute( attrName, value, device, state )
	}, [ updateAttribute ] )

	const updateAttributes = useCallback( values => {
		const attributes = Object.keys( values ).reduce( ( attributes, attrName ) => {
			attributes[ getAttrName( attrName ) ] = values[ attrName ]
			return attributes
		}, {} )
		setWillUpdateAttrs( attributes )
	}, [ setWillUpdateAttrs ] )

	return {
		getAttrName,
		getAttribute,
		getAttributes,
		updateAttributeHandler,
		updateAttributes,
		updateAttribute,
	}
}
