import createStyles from './style'
import {
	InnerBlocks,
} from '@wordpress/block-editor'
import {
	Fragment,
} from '@wordpress/element'
import classnames from 'classnames'
import { i18n, version as VERSION } from 'stackable'
import {
	InspectorTabs,
	InspectorStyleControls,
	PanelAdvancedSettings,
	InspectorSectionControls,
	ResizableColumn,
	Style,
	Image2,
} from '~stackable/components'
import {
	useUniqueId,
	useBlockContext,
	useBlockColumnEffect,
} from '~stackable/hooks'
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import {
	withIsHovered,
} from '~stackable/higher-order'
import { dispatch } from '@wordpress/data'

const TEMPLATE = [
	[ 'core/heading', {} ],
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
				styleFunc={ createStyles( VERSION ) }
				blockProps={ props }
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
						<Image2
							imageID={ props.attributes.imageId }
							imageURL={ props.attributes.imageUrl }
							className="stk-card__image"
							size={ props.attributes.imageSize }
							imageId={ props.attributes.imageId }
							src={ props.attributes.imageUrl }
							heightUnits={ [ 'px' ] }
							width={ 100 }
							widthUnit="%"
							height={ props.attributes.imageHeight || 300 }
							heightUnit="px"
							onChangeSizeDesktop={ ( {
								width, height, widthUnit, heightUnit,
							} ) => {
								const size = {}
								if ( typeof width !== 'undefined' ) {
									size.imageWidth = width
								}
								if ( typeof height !== 'undefined' ) {
									size.imageHeight = height
								}
								if ( typeof heightUnit !== 'undefined' ) {
									size.imageHeightUnit = heightUnit
								}
								if ( typeof widthUnit !== 'undefined' ) {
									size.imageWidthUnit = widthUnit
								}
								setAttributes( size )
							} }
							heightTablet={ props.attributes.imageHeightTablet }
							onChangeSizeTablet={ ( {
								width, height, widthUnit, heightUnit,
							} ) => {
								const size = {}
								if ( typeof width !== 'undefined' ) {
									size.imageWidthTablet = width
								}
								if ( typeof height !== 'undefined' ) {
									size.imageHeightTablet = height
								}
								if ( typeof heightUnit !== 'undefined' ) {
									size.imageHeightUnitTablet = heightUnit
								}
								if ( typeof widthUnit !== 'undefined' ) {
									size.imageWidthUnitTablet = widthUnit
								}
								setAttributes( size )
							} }
							heightMobile={ props.attributes.imageHeightMobile }
							onChangeSizeMobile={ ( {
								width, height, widthUnit, heightUnit,
							} ) => {
								const size = {}
								if ( typeof width !== 'undefined' ) {
									size.imageWidthMobile = width
								}
								if ( typeof height !== 'undefined' ) {
									size.imageHeightMobile = height
								}
								if ( typeof heightUnit !== 'undefined' ) {
									size.imageHeightUnitMobile = heightUnit
								}
								if ( typeof widthUnit !== 'undefined' ) {
									size.imageWidthUnitMobile = widthUnit
								}
								setAttributes( size )
							} }
							enableWidth={ false }
							enableDiagonal={ false }
							onRemove={ () => {
								setAttributes( {
									imageUrl: '',
									imageId: '',
								} )
							} }
							onChange={ image => {
								setAttributes( {
									imageUrl: image.url,
									imageId: image.id,
								} )
							} }
						/>
						<div className={ innerClassNames }>
							<InnerBlocks
								template={ TEMPLATE }
								renderAppender={ () => ! hasInnerBlocks ? <InnerBlocks.ButtonBlockAppender /> : <InnerBlocks.DefaultBlockAppender /> }
								templateInsertUpdatesSelection={ true }
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
)( Edit )
