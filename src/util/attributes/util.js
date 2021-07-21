/**
 * Generates all the permutations of a given multi-dimensional array of strings.
 *
 * @param {Array} array Multi-dimensional array of strings to combine
 * @param {string} prefix used by the recursive function
 * @return {Array} Strings permutated
 */
export const getPermutation = ( array, prefix = '' ) => {
	if ( ! array.length ) {
		return prefix
	}

	return array[ 0 ].reduce( ( result, value ) => {
		return result.concat( getPermutation( array.slice( 1 ), prefix + value ) )
	}, [] )
}
