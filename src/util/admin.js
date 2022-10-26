/**
 * Shared functions used in the admin / settings.
 */
import { sortBy } from 'lodash'

// Collect all the blocks and their variations for enabling/disabling and sort
// them by type.
export const importBlocks = r => {
	const blocks = {}
	r.keys().forEach( key => {
		const meta = r( key )
		const type = meta[ 'stk-type' ]
		if ( type ) {
			if ( ! blocks[ type ] ) {
				blocks[ type ] = []
			}
			blocks[ type ].push( meta )
		}

		// Add any varations if any.
		( meta[ 'stk-variants' ] || [] ).forEach( variation => {
			const type = variation[ 'stk-type' ]
			if ( type ) {
				if ( ! blocks[ type ] ) {
					blocks[ type ] = []
				}
				blocks[ type ].push( {
					...variation,
					name: `${ meta.name }|${ variation.name }`,
				} )
			}
		} )
	} )
	Object.keys( blocks ).forEach( type => {
		blocks[ type ] = sortBy( blocks[ type ], 'name' )
	} )
	return blocks
}
