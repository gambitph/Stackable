import {
	InnerBlocks,
	__experimentalBlock as Block,
} from '@wordpress/block-editor'
import {
	Fragment, useRef, useEffect, useState,
} from '@wordpress/element'
import {
	useSelect, select,
} from '@wordpress/data'
import classnames from 'classnames'
import {
	first, last, indexOf, nth,
} from 'lodash'
import { BlockContainer } from '~stackable/components'
import { ResizableBox } from '@wordpress/components'
import { compose, createHigherOrderComponent } from '@wordpress/compose'
import { withUniqueClass } from '~stackable/higher-order'
import { useShowMoversGestures } from './util'

export const createUniqueClass = uid => `${ uid.substring( 0, 7 ) }`

const TEMPLATE = [
	[ 'core/heading', { content: 'Card Title' } ],
	[ 'core/paragraph', { content: 'Card Text' } ],
]

const useUniqueId = props => {
	useEffect( () => {
		// When there's no unique ID yet, create one.
		if ( ! props.attributes.uniqueId ) {
			props.attributes.uniqueId = createUniqueClass( props.clientId )
		// If there's one already, check whether the we need to re-create one.
		// Duplicating a block or copy pasting a block may give us duplicate IDs.
		} else if ( createUniqueClass( props.clientId ) !== props.attributes.uniqueId ) {
			if ( document.querySelectorAll( `[data-id="${ props.attributes.uniqueId }"]` ).length > 1 ) {
				props.attributes.uniqueId = createUniqueClass( props.clientId )
			}
		}
	}, [] )
}

const useFirstLastBlock = props => {
	const blockInfo = useSelect(
		select => {
			const { getBlock, getBlockParents } = select( 'core/block-editor' )
			const parentClientId = first( getBlockParents( props.clientId ) )
			const parent = parentClientId ? getBlock( parentClientId ) : null
			const index = indexOf( parent?.innerBlocks, getBlock( props.clientId ) )
			const isLastBlock = last( parent?.innerBlocks )?.clientId === props.clientId
			// getAdjacentBlockClientId
			return {
				parentBlock: parent,
				isFirstBlock: first( parent?.innerBlocks )?.clientId === props.clientId,
				isLastBlock,
				adjacentBlock: nth( parent?.innerBlocks, ! isLastBlock ? index + 1 : index - 1 ),
				adjacentBlocks: parent?.innerBlocks || [],
			}
		},
		[ props.clientId ]
	)

	// Quietly update the first block attribute.
	useEffect( () => {
		props.attributes.isFirstBlock = blockInfo.isFirstBlock
	}, [ blockInfo.isFirstBlock ] )

	// Quietly update the last block attribute.
	useEffect( () => {
		props.attributes.isLastBlock = blockInfo.isLastBlock
	}, [ blockInfo.isLastBlock ] )

	return blockInfo
}

const useHasInnerBlocks = props => {
	const {
		hasInnerBlocks,
	} = useSelect(
		select => {
			const { getBlock } = select( 'core/block-editor' )
			const block = getBlock( props.clientId )
			return {
				hasInnerBlocks: !! ( block && block.innerBlocks.length ),
			}
		},
		[ props.clientId ]
	)

	return hasInnerBlocks
}

const withIsHovered = createHigherOrderComponent(
	WrappedComponent => props => {
		const ref = useRef()
		const { showMovers, gestures } = useShowMoversGestures( { ref } )
		return (
			<div
				{ ...gestures }
				ref={ ref }
			>
				<WrappedComponent { ...props } isHovered={ showMovers } />
			</div>
		)
	},
	'withIsHovered'
)

const Edit = props => {
	const hasInnerBlocks = useHasInnerBlocks( props )
	// const {
	// 	isFirstBlock, isLastBlock, adjacentBlock,
	// } = useBlockInfo( props )
	const {
		isFirstBlock, isLastBlock, adjacentBlock, parentBlock,
	} = useFirstLastBlock( props )
	useUniqueId( props )

	// console.log( 'adjacentBlock', props.clientId, adjacentBlock.clientId )
	// console.log( 'isfirst block', props.clientId, adjacentBlock.clientId )

	const {
		toggleSelection, isSelected, setAttributes, isHovered,
	} = props
	// const ref = useRef()
	// const { hasSelectedInnerBlock } = select( 'core/block-editor' )
	// const isAncestorOfSelectedBlock = hasSelectedInnerBlock(
	// 	props.clientId,
	// 	true
	// )
	// console.log( ref )//?.current && ref.current.matches( ':hover' ) )

	const [ resizeableHovered, setResizeableHovered ] = useState( false )
	// console.log( 'showMovers', nodeRef?.current && nodeRef.current.matches( ':hover' ) )

	// const [ isHovered, hoverDivProps ] = useIsHovered()
	const [ currentWidth, setCurrentWidth ] = useState( 100 )

	const classNames = classnames( [
		'stk-card',
		'stk-column',
		`stk-${ props.attributes.uniqueId }`,
	], {
		'stk-is-first': isFirstBlock,
		'stk-is-last': isLastBlock,
	} )

	return (
		<Fragment>
			<style>
				{ props.attributes.columnWidth ? `[data-block="${ props.clientId }"] {
					flex: 1 1 ${ props.attributes.columnWidth }% !important;
					max-width: ${ props.attributes.columnWidth }% !important;
				}` : null }
			</style>
			<ResizableBox
				enable={ {
					top: false,
					right: ! isLastBlock,
					bottom: false,
					left: ! isFirstBlock,
					topRight: false,
					bottomRight: false,
					bottomLeft: false,
					topLeft: false,
				} }
				className="stk-column-resizeable"
				showHandle={ isSelected || isHovered }
				// showHandle={ false }
				// showHandle={ ref?.current && ref.current.matches( ':hover' ) }
				onResizeStart={ ( _event, _direction, elt ) => {
					toggleSelection( false )
					setCurrentWidth( elt.clientWidth )
					// wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( adjacentBlock.clientId, {
					// 	columnWidth: '',
					// } )
				} }
				onResize={ ( _event, _direction, elt, delta ) => {
					const parent = elt.closest( '.block-editor-block-list__layout' )
					// const columnWidth = parseFloat( ( elt.clientWidth / parent.clientWidth * 100 ).toFixed( 1 ) )
					// let columnWidth = parent.attributes.columnWidths?[0]
					// if ( ! columnWidth )
					const columnWidth = parseFloat( ( ( currentWidth + delta.width ) / parent.clientWidth * 100 ).toFixed( 1 ) )
					// console.log( ( elt.clientWidth / parent.clientWidth * 100 ).toFixed( 1 ), delta )
					// console.log( currentWidth + delta.width, currentWidth, delta.width )
					// parentBlock
					// setAttributes( { columnWidth } )
					const columnWidths = [ columnWidth, 100 - columnWidth ]
					console.log( 'columnWidths', columnWidths, parentBlock )

					const columnStyles = ( columnWidths || [] ).map( ( width, i ) => {
						return `[data-block="${ parentBlock.clientId }"] .block-editor-block-list__layout > [data-type^="stackable/"]:nth-child(${ i + 1 }) {
							flex: 1 1 ${ width }% !important;
							max-width: ${ width }% !important;
						}`
					} ).join( '' )

					let parentStyleEl = document.querySelector( `style#stk-style-${ parentBlock.clientId }` )
					if ( ! parentStyleEl ) {
						parentStyleEl = document.createElement( 'style' )
						parentStyleEl.setAttribute( 'id', `stk-style-${ parentBlock.clientId }` )
						document.body.appendChild( parentStyleEl )
					}
					parentStyleEl.innerHTML = columnStyles

					// parentBlock.attributes.columnWidths = columnWidths
					// wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( parentBlock.clientId, { columnWidths } )

					// wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( props.clientId, { columnWidth } )
					// wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( adjacentBlock.clientId, {
					// 	columnWidth: 100 - columnWidth,
					// } )

					// onResize( elt.clientHeight );
				} }
				onResizeStop={ ( _event, _direction, elt, delta ) => {
					const parent = elt.closest( '.block-editor-block-list__layout' )
					// const columnWidth = parseFloat( ( elt.clientWidth / parent.clientWidth * 100 ).toFixed( 1 ) )
					const columnWidth = parseFloat( ( ( currentWidth + delta.width ) / parent.clientWidth * 100 ).toFixed( 1 ) )
					const columnWidths = [ columnWidth, 100 - columnWidth ]
					wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( parentBlock.clientId, { columnWidths } )

					setTimeout( () => {
						const parentStyleEl = document.querySelector( `style#stk-style-${ parentBlock.clientId }` )
						if ( parentStyleEl ) {
							document.body.removeChild( parentStyleEl )
						}
					}, 100 )
					// console.log( ( elt.clientWidth / parent.clientWidth * 100 ).toFixed( 1 ), delta )
					// console.log( currentWidth + delta.width, currentWidth, delta.width )
					// setAttributes( { columnWidth } )
					// // wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( props.clientId, { columnWidth } )
					// wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( adjacentBlock.clientId, {
					// 	columnWidth: 100 - columnWidth,
					// } )

					// onResize( elt.clientHeight );
				} }
				// onMouseOver={ () => {
				// 	console.log( 'onMouseEnter', onMouseEnter )
				// 	setResizeableHovered( true )
				// } }
				// onMouseOut={ () => {
				// 	console.log( 'onMouseLeave', onMouseLeave )
				// 	setResizeableHovered( false )
				// } }
				// __experimentalShowTooltip={ true }
				// __experimentalTooltipProps={ {
				// 	axis: 'x',
				// 	position: 'left',
				// 	// isVisible: isResizing,
				// 	isVisible: true,
				// } }
			>
				<div className={ classNames } data-id={ props.attributes.uniqueId }>
					<InnerBlocks
						// orientation="horizontal"
						template={ TEMPLATE }
						renderAppender={ () => ! hasInnerBlocks ? <InnerBlocks.ButtonBlockAppender /> : <InnerBlocks.DefaultBlockAppender /> }
						// allowedBlocks={ [ 'stackable/card' ] }
					/>
				</div>
			</ResizableBox>
		</Fragment>
	)
}

export default compose(
	withIsHovered,
)( Edit )
