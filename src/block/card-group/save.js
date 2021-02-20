/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import classnames from 'classnames'

export default props => {
	const {
		hasBackground,
	} = props.attributes

	const blockClassName = classnames( [
		'stk-card-group',
		'stk-block',
		`stk-${ props.attributes.uniqueId }`,
	], {
		'stk-block-background': hasBackground,
	} )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		'stk-row',
		'stk-block-content',
	] )

	return (
		<div className={ blockClassName } data-id={ props.attributes.uniqueId }>
			<div className={ contentClassNames }>
				<InnerBlocks.Content />
			</div>
		</div>
	)
}
