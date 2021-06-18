import {
	useBlockHoverState, useDeviceType,
} from '~stackable/hooks'
import { getAttributeName } from '~stackable/util'

export const useAttributeName = attrName => {
	const deviceType = useDeviceType()
	const [ hoverState ] = useBlockHoverState()

	return getAttributeName( attrName, deviceType, hoverState )
}
