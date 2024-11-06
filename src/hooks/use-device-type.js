import {
	useSelect, createReduxStore, register,
} from '@wordpress/data'

export const useDeviceType = () => {
	const { deviceType } = useSelect( select => {
		let deviceType = 'Desktop'

		deviceType = select( 'core/editor' )?.getDeviceType?.() ||
			select( 'core/edit-site' )?.__experimentalGetPreviewDeviceType?.() ||
			select( 'core/edit-post' )?.__experimentalGetPreviewDeviceType?.() ||
			select( 'stackable/device-type' ).getDeviceType()

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
