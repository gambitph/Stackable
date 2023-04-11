import { TabsStyle } from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import {
	InspectorStyleControls, InspectorTabs, PanelAdvancedSettings, AdvancedRangeControl, AdvancedSelectControl,
} from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	MarginBottom,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	Transform,
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
import { useInnerBlocksProps } from '@wordpress/block-editor'
import { useEffect, useState } from '@wordpress/element'
import { dispatch } from '@wordpress/data'
import { getBlockFromExample } from '@wordpress/blocks'

const TEMPLATE = [
	[ 'stackable/tab-labels', {} ],
	[ 'stackable/tab-content', {} ],
]

const tabsLayoutOptions = [
	{
		value: '',
		label: __( 'Top', i18n ),
	},
	{
		value: 'bottom',
		label: __( 'Bottom', i18n ),
	},
	{
		value: 'left',
		label: __( 'Left', i18n ),
	},
	{
		value: 'right',
		label: __( 'Right', i18n ),
	},
]

const Edit = props => {
	const {
		className,
		isSelected,
		attributes,
	} = props

	const [ tabsOptions, setTabsOptions ] = useState( [] )

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'stk-block-tabs__wrapper' },
		{
			template: TEMPLATE,
			orientation: 'horizontal',
			templateLock: 'all',
		}
	)

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
		'stk-classnames',
	] )

	// if ( attributes?.className ) {
	// 	if ( attributes.className === 'wp-block-stackable-column' ) {
	// 		setAttributes( { className: '' } )
	// 	}
	// }

	useEffect( () => {
		const tempOptions = []
		for ( let i = 0; i < attributes.tabCount; i++ ) {
			tempOptions.push( { label: `Tab ${ i + 1 }`, value: i + 1 } )
		}
		setTabsOptions( tempOptions )
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

									tabsInnerBlocksClientIds.push( props.clientId )

									tabsInnerBlocksClientIds.forEach( clientId => {
										tabsUpdatedAttributes[ clientId ] = { tabCount: value }
									} )
									// insertBlock( block, innerBlocks[ 1 ].innerBlocks.length, innerBlocks[ 1 ].clientId, false )
									if ( value < attributes.tabCount ) {
										const tabsInnerColumns = innerBlocks[ 1 ].innerBlocks.slice( value ).map( ( { clientId } ) => clientId )
										removeBlocks( tabsInnerColumns, false )
									} else {
										const columnsSize = innerBlocks[ 1 ].innerBlocks.length
										for ( let i = columnsSize; i < value; i++ ) {
											const block = getBlockFromExample( 'stackable/column', {} )
											insertBlock( block, i, innerBlocks[ 1 ].clientId, false )
										}
									}
									updateBlockAttributes( tabsInnerBlocksClientIds, tabsUpdatedAttributes, true ) // eslint-disable-line stackable/no-update-block-attributes
								} }
							/>
							<AdvancedSelectControl
								label={ __( 'Initial Tab Open', i18n ) }
								options={ tabsOptions }
								value={ attributes.initialTabOpen }
								attribute="initialTabOpen"
								onChange={ value => {
									const tabsInnerBlocksClientIds = innerBlocks.filter( innerBlock => innerBlock.name === 'stackable/tab-labels' ).map( ( { clientId } ) => clientId )
									tabsInnerBlocksClientIds.push( props.clientId )
									const tabsUpdatedAttributes = {}
									tabsInnerBlocksClientIds.forEach( clientId => {
										tabsUpdatedAttributes[ clientId ] = { initialTabOpen: value }
									} )
									updateBlockAttributes( tabsInnerBlocksClientIds, tabsUpdatedAttributes, true ) // eslint-disable-line stackable/no-update-block-attributes
								} }
							/>
							<AdvancedSelectControl
								label={ __( 'Tabs Layout', i18n ) }
								options={ tabsLayoutOptions }
								attribute="tabLayout"
							/>
							{ /* <ToggleGroupControl>
								<ToggleGroupControlOption value="horizontal" label="Horizontal" />
								<ToggleGroupControlOption value="vertical" label="Vertical" />
							</ToggleGroupControl> */ }
						</PanelAdvancedSettings>
					</InspectorStyleControls>
					<BlockDiv.InspectorControls />
					<Advanced.InspectorControls />
					<Transform.InspectorControls />
					<EffectsAnimations.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-tabs" />
					<Responsive.InspectorControls />
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
				<div className="stk-block-tabs__wrapper" { ...innerBlocksProps }>
					{ /* <InnerBlocks
						orientation="horizontal"
						template={ TEMPLATE }
						templateInsertUpdatesSelection={ true }
						templateLock="all"
					/> */ }
				</div>
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
