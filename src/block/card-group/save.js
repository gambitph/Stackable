/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import classnames from 'classnames'

export default props => {
	const columns = ( props.attributes.columnWidths || [] ).map( ( width, i ) => {
		return `.stk-${ props.attributes.uniqueId } > .stk-column:nth-child(${ i + 1 }) {
			flex: 1 1 ${ width }% !important;
			max-width: ${ width }% !important;
		}`
	} )

	const classNames = classnames( [
		'stk-row',
		`stk-${ props.attributes.uniqueId }`,
	] )

	return (
		<div className="stk-card-group stk-block">
			{ columns.length ? <style>{ columns.join( '' ) }</style> : null }
			<div className={ classNames }>
				<InnerBlocks.Content />
			</div>
		</div>
	)
}
