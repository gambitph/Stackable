import createStyles from './style'
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
	ResizableColumn,
	Style,
} from '~stackable/components'
import {
	useUniqueId,
	useBlockContext,
	useBlockColumnEffect,
} from '~stackable/hooks'
import { compose } from '@wordpress/compose'
import { setLocaleData, __ } from '@wordpress/i18n'
import {
	withIsHovered, withStyles,
} from '~stackable/higher-order'
import { dispatch, select } from '@wordpress/data'

const TEMPLATE = [
	[ 'core/heading', { content: 'Title for This Block' } ],
	[ 'core/paragraph', { content: 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.' } ],
	[ 'core/button', { content: 'Button' } ],
]

const Edit = props => {
	const {
		isFirstBlock, isLastBlock, hasInnerBlocks, adjacentBlocks,
	} = useBlockContext( props )
	useBlockColumnEffect( props )
	useUniqueId( props )

	const {
		updateBlockAttributes,
	} = dispatch( 'core/block-editor' )

	const {
		hasContainer,
		hasBackground,
	} = props.attributes

	const {
		className, setAttributes, isHovered,
	} = props

	const blockClassNames = classnames( [
		className,
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
			<Style
				blockUniqueClassName={ `stk-${ props.attributes.uniqueId }` }
				blockMainClassName={ 'stk-card' }
				style={ props.blockStyles }
				editorMode={ true }
			/>
			<ResizableColumn
				showHandle={ isHovered }
				blockProps={ props }
				onChangeDesktop={ widths => {
					widths.forEach( ( width, i ) => {
						updateBlockAttributes( adjacentBlocks[ i ].clientId, { columnWidth: width } )
					} )
				} }
				onChangeTablet={ width => {
					setAttributes( { columnWidthTablet: width } )
				} }
				onChangeMobile={ width => {
					setAttributes( { columnWidthMobile: width } )
				} }
				onResetDesktop={ () => {
					adjacentBlocks.forEach( ( { clientId } ) => {
						updateBlockAttributes( clientId, { columnWidth: '' } )
					} )
				} }
			>
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
			</ResizableColumn>
		</Fragment>
	)
}

export default compose(
	withIsHovered,
	withStyles( createStyles( '3.0.0' ) )
)( Edit )
