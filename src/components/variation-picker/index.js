/**
 * WordPress dependencies
 */
import { __experimentalBlockVariationPicker } from '@wordpress/block-editor' // eslint-disable-line @wordpress/no-unsafe-wp-apis

const VariationPicker = props => {
	return (
		<div className="stk-variation-picker">
			<__experimentalBlockVariationPicker
				{ ...props }
			/>
		</div>
	)
}

export default VariationPicker
