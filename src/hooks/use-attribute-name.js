import {
	useBlockHoverState, useDeviceType,
} from '~stackable/hooks'
import { getAttributeName } from '~stackable/util'

export const useAttributeName = ( attrName, responsive = 'all', hover = 'all' ) => {
	const _deviceType = useDeviceType()
	const [ _hoverState ] = useBlockHoverState()

	// Only use the responsive attribute name if it's supported, if not, use the desktop name.
	let deviceType = 'desktop'
	if ( responsive === 'all' ) {
		deviceType = _deviceType
	} else if ( Array.isArray( responsive ) && responsive.includes( _deviceType ) ) {
		deviceType = _deviceType
	}

	// Only use the hover state attribute name if it's supported, if not, use the normal name.
	let hoverState = 'normal'
	if ( hover === 'all' ) {
		hoverState = _hoverState
	} else if ( Array.isArray( hover ) && hover.includes( _hoverState ) ) {
		hoverState = _hoverState
	}

	return getAttributeName( attrName, deviceType, hoverState )
}
