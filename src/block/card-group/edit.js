import {
	InnerBlocks,
} from '@wordpress/block-editor'

const edit = props => {
	console.log( 'props.attributes.columnWidths', props.attributes.columnWidths )
	const columns = ( props.attributes.columnWidths || [] ).map( ( width, i ) => {
		return `[data-block="${ props.clientId }"] .block-editor-block-list__layout > [data-type^="stackable/"]:nth-child(${ i + 1 }) {
			flex: 1 1 ${ width }% !important;
			max-width: ${ width }% !important;
		}`
	} )

	return <div className="stk-card-group stk-block stk-row">
		{ columns.length ? <style>{ columns.join( '' ) }</style> : null }
		<div className="stk-card-group-inner">
			<InnerBlocks
				orientation="horizontal"
				allowedBlocks={ [ 'stackable/card' ] }
			/>
		</div>
	</div>
}

export default edit
