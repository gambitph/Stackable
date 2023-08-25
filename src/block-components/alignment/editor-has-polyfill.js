/**
 * External dependencies
 */
import { useBlockContext } from '~stackable/hooks'

import { select } from '@wordpress/data'
import { useBlockEditContext } from '@wordpress/block-editor'

export const EditorHasPolyfill = () => {
	const {
		hasInnerBlocks, numInnerBlocks, innerBlocks,
	} = useBlockContext()

	const { clientId, name } = useBlockEditContext()
	const getBlockAttributes = select( 'core/block-editor' ).getBlockAttributes

	const classesToAdd = {
		'stk--alignment-polyfill': false,
		'stk--child-has-margin-top-auto': false,
		'stk--child-has-margin-bottom-auto': false,
	}
	if ( name === 'stackable/column' ) {
		const { innerBlockAlign, innerBlockJustify } = getBlockAttributes( clientId )

		if ( innerBlockAlign !== '' || innerBlockJustify !== '' ) {
			classesToAdd[ 'stk--alignment-polyfill' ] = true
		}
	}

	if ( hasInnerBlocks ) {
		for ( let i = 0; i < numInnerBlocks; i++ ) {
			const innerBlockClientId = innerBlocks[ i ].clientId
			const { blockMargin } = getBlockAttributes( innerBlockClientId )
			if ( blockMargin && blockMargin?.top === 'auto' ) {
				classesToAdd[ 'stk--alignment-polyfill' ] = true
				classesToAdd[ 'stk--child-has-margin-top-auto' ] = true
			}
			if ( blockMargin && blockMargin?.bottom === 'auto' ) {
				classesToAdd[ 'stk--alignment-polyfill' ] = true
				classesToAdd[ 'stk--child-has-margin-bottom-auto' ] = true
			}
		}
	}
	return classesToAdd
}

