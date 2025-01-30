// This files is based on
// https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/components/link-control/use-internal-value.js
// This is a hook that keeps track of the internal value of a component, and
// updates the value only when the value changes.

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element'

/**
 * External dependencies
 */
import fastDeepEqual from 'fast-deep-equal'

export const useInternalValue = value => {
	const [ internalValue, setInternalValue ] = useState( value )
	const [ previousValue, setPreviousValue ] = useState( value )

	if ( ! fastDeepEqual( value, previousValue ) ) {
		setPreviousValue( value )
		setInternalValue( value )
	}

	return [ internalValue, setInternalValue ]
}
