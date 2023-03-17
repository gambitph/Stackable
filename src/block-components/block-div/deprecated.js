import { addFilter } from '@wordpress/hooks'
import compareVersions from 'compare-versions'

addFilter( 'stackable.block-components.block-div.classnames.content', 'stackable/3.8.0', ( classes, props ) => {
	if ( compareVersions( props.version, '3.8.0' ) >= 0 ) {
		return classes
	}

	classes.push( {
		'stk--block-margin-top-auto': false,
		'stk--block-margin-bottom-auto': false,
	} )
	return classes
} )
