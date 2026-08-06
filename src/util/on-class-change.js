/**
 * Shared MutationObserver for class attribute changes on a DOM element.
 *
 * Multiple callers can subscribe via onClassChange( node, callback ) without
 * each creating their own observer on the same element.
 */

const observersByNode = new WeakMap()

const scheduleCallbacks = ( node, state ) => {
	if ( state.rafId || state.callbacks.size === 0 ) {
		return
	}

	state.rafId = requestAnimationFrame( () => {
		state.rafId = null

		if ( state.callbacks.size === 0 ) {
			return
		}

		const classString = node.classList.toString()
		if ( classString === state.lastClassString ) {
			return
		}

		state.lastClassString = classString

		// Prevent our own classList writes from re-triggering the observer synchronously.
		state.mutationObserver.disconnect()

		for ( const callback of state.callbacks ) {
			callback()
		}

		state.lastClassString = node.classList.toString()
		state.mutationObserver.observe( node, { attributes: true } )
	} )
}

const getOrCreateState = node => {
	let state = observersByNode.get( node )

	if ( ! state ) {
		state = {
			callbacks: new Set(),
			lastClassString: node.classList.toString(),
			mutationObserver: null,
			rafId: null,
		}

		state.mutationObserver = new MutationObserver( mutationList => {
			for ( const item of mutationList ) {
				if ( item.attributeName === 'class' ) {
					const classString = node.classList.toString()
					if ( classString !== state.lastClassString ) {
						scheduleCallbacks( node, state )
					}
					break
				}
			}
		} )

		state.mutationObserver.observe( node, { attributes: true } )
		observersByNode.set( node, state )
	}

	return state
}

const destroyState = ( node, state ) => {
	if ( state.rafId ) {
		cancelAnimationFrame( state.rafId )
	}
	state.mutationObserver.disconnect()
	observersByNode.delete( node )
}

/**
 * Subscribe to class changes on a DOM element. Uses one shared MutationObserver
 * per element, even when called multiple times.
 *
 * @param {HTMLElement} node The DOM element to observe.
 * @param {Function} callback Called when the element's class attribute changes.
 * @return {Function} Unsubscribe function.
 */
export const onClassChange = ( node, callback ) => {
	if ( ! node || typeof callback !== 'function' ) {
		return () => {}
	}

	const state = getOrCreateState( node )
	state.callbacks.add( callback )

	return () => {
		state.callbacks.delete( callback )
		if ( state.callbacks.size === 0 ) {
			destroyState( node, state )
		}
	}
}
