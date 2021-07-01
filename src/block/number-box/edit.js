import {
	InnerBlocks,
	__experimentalBlock as Block,
} from '@wordpress/block-editor'
import { Fragment, useRef } from '@wordpress/element'
import {
	useSelect, select,
} from '@wordpress/data'
import { BlockContainer } from '~stackable/components'
import { ResizableBox } from '@wordpress/components'

const TEMPLATE = [
	[ 'core/heading', { content: 'Number Title' } ],
	[ 'core/paragraph', { content: 'Number Text' } ],
]

const Edit = props => {
	const hasInnerBlocks = useSelect(
		select => {
			const { getBlock } = select( 'core/block-editor' )
			const block = getBlock( props.clientId )
			return !! ( block && block.innerBlocks.length )
		},
		[ props.clientId ]
	)

	const { toggleSelection, isSelected } = props
	// const ref = useRef()
	// const { hasSelectedInnerBlock } = select( 'core/block-editor' )
	// const isAncestorOfSelectedBlock = hasSelectedInnerBlock(
	// 	props.clientId,
	// 	true
	// )
	// console.log( ref )//?.current && ref.current.matches( ':hover' ) )

	return (
		<ResizableBox
			enable={ {
				top: false,
				right: true,
				bottom: false,
				left: true,
				topRight: false,
				bottomRight: false,
				bottomLeft: false,
				topLeft: false,
			} }
			onResizeStart={ () => {
				toggleSelection( false )
			} }
			showHandle={ isSelected }
			// showHandle={ false }
			// showHandle={ ref?.current && ref.current.matches( ':hover' ) }
			onResize={ ( _event, _direction, elt, delta ) => {
				// console.log( elt.clientWidth, delta )
				// onResize( elt.clientHeight );
			} }
		>
			<div className="stk-number-box">
				01
				<InnerBlocks
					// orientation="horizontal"
					template={ TEMPLATE }
					renderAppender={ () => ! hasInnerBlocks ? <InnerBlocks.ButtonBlockAppender /> : <InnerBlocks.DefaultBlockAppender /> }
					// allowedBlocks={ [ 'stackable/card' ] }
				/>
			</div>
		</ResizableBox>
	)
}

export default Edit
