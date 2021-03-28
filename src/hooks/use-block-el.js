/**
 * Internal dependencies
 */
import { useBlockAttributes } from './use-block-attributes'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'

export const useBlockEl = () => {
	const { clientId } = useBlockEditContext()
	const { uniqueId } = useBlockAttributes( clientId )
	return document.querySelector( `.stk-${ uniqueId }` )
}
