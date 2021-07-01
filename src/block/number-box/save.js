/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'

export default function save() {
	return (
		<div className="stk-number-box">
			<InnerBlocks.Content />
		</div>
	)
}
