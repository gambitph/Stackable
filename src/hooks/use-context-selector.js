/**
 * This is a modified version of https://github.com/dai-shi/use-context-selector
 *
 * Modifications:
 * - This now uses the React that's bundled with WordPress
 * - We use fast-deep-equal instead of referencial equality for objects (since
 *   this is mostly used for attribute)
 */

import {
	createElement,
	createContext as createContextOrig,
	useContext as useContextOrig,
	useLayoutEffect,
	useReducer,
	useRef,
	useState,
} from '@wordpress/element'

import isObjectEqual from 'fast-deep-equal'

const CONTEXT_VALUE = Symbol()
const ORIGINAL_PROVIDER = Symbol()

const createProvider = ProviderOrig => {
	const ContextProvider = ( { value, children } ) => {
		const valueRef = useRef( value )
		const versionRef = useRef( 0 )
		const [ resolve, setResolve ] = useState( null )
		if ( resolve ) {
			resolve( value )
			setResolve( null )
		}
		const contextValue = useRef()
		if ( ! contextValue.current ) {
			const listeners = new Set()
			const update = ( thunk, options ) => {
				// batchedUpdates( () => {
				versionRef.current += 1
				const action = {
					n: versionRef.current,
				}
				if ( options?.suspense ) {
					action.n *= -1 // this is intentional to make it temporary version
					action.p = new Promise( r => {
						setResolve( () => v => {
							action.v = v
							delete action.p
							r( v )
						} )
					} )
				}
				listeners.forEach( listener => listener( action ) )
				thunk()
				// } )
			}
			contextValue.current = {
				[ CONTEXT_VALUE ]: {
					/* "v"alue     */ v: valueRef,
					/* versio"n"   */ n: versionRef,
					/* "l"isteners */ l: listeners,
					/* "u"pdate    */ u: update,
				},
			}
		}
		useLayoutEffect( () => {
			valueRef.current = value
			versionRef.current += 1
			// runWithNormalPriority( () => {
			contextValue.current[ CONTEXT_VALUE ].l.forEach( listener => {
				listener( { n: versionRef.current, v: value } )
			} )
			// } )
		}, [ value ] )
		return createElement( ProviderOrig, { value: contextValue.current }, children )
	}
	return ContextProvider
}

/**
 * This creates a special context for `useContextSelector`.
 *
 * @param {Object} defaultValue
 * @example
 * import { createContext } from 'use-context-selector';
 *
 * const PersonContext = createContext({ firstName: '', familyName: '' });
 */
export function createContext( defaultValue ) {
	const context = createContextOrig( {
		[ CONTEXT_VALUE ]: {
			/* "v"alue     */ v: { current: defaultValue },
			/* versio"n"   */ n: { current: -1 },
			/* "l"isteners */ l: new Set(),
			/* "u"pdate    */ u: f => f(),
		},
	} )
	context[ ORIGINAL_PROVIDER ] = context.Provider
	context.Provider = createProvider( context.Provider )
	delete context.Consumer // no support for Consumer
	return context
}

// Check if it's an object (with properties, not array)
const isObject = value => ! Array.isArray( value ) && typeof value === 'object'

// Use fast-deep-equal if an object, if not an object, use referencial equality.
const isValueEqual = ( value1, value2 ) => {
	return isObject( value1 )
		? isObjectEqual( value1, value2 ) // Check if the objects have the same property values.
		: Object.is( value1, value2 ) // Check for referencial equality
}

/**
 * This hook returns context selected value by selector.
 *
 * It will only accept context created by `createContext`.
 * It will trigger re-render if only the selected value is referentially changed.
 *
 * The selector should return referentially equal result for same input for better performance.
 *
 * @param {Context} context
 * @param {Function} selector
 * @example
 * import { useContextSelector } from 'use-context-selector';
 *
 * const firstName = useContextSelector(PersonContext, state => state.firstName);
 */
export function useContextSelector( context, selector ) {
	const contextValue = useContextOrig( context )[ CONTEXT_VALUE ]

	const {
		/* "v"alue     */ v: { current: value },
		/* versio"n"   */ n: { current: version },
		/* "l"isteners */ l: listeners,
	} = contextValue
	const selected = selector( value )
	const [ state, dispatch ] = useReducer( ( prev, action ) => {
		if ( ! action ) {
			// case for `dispatch()` below
			return [ value, selected ]
		}
		if ( 'p' in action ) {
			throw action.p
		}
		if ( action.n === version ) {
			if ( isValueEqual( prev[ 1 ], selected ) ) {
				return prev // bail out
			}
			return [ value, selected ]
		}
		try {
			if ( 'v' in action ) {
				if ( isValueEqual( prev[ 0 ], action.v ) ) {
					return prev // do not update
				}
				const nextSelected = selector( action.v )
				if ( isValueEqual( prev[ 1 ], nextSelected ) ) {
					return prev // do not update
				}
				return [ action.v, nextSelected ]
			}
		} catch ( e ) {
			// ignored (stale props or some other reason)
		}
		return [ ...prev ] // schedule update
	}, [ value, selected ] )
	if ( ! isValueEqual( state[ 1 ], selected ) ) {
		// schedule re-render
		// this is safe because it's self contained
		dispatch()
	}
	useLayoutEffect( () => {
		listeners.add( dispatch )
		return () => {
			listeners.delete( dispatch )
		}
	}, [ listeners ] )
	return state[ 1 ]
}
