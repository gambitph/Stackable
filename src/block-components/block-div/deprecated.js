import { addFilter } from '@wordpress/hooks'
import { semverCompare } from '~stackable/util'

addFilter( 'stackable.block-components.block-div.classnames.content', 'stackable/3.8.0', ( classes, props ) => {
	if ( semverCompare( props.version, '<', '3.8.0' ) ) {
		classes.push( {
			'stk--block-margin-top-auto': false,
			'stk--block-margin-bottom-auto': false,
		} )

		// Column arrangement before was added in the block class (for non-Columns & Featyre blocks)
		if ( ! props.className.includes( 'stk-block-columns' ) && ! props.className.includes( 'stk-block-feature' ) ) {
			classes.push( {
				'stk--has-column-order': props.attributes.columnArrangementMobile || props.attributes.columnArrangementTablet,
			} )
		}
	}

	return classes
} )
