import {
	useSelect, createReduxStore, register, select as wpSelect,
} from '@wordpress/data'

// Retrive device type outside react js; when react-hook can't be used
export const getDeviceType = () => {
	let deviceType = 'Desktop'
	// In some editors, there is no edit-post / preview device type. If that
	// happens, we just set our own internal device type.
	if ( wpSelect( 'core/edit-post' ) ) {
		deviceType = wpSelect( 'core/edit-post' ).__experimentalGetPreviewDeviceType()
	} else {
		deviceType = wpSelect( 'stackable/device-type' ).getDeviceType()
	}
	return deviceType || ''
}

export const useDeviceType = () => {
	const { deviceType } = useSelect( select => {
		let deviceType = 'Desktop'

		// In some editors, there is no edit-post / preview device type. If that
		// happens, we just set our own internal device type.
		if ( select( 'core/edit-post' ) ) {
			deviceType = select( 'core/edit-post' ).__experimentalGetPreviewDeviceType()
		} else {
			deviceType = select( 'stackable/device-type' ).getDeviceType()
		}
		return { deviceType }
	}, [] )

	return deviceType || ''
}

/**
 * Internal store for the device type just in case the editor doesn't have one.
 */
const STORE_ACTIONS = {
	setDeviceType: deviceType => {
		return { type: 'UPDATE_DEVICE_TYPE', deviceType }
	},
}

const STORE_SELECTORS = {
	getDeviceType: state => state,
}

const STORE_REDUCER = ( state = 'Desktop', action ) => {
	switch ( action.type ) {
		case 'UPDATE_DEVICE_TYPE': {
			return action.deviceType
		}
	}
	return state
}

register( createReduxStore( 'stackable/device-type', {
	reducer: STORE_REDUCER,
	actions: STORE_ACTIONS,
	selectors: STORE_SELECTORS,
} ) )
