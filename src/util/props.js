export const getPropsWithDefaults = ( props, defaultProps ) => {
	const propsWithDefaults = { ...props }

	Object.entries( defaultProps ).forEach( ( [ key, value ] ) => {
		if ( typeof propsWithDefaults[ key ] === 'undefined' ) {
			propsWithDefaults[ key ] = value
		}
	} )

	return propsWithDefaults
}
