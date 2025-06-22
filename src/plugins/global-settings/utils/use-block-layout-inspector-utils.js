/**
 * Internal dependencies
 */
import { hoverState } from './block-layout-utils'

/**
 * External dependencies
 */
import { getShadows } from '~stackable/components'
import { IMAGE_SHADOWS } from '~stackable/block-components'
import { useDeviceType, useBlockHoverState } from '~stackable/hooks'
import { saveSettings as saveAdminSettings } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { useSelect, dispatch } from '@wordpress/data'

export const useBlockLayoutInspectorUtils = ( storeName, optionName, setDisplayHoverNotice, saveTimeout ) => {
	const { blockLayouts } = useSelect( select => {
		const _blockLayouts = select( storeName ).getBlockLayouts()
		return { blockLayouts: { ..._blockLayouts } }
	}, [] )

	const [ currentHoverState ] = useBlockHoverState( { forceUpdateHoverState: true } )
	const deviceType = useDeviceType()

	const shadows = getShadows()

	const getValue = ( property, {
		responsive = false, hover = false, unit = false,
	} = {} ) => {
		const device = responsive ? deviceType.toLowerCase() : 'desktop'
		const state = hover ? hoverState[ currentHoverState ] : ''
		const withUnit = unit ? 'Unit' : ''
		const deviceState = `${ device }${ state }${ withUnit }`

		return blockLayouts[ property ]?.[ deviceState ]
	}

	const valueCallback = ( value, isImage = false ) => {
		const options = isImage ? IMAGE_SHADOWS : shadows
		return value ? ( options.indexOf( value ) === -1 ? 'custom' : options.indexOf( value ) ) : ''
	}

	const changeCallback = ( index, isImage = false ) => {
		const options = isImage ? IMAGE_SHADOWS : shadows
		return index !== '' ? options[ index ] : index
	}

	const saveSettings = newSettings => {
		clearTimeout( saveTimeout )
		saveTimeout = setTimeout( () => {
			saveAdminSettings( { [ optionName ]: newSettings } ) // eslint-disable-line camelcase
		}, 300 )

		// Update our store.
		dispatch( storeName ).updateBlockLayouts( newSettings )
	}

	const onChange = ( property, _value, {
		responsive = false, hover = false, unit = false,
	} = {} ) => {
		const newSettings = { ...blockLayouts }
		let state = 'desktop'

		if ( responsive ) {
			state = deviceType.toLowerCase()
		}

		if ( hover ) {
			state += hoverState[ currentHoverState ]
		}

		if ( unit ) {
			state += 'Unit'
		}

		// Display the Hover Notice if we're not in normal state and we're not changing the unit.
		if ( currentHoverState !== 'normal' && ! unit ) {
			const disableHoverNotice = localStorage.getItem( 'stk-disable-global-block-layouts-hover-notice' )

			if ( ! disableHoverNotice ) {
				setDisplayHoverNotice( true )
			}
		}

		if ( ! ( property in newSettings ) ) {
			newSettings[ property ] = {}
		}

		if ( _value === '' ||
			( typeof _value === 'object' && Object.values( _value ).every( v => v === '' ) ) ||
			( unit && _value === 'px' ) ) {
			delete newSettings[ property ][ state ]

			if ( Object.keys( newSettings[ property ] ).length === 0 ) {
				delete newSettings[ property ]
			}
		} else if ( typeof _value === 'object' ) {
			const value = {}

			if ( _value.top !== '' ) {
				value.top = _value.top
			}
			if ( _value.right !== '' ) {
				value.right = _value.right
			}
			if ( _value.bottom !== '' ) {
				value.bottom = _value.bottom
			}
			if ( _value.left !== '' ) {
				value.left = _value.left
			}

			newSettings[ property ][ state ] = value
		} else {
			newSettings[ property ][ state ] = _value
		}

		saveSettings( newSettings )
	}

	const getHasDeviceValue = ( property, device ) => {
		if ( property in blockLayouts ) {
			const states = {
				normal: device,
				hover: `${ device }Hover`,
				'parent-hover': `${ device }ParentHover`,
			}

			return blockLayouts[ property ]?.[ states.normal ] !== undefined ||
			blockLayouts[ property ]?.[ states.hover ] !== undefined ||
			blockLayouts[ property ]?.[ states[ 'parent-hover' ] ] !== undefined
		}
		return false
	}

	const getHasHoverStateValues = ( property, responsive = false ) => {
		const values = { hover: false, 'parent-hover': false }

		if ( property in blockLayouts ) {
			const states = {
				hover: `${ responsive ? deviceType.toLowerCase() : 'desktop' }Hover`,
				'parent-hover': `${ responsive ? deviceType.toLowerCase() : 'desktop' }ParentHover`,
			}
			values.hover = blockLayouts[ property ]?.[ states.hover ] !== undefined
			values[ 'parent-hover' ] = blockLayouts[ property ]?.[ states[ 'parent-hover' ] ] !== undefined
		}

		return values
	}

	return [
		blockLayouts,
		getValue,
		valueCallback,
		changeCallback,
		saveSettings,
		onChange,
		getHasDeviceValue,
		getHasHoverStateValues,
	]
}
