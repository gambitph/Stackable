/**
 * External dependencies
 */
import { useBlockAttributes } from '~stackable/hooks'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import { useBlockEditContext } from '@wordpress/block-editor'
import { useSelect } from '@wordpress/data'

/**
 * Custom hook for getting all
 * available context of the block.
 *
 * @param {Object} context context values
 */
export const useAvailableContext = context => {
	const [ availableContext, setAvailableContext ] = useState( [] )

	useEffect( () => {
		if ( ! context || ! Object.keys( context ).length ) {
			return
		}

		setAvailableContext( applyFilters(
			'stackable.block-components.context',
			[ { label: __( 'No Context', i18n ), value: '' } ],
			context
		) )
	}, Object.keys( context ) )

	return availableContext
}

/**
 * Custom hook for changing the text value
 * of the block.
 *
 * If the usesContext is false, it returns the original value.
 * Otherwise, displays the right editor context value.
 *
 * @param {string} value
 * @param {Object} context
 *
 * @return {string} context value
 */
export const useContextValue = ( value, context ) => {
	const { clientId } = useBlockEditContext()
	const { usesContext, contextType } = useBlockAttributes( clientId )
	const availableContext = useAvailableContext( context )

	return useSelect( select => {
		if ( ! usesContext || ! contextType ) {
			return { usesContext: false, contextValue: value }
		}

		const foundContextObject = availableContext.find( ( { value } ) => value === contextType )
		if ( foundContextObject ) {
			const contextValue = foundContextObject.callback ? foundContextObject.callback( select ) : value
			return { usesContext, contextValue }
		}

		return { usesContext: false, contextValue: value }
	}, [ value, usesContext, contextType, availableContext ] )
}

export const getContextValue = ( attributes, fallback ) => {
	if ( ! attributes.usesContext || ! attributes.contextType ) {
		return fallback
	}

	return `!#STK_CONTEXT_${ attributes.contextType }!#`
}
