/**
 * External dependencies
 */
import classnames from 'classnames'
import {
	InspectorStyleControls, InspectorTabs, PanelAdvancedSettings, AdvancedRangeControl,
} from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	MarginBottom,
	Alignment,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Separator,
	Transform,
	ContentAlign,
} from '~stackable/block-components'
import {
	withBlockAttributeContext,
	withBlockWrapperIsHovered,
	withQueryLoopContext,
} from '~stackable/higher-order'
import { useBlockContext } from '~stackable/hooks'
import { version as VERSION, i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import { InnerBlocks } from '@wordpress/block-editor'
import { TabsStyle } from './style'
import { useEffect } from '@wordpress/element'
import { dispatch } from '@wordpress/data'
import { getBlockFromExample } from '@wordpress/blocks'

const TEMPLATE = [
	[ 'stackable/tab-labels', {} ],
	[ 'stackable/tab-content', {} ],
]

const Edit = props => {
	const {
		className,
		isSelected,
		attributes,
	} = props

	// const [ tabsOptions, setTabsOptions ] = useState( [] )

	useGeneratedCss( props.attributes )

	const {
		hasInnerBlocks, innerBlocks,
	} = useBlockContext()
	const {
		insertBlock, removeBlocks, updateBlockAttributes,
	} = dispatch( 'core/block-editor' )

	const blockClassNames = classnames( [
		className,
		'stk-block-tabs',
	] )

	// useEffect( () => {
	// 	for ( let i = 0; i < attributes.tabCount; i++ ) {
	// 		setTabsOptions( [
	// 			...tabsContent,
	// 			{ value: i + 1, label: 'Tab' + ( i + 1 ) },
	// 		]
	// 		)
	// 	}
	// }, [ ] )

	useEffect( () => {
		if ( props.attributes.tabCount ) {
			const tabContentBlock = document.querySelector( `[data-block="${ innerBlocks[ 1 ].clientId }"]` )
			const columns = tabContentBlock.querySelectorAll( '[data-type="stackable/column"]' )
			columns.forEach( ( element, index ) => {
				if ( index !== 0 ) {
					element.style.display = 'none'
				}
			} )
		}
	}, [ props.attributes.tabCount ] )

	return (
		<>
			{ isSelected && (
				<>
					<InspectorTabs />
					<InspectorStyleControls>
						<PanelAdvancedSettings
							title={ __( 'General', i18n ) }
							id="countdown"
							initialOpen={ true }
						>
							<AdvancedRangeControl
								label={ __( 'Tabs', i18n ) }
								min={ 1 }
								sliderMax={ 10 }
								attribute="tabCount"
								onChange={ value => {
									const tabsInnerBlocksClientIds = innerBlocks.map( ( { clientId } ) => clientId )
									const tabsUpdatedAttributes = {}
									const block = getBlockFromExample( 'stackable/column', {} ) // eslint-disable-line

									tabsInnerBlocksClientIds.push( props.clientId )

									tabsInnerBlocksClientIds.forEach( clientId => {
										tabsUpdatedAttributes[ clientId ] = { tabCount: value }
									} )
									updateBlockAttributes( tabsInnerBlocksClientIds, tabsUpdatedAttributes, true ) // eslint-disable-line stackable/no-update-block-attributes
									// insertBlock( block, innerBlocks[ 1 ].innerBlocks.length, innerBlocks[ 1 ].clientId, false )
									if ( value < attributes.tabCount ) {
										const tabsInnerColumns = innerBlocks[ 1 ].innerBlocks.slice( value ).map( ( { clientId } ) => clientId )
										removeBlocks( tabsInnerColumns, false )
										// Add a blank column.
									} else {
										const columnsSize = innerBlocks[ 1 ].innerBlocks.length
										for ( let i = columnsSize; i < value; i++ ) {
											const block = getBlockFromExample( 'stackable/column', {} )
											insertBlock( block, i, innerBlocks[ 1 ].clientId, false )
										}
									}
								} }
							/>
							{ /* <AdvancedSelectControl
								label={ __( 'Initial Tab Open', i18n ) }
								options={ tabsOptions }
								attribute="inititalTabOpen"
							/> */ }
						</PanelAdvancedSettings>
					</InspectorStyleControls>
					<Alignment.InspectorControls hasRowAlignment={ true } />
					<BlockDiv.InspectorControls />
					<Separator.InspectorControls />
					<Advanced.InspectorControls />
					<Transform.InspectorControls />
					<EffectsAnimations.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-columns" />
					<Responsive.InspectorControls />
					<ConditionalDisplay.InspectorControls />
					<ContentAlign.InspectorControls hasColumnCount={ true } />
				</>
			) }

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<TabsStyle
					version={ VERSION }
					blockState={ props.blockState }
					clientId={ props.clientId }
				/>
				<CustomCSS mainBlockClass="stk-block-tabs" />
				<InnerBlocks
					orientation="horizontal"
					template={ TEMPLATE }
					templateInsertUpdatesSelection={ true }
					templateLock="all"
				/>
			</BlockDiv>
			{ props.isHovered && hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )

/**
 *  clientIds []
 *
 *
 */
