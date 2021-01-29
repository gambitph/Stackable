import {
	InnerBlocks,
} from '@wordpress/block-editor'
import { Fragment, useState } from '@wordpress/element'
import {
	useSelect, select,
} from '@wordpress/data'
import classnames from 'classnames'
import { i18n } from 'stackable'
import {
	first, last, indexOf, nth,
} from 'lodash'
import {
	BlockContainer,
	InspectorTabs,
	InspectorStyleControls,
	InspectorControls,
	PanelAdvancedSettings,
	InspectorSectionControls,
} from '~stackable/components'
import {
	useUniqueId,
	useBlockContext,
	useBlockColumnEffect,
} from '~stackable/hooks'
import { ResizableBox, ToggleControl } from '@wordpress/components'
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import {
	withIsHovered,
} from '~stackable/higher-order'

const TEMPLATE = [
	[ 'core/heading', { content: 'Card Title' } ],
	[ 'core/paragraph', { content: 'Card Text' } ],
]

const Edit = props => {
	// const {
	// 	isFirstBlock, isLastBlock, adjacentBlock,
	// } = useBlockInfo( props )
	const {
		isFirstBlock, isLastBlock, isOnlyBlock, adjacentBlock, parentBlock, hasInnerBlocks,
	} = useBlockContext( props )
	useBlockColumnEffect( props )
	useUniqueId( props )

	// console.log( 'adjacentBlock', props.clientId, adjacentBlock.clientId )
	// console.log( 'isfirst block', props.clientId, adjacentBlock.clientId )
	const {
		hasContainer,
		hasBackground,
	} = props.attributes

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

	const blockClassNames = classnames( [
		'stk-card',
		'stk-block',
		'stk-column',
		`stk-${ props.attributes.uniqueId }`,
	], {
		'stk-is-first': isFirstBlock,
		'stk-is-last': isLastBlock,
		'stk-block-background': hasBackground,
	} )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk-column-wrapper',
	], {
		'stk-container': hasContainer,
	} )

	return (
		<Fragment>

			<InspectorTabs
				{ ...props }
			/>

			<InspectorSectionControls>
				<PanelAdvancedSettings
					title={ __( 'Background', i18n ) }
					id="background"
					checked={ hasBackground }
					onChange={ hasBackground => setAttributes( { hasBackground } ) }
					// toggleOnSetAttributes={ [
					// 	'arrowSize',
					// 	'arrowColor',
					// ] }
					toggleAttributeName="hasBackground"
				>
				</PanelAdvancedSettings>
			</InspectorSectionControls>

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Container', i18n ) }
					id="container"
					checked={ hasContainer }
					onChange={ hasContainer => setAttributes( { hasContainer } ) }
					// toggleOnSetAttributes={ [
					// 	'arrowSize',
					// 	'arrowColor',
					// ] }
					toggleAttributeName="hasContainer"
				>
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<style>
				{ props.attributes.columnWidth ? `[data-block="${ props.clientId }"] {
					flex: 1 1 ${ props.attributes.columnWidth }% !important;
					max-width: ${ props.attributes.columnWidth }% !important;
				}` : null }
			</style>
			<ResizableBox
				enable={ {
					top: false,
					right: ! isOnlyBlock && ! isLastBlock,
					bottom: false,
					left: ! isOnlyBlock && ! isFirstBlock,
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
				<div className={ blockClassNames } data-id={ props.attributes.uniqueId }>
					<div className={ contentClassNames }>
						<InnerBlocks
							// orientation="horizontal"
							template={ TEMPLATE }
							renderAppender={ () => ! hasInnerBlocks ? <InnerBlocks.ButtonBlockAppender /> : <InnerBlocks.DefaultBlockAppender /> }
							// allowedBlocks={ [ 'stackable/card' ] }
						/>
					</div>
				</div>
			</ResizableBox>
		</Fragment>
	)
}

export default compose(
	withIsHovered,
)( Edit )
