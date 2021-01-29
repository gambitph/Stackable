/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import classnames from 'classnames'

export default props => {
	const {
		hasBackground,
	} = props.attributes

	const columns = ( props.attributes.columnWidths || [] ).map( ( width, i ) => {
		return `.stk-${ props.attributes.uniqueId } > .stk-column:nth-child(${ i + 1 }) {
			flex: 1 1 ${ width }% !important;
			max-width: ${ width }% !important;
		}`
	} )

	const blockClassName = classnames( [
		'stk-card-group',
		'stk-block',
		`stk-${ props.attributes.uniqueId }`,
	], {
		'stk-block-background': hasBackground,
	} )

	const contentClassNames = classnames( [
		'stk-row',
		'stk-block-content',
	] )

	return (
		<div className={ blockClassName } data-id={ props.attributes.uniqueId }>
			{ columns.length ? <style>{ columns.join( '' ) }</style> : null }
			<div className={ contentClassNames }>
				<InnerBlocks.Content />
			</div>
		</div>
	)
}
