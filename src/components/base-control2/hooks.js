/**
 * Internal dependencies
 */
import {
	useAttributeName, useBlockAttributes, useBlockHoverState, useDeviceType,
} from '~stackable/hooks'
import { getAttributeName } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'
import { dispatch } from '@wordpress/data'

export const useControlHandlers = ( attribute, responsive = false, hover = false, valueCallback = null, onChangeCallback = null, suffixes = [] ) => {
	const { clientId } = useBlockEditContext()
	const deviceType = useDeviceType()
	const [ hoverState ] = useBlockHoverState()

	const attributes = useBlockAttributes( clientId )
	const attrName = useAttributeName( attribute, responsive, hover )

	let value = attributes[ attrName ]
	if ( suffixes.length ) {
		// Handle multiple value and onChange
		// Used by the FourRangeControl2 component.
		const newValues = []
		suffixes.forEach( suffix => {
			const args = [
				attribute + suffix,
				responsive === 'all' ? deviceType : ( Array.isArray( responsive ) && responsive.includes( deviceType ) ) ? deviceType : 'desktop',
				hover === 'all' ? hoverState : ( Array.isArray( hover ) && hover.includes( hoverState ) ) ? hoverState : 'normal',

			]

			let newValue = attributes[ getAttributeName( ...args ) ]
			if ( valueCallback ) {
				newValue = valueCallback( newValue, args[ 1 ], args[ 2 ] )
			}
			newValues.push( newValue )
		} )
		value = [ ...newValues ]
	} else if ( valueCallback ) {
		value = valueCallback( value )
	}

	const onChange = useMemo( () => {
		if ( suffixes.length ) {
			const onChangeFns = []
			suffixes.forEach( suffix => {
				const args = [
					attribute + suffix,
					responsive === 'all' ? deviceType : ( Array.isArray( responsive ) && responsive.includes( deviceType ) ) ? deviceType : 'desktop',
					hover === 'all' ? hoverState : ( Array.isArray( hover ) && hover.includes( hoverState ) ) ? hoverState : 'normal',

				]

				const _onChange = _value => {
					const value = onChangeCallback ? onChangeCallback( _value, args[ 1 ], args[ 2 ] ) : _value
					dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, { [ getAttributeName( ...args ) ]: value } )
				}

				onChangeFns.push( _onChange )
			} )

			return onChangeFns
		}

		return _value => {
			const value = onChangeCallback ? onChangeCallback( _value ) : _value
			dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, { [ attrName ]: value } )
		}
	}, [ clientId, attrName, onChangeCallback ] )

	return [ value, onChange ]
}
