/**
 * WordPress dependencies
 */
import { TextControl } from '@wordpress/components'

const SmallNumberControl = props => {
	return (
		<TextControl
			type="number"
			className="ugb-small-number-control"
			{ ...props }
			__next40pxDefaultSize
		/>
	)
}

export default SmallNumberControl
