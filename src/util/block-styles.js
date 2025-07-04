import { getCleanAttributes, STACKABLE_FILTERS } from './blocks'

import { isEqual } from 'lodash'
import { select } from '@wordpress/data'

export const isBlockStyleAttributesModified = ( blockName, styleSlug, _blockAttrs ) => {
	const blockStyleAttrs = select( 'stackable/global-block-styles' ).getBlockStyles( blockName )?.find( item => item.slug === styleSlug )?.attributes || {}
	const blockAttrs = getCleanAttributes( _blockAttrs, blockName )
	const currentAttrs = ( [ ...( STACKABLE_FILTERS[ blockName ] || [] ), 'uniqueId', 'generatedCss', 'blockStyle', 'modifiedBlockStyle' ] ).reduce( ( output, attribute ) => {
		if ( output[ attribute ] ) {
			delete output[ attribute ]
		}

		return output
	}, blockAttrs )

	return ! isEqual( blockStyleAttrs, currentAttrs )
}
