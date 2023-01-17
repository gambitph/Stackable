// From https://github.com/streamich/react-use/blob/master/docs/useLatest.md
import { useRef } from '@wordpress/element'

export const useLatest = value => {
	const ref = useRef( value )
	ref.current = value
	return ref
}
