/**
 * Use when the element is in the viewport
 *
 * From https://usehooks.com/useOnScreen/
 */
import { useState, useEffect } from '@wordpress/element'

export const useOnScreen = ( ref, rootMargin = '0px' ) => {
	const [ isIntersecting, setIntersecting ] = useState( false )
	useEffect( () => {
		const observer = new IntersectionObserver(
			( [ entry ] ) => {
				setIntersecting( entry.isIntersecting )
			},
			{
				rootMargin,
			}
		)

		if ( ref.current ) {
			observer.observe( ref.current )
		}

		return () => {
			if ( ref.current ) {
				observer.unobserve( ref.current )
			}
		}
	} )

	return isIntersecting
}

export const useOnScreenOnce = ( ref, rootMargin = '0px' ) => {
	const [ isIntersecting, setIntersecting ] = useState( false )
	useEffect( () => {
		const observer = new IntersectionObserver(
			( [ entry ] ) => {
				if ( entry.isIntersecting ) {
					setIntersecting( entry.isIntersecting )
					observer.unobserve( ref.current )
				}
			},
			{
				rootMargin,
			}
		)

		if ( ref.current ) {
			observer.observe( ref.current )
		}

		return () => {
			if ( ref.current ) {
				observer.unobserve( ref.current )
			}
		}
	} )

	return isIntersecting
}
