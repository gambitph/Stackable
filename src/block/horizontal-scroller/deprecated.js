import { Save } from './save'
import { attributes } from './schema'

import { withVersion } from '~stackable/higher-order'
import { addFilter } from '@wordpress/hooks'
import compareVersions from 'compare-versions'

// Previously, our horizontal scroller always had the stk--fit-content class (which was wrong).
addFilter( 'stackable.horizontal-scroller.save.contentClassNames', 'stackable/3_8_0', ( classes, props ) => {
	if ( compareVersions( props.version, '3.8.0' ) >= 0 ) { // Current version is greater than 3.6.1
		return classes
	}

	return [
		...classes,
		{ 'stk--fit-content': true },
	]
} )

const deprecated = [
	// Support new margin-top/bottom classes.
	{
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
	},
]
export default deprecated
