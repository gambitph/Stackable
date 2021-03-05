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
	BackgroundControlsHelper,
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
import {
	getImageProps, useColumn, useImage,
} from '~stackable/helpers'

const TEMPLATE = [
	[ 'core/heading', {} ],
	[ 'core/paragraph', { content: 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.' } ],
	[ 'core/button', { content: 'Button' } ],
]

const Edit = props => {
	const {
		isFirstBlock, isLastBlock, hasInnerBlocks,
	} = useBlockContext( props )
	useBlockColumnEffect( props )
	useUniqueId( props )

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

	const imageProps = getImageProps( props.attributes )
	const { setImage } = useImage()
	const { setColumn } = useColumn()

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
					toggleOnSetAttributes={ [
						'blockBackgroundColor',
						'arrowColor',
					] }
					toggleAttributeName="hasBackground"
				>
					<BackgroundControlsHelper
						attrNameTemplate="block%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					/>
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
				{ ...setColumn }
			>
				<div className={ blockClassNames } data-id={ props.attributes.uniqueId }>
					<div className={ contentClassNames }>
						<Image2
							{ ...imageProps }
							{ ...setImage }
							className="stk-card__image"
							enableWidth={ false }
							enableDiagonal={ false }
							heightUnits={ [ 'px' ] }
							width={ 100 }
							widthUnit="%"
							height={ props.attributes.imageHeight || 300 }
							heightUnit="px"
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
