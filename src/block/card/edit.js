import {
	InnerBlocks,
} from '@wordpress/block-editor'
import {
	Fragment, useState, useEffect,
} from '@wordpress/element'
import classnames from 'classnames'
import { i18n } from 'stackable'
import {
	InspectorTabs,
	InspectorStyleControls,
	PanelAdvancedSettings,
	InspectorSectionControls,
	ImageUploadPlaceholder,
	Image,
} from '~stackable/components'
import {
	useUniqueId,
	useBlockContext,
	useBlockColumnEffect,
} from '~stackable/hooks'
import { ResizableBox } from '@wordpress/components'
import { compose } from '@wordpress/compose'
import { setLocaleData, __ } from '@wordpress/i18n'
import {
	withIsHovered,
} from '~stackable/higher-order'

const TEMPLATE = [
	[ 'core/heading', { content: 'Title for This Block' } ],
	[ 'core/paragraph', { content: 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.' } ],
	[ 'core/button', { content: 'Button' } ],
]

const Edit = props => {
	const {
		isFirstBlock, isLastBlock, isOnlyBlock, parentBlock, hasInnerBlocks, adjacentBlocks, blockIndex,
	} = useBlockContext( props )
	useBlockColumnEffect( props )
	useUniqueId( props )

	const [ prevAdjacentBlocks, setPrevAdjacentBlocks ] = useState( adjacentBlocks.length )
	useEffect( () => {
		if ( prevAdjacentBlocks !== adjacentBlocks.length ) {
			// Reset the column widths in desktop if a column was added / removed.
			const clientIds = adjacentBlocks.map( props => props.clientId )
			const { updateBlockAttributes } = wp.data.dispatch( 'core/block-editor' )
			updateBlockAttributes( clientIds, { columnWidth: '' } )

			setPrevAdjacentBlocks( adjacentBlocks.length )
		}
	}, [ adjacentBlocks ] )

	const {
		hasContainer,
		hasBackground,
	} = props.attributes

	const {
		toggleSelection, isSelected, setAttributes, isHovered,
	} = props

	const [ currentWidths, setCurrentWidths ] = useState( [] )
	const [ newWidths, setNewWidths ] = useState( [] )
	const [ maxWidth, setMaxWidth ] = useState( 2000 )
	const [ tempStyles, setTempStyles ] = useState( '' )
	const MIN_COLUMN_WIDTH = 150

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
		'stk-container--no-padding': hasContainer,
	} )

	const innerClassNames = classnames( [
		'stk-inner-blocks',
		'stk-card__content',
	], {
		'stk-container-padding': hasContainer,
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
					flex: 1 1 ${ props.attributes.columnWidth }%;
					max-width: ${ props.attributes.columnWidth }%;
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
				minWidth={ MIN_COLUMN_WIDTH }
				minHeight="100"
				maxWidth={ maxWidth }
				className="stk-column-resizeable"
				showHandle={ isHovered }
				onResizeStart={ ( _event, _direction, elt ) => {
					toggleSelection( false )

					// Get the current pixel width of the columns.
					const columnWidths = adjacentBlocks.map( ( { clientId } ) => {
						return document.querySelector(`[data-block="${ clientId }"]` )?.clientWidth
					} )
					setCurrentWidths( columnWidths )

					// We will keep the new widths here.
					setNewWidths( [] )

					// Set the maximum width for the current column.
					const adjacentBlockIndex = _direction === 'right' ? blockIndex + 1 : blockIndex - 1
					const maxWidth = columnWidths[ blockIndex ] + ( columnWidths[ adjacentBlockIndex ] - MIN_COLUMN_WIDTH )
					setMaxWidth( maxWidth )
				} }
				onResize={ ( _event, _direction, elt, delta ) => {
					// Clear the currently selected block.
					if ( wp.data.select('core/block-editor').hasSelectedBlock() ) {
						wp.data.dispatch('core/block-editor').clearSelectedBlock()
					}

					// Compute for the new widths.
					const columnWidths = [ ...currentWidths ]
					const totalWidth = currentWidths.reduce( ( a, b ) => a + b, 0 )
					const adjacentBlockIndex = _direction === 'right' ? blockIndex + 1 : blockIndex - 1
					columnWidths[ adjacentBlockIndex ] -= delta.width
					columnWidths[ blockIndex ] += delta.width

					// Fix the widths, ensure that our total width is 100%
					const columnPercentages = ( columnWidths || [] ).map( ( width, i ) => {
						return parseFloat( ( width / totalWidth * 100 ).toFixed( 1 ) )
					} )
					const totalCurrentWidth = columnPercentages.reduce( ( a, b ) => a + b, 0 )
					if ( totalCurrentWidth !== 100 ) {
						columnPercentages[ adjacentBlockIndex ] = parseFloat( ( columnPercentages[ adjacentBlockIndex ] + 100 - totalCurrentWidth ).toFixed( 1 ) )
					}

					setNewWidths( columnPercentages )

					// Add the temporary styles for our column widths.
					const columnStyles = columnPercentages.map( ( width, i ) => {
						return `[data-block="${ adjacentBlocks[ i ].clientId }"] {
							flex: 1 1 ${ width }% !important;
							max-width: ${ width }% !important;
						}`
					} ).join( '' )
					setTempStyles( columnStyles )
				} }
				onResizeStop={ ( _event, _direction, elt, delta ) => {
					if ( ! newWidths.length ) {
						return
					}

					// Update the block widths.
					const updatePromises = newWidths.map( ( width, i ) => {
						return wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( adjacentBlocks[ i ].clientId, { columnWidth: width } )
					} )

					// Wait until all attribute updates have been applied.
					Promise.all( updatePromises ).then( () => {
						setTimeout( () => {
							setTempStyles( '' )
						}, 350 )

					} )
				} }
			>
				{ tempStyles && <style>{ tempStyles }</style> }
				<div className={ blockClassNames } data-id={ props.attributes.uniqueId }>
					<div className={ contentClassNames }>
						{ /* { props.attributes.imageUrl && */ }
						<ImageUploadPlaceholder
							imageID={ props.attributes.imageId }
							imageURL={ props.attributes.imageUrl }
							// imageSize={ imageSize }
							// className={ imageClasses }
							className="stk-card__image"
							onRemove={ () => {
								setAttributes( {
									imageUrl: '',
									imageId: '',
									imageAlt: '',
									imageTitle: '',
								} )
							} }
							onChange={ image => {
								setAttributes( {
									imageUrl: image.url,
									imageId: image.id,
									imageAlt: image.alt,
									imageTitle: image.title,
								} )
							} }
							render={
								<Image
									imageId={ props.attributes.imageId }
									src={ props.attributes.imageUrl }
									className="stk-image--fit"
									// size={ imageSize }
									// shape={ attributes[ `image${ i }Shape` ] || imageShape }
									// shapeStretch={ attributes[ `image${ i }ShapeStretch` ] || imageShapeStretch }
									// alt={ imageAlt }
									// shadow={ imageShadow }
									// width={ imageWidth }
								/>
							}
						/>
						{ /* } */ }
						<div className={ innerClassNames }>
							<InnerBlocks
								// orientation="horizontal"
								template={ TEMPLATE }
								renderAppender={ () => ! hasInnerBlocks ? <InnerBlocks.ButtonBlockAppender /> : <InnerBlocks.DefaultBlockAppender /> }
								// allowedBlocks={ [ 'stackable/card' ] }
							/>
						</div>
					</div>
				</div>
			</ResizableBox>
		</Fragment>
	)
}

export default compose(
	withIsHovered,
)( Edit )
