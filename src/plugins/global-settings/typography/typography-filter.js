/**
 * External dependencies
 */
import { keys, cloneDeep } from 'lodash'

/**
 * Wordpress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Add filter for changing the typography styles in the inspector
export const addTypographyControlFilter = settings => addFilter( 'stackable.typography-control', 'global-typography', props => {
	if ( ! Array.isArray( settings ) && ! settings.length ) {
		return props
	}

	const newProps = cloneDeep( props )

	// Get the typography settings based in htmlTag
	const typographySettings = settings[ 0 ][ props.htmlTag ]

	keys( typographySettings ).forEach( attributeName => {
		newProps[ attributeName ] = newProps[ attributeName ] || typographySettings[ attributeName ]
	} )

	return newProps
} )
