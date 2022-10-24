import { useRef, useEffect } from '@wordpress/element'

export const useUpdateEffect = ( effect, deps ) => {
	const mounted = useRef( false )

	useEffect( () => {
		if ( mounted.current ) {
			return effect()
		}
		mounted.current = true
		return undefined
	}, deps )
}
