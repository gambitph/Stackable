/**
 * Internal dependencies
 */
import BlockStyles from './style'
import { withActiveTab } from './with-active-tab'

/**
 * External dependencies
 */
import { i18n, version as VERSION } from 'stackable'
import classnames from 'classnames'
import {
	AdvancedRangeControl,
	AdvancedSelectControl,
	AdvancedToolbarControl,
	ControlSeparator,
	GroupPlaceholder,
	InspectorLayoutControls,
	InspectorTabs,
} from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	MarginBottom,
	getAlignmentClasses,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Separator,
	getSeparatorClasses,
	Transform,
	ContentAlign,
	getContentAlignmentClasses,
	ColumnsControl,
} from '~stackable/block-components'
import { InnerBlocks } from '@wordpress/block-editor'
import { useBlockContext } from '~stackable/hooks'
import {
	withBlockAttributeContext,
	withBlockWrapperIsHovered,
	withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { dispatch } from '@wordpress/data'
import { __, sprintf } from '@wordpress/i18n'

const TEMPLATE = [
	[ 'stackable/tab-labels', {
		tabLabels: [
			{ label: sprintf( __( 'Tab %d', i18n ), 1 ), icon: '' },
			{ label: sprintf( __( 'Tab %d', i18n ), 2 ), icon: '' },
			{ label: sprintf( __( 'Tab %d', i18n ), 3 ), icon: '' },
		],
		blockShadow: 'inset 0px -1px 0px 0px rgba(0,0,0, 0.1)',
		tabBorderType: 'solid',
		tabBorderColor: 'transparent',
		tabBorderWidth: {
			top: 0,
			right: 0,
			bottom: 2,
			left: 0,
		},
		activeTabBorderColor: '#000000',
		tabTextColor1: '#999999',
		activeTabTextColor: '#000000',
		tabTextColorHover: '#000000',
		tabIconColor1: '#909090',
		activeTabIconColor1: '#000000',
		tabIconColor1Hover: '#909090',
		activeTabIconColor1Hover: '#000000',
		tabBackgroundColor: 'transparent',
	} ],
	[ 'stackable/tab-content', {} ],
]

const Edit = props => {
	const {
		className,
		clientId,
		isSelected,
	} = props

	useGeneratedCss( props.attributes )

	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { innerBlocks, hasInnerBlocks } = useBlockContext()

	let tabContentBlock = null,
		tabLabelsBlock = null
	if ( innerBlocks?.length ) {
		tabLabelsBlock = innerBlocks[ 0 ].name === 'stackable/tab-labels' ? innerBlocks[ 0 ] : innerBlocks[ 1 ]
		tabContentBlock = innerBlocks[ 0 ].name === 'stackable/tab-content' ? innerBlocks[ 0 ] : innerBlocks[ 1 ]
	}

	const blockClassNames = classnames( [
		className,
		'stk-block-tabs',
		separatorClass,
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
		{
			'stk-block-tabs--vertical': props.attributes.tabOrientation === 'vertical',
			'stk-block-tabs--horizontal': props.attributes.tabOrientation !== 'vertical',
			'stk-block-tabs--fade': props.attributes.tabPanelEffect !== 'immediate',
			'stk-block-tabs--immediate': props.attributes.tabPanelEffect === 'immediate',
		},
	], getContentAlignmentClasses( props.attributes ) )

	return (
		<>
			{ isSelected && (
				<>
					<InspectorTabs />
					<InspectorLayoutControls>
						<ColumnsControl
							label={ __( 'Tabs', i18n ) }
							rootClientId={ tabContentBlock?.clientId }
							onChangeCallback={ ( changeColumnsFunc, numColumns ) => {
								props.setTemplateLock( false )
								setTimeout( () => {
									changeColumnsFunc( numColumns )
									props.setTemplateLock( true )
								}, 1 )

								// Update the number of tab labels
								const clientId = tabLabelsBlock.clientId
								const tabLabels = tabLabelsBlock.attributes.tabLabels

								// If we added a new tab, then add a new tab label
								if ( numColumns > tabLabels.length ) {
									const newTabLabels = [ ...tabLabels ]
									while ( newTabLabels.length < numColumns ) {
										newTabLabels.push( { label: '', icon: '' } )
									}
									// Quietly update the tab labels
									dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
									dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, {
										tabLabels: newTabLabels,
									} )
								} else if ( numColumns < tabLabels.length ) {
									// If we removed a tab, then remove the last tab label
									const newTabLabels = [ ...tabLabels ].slice( 0, numColumns )
									// Quietly update the tab labels
									dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
									dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, {
										tabLabels: newTabLabels,
									} )
								}
							} }
							newColumnAttributes={
								{
									customAttributes: [ [ 'role', 'tabpanel' ] ],
								}
							}
						/>
						<AdvancedSelectControl
							label={ __( 'Initial Tab Open', i18n ) }
							attribute="initialTabOpen"
							options={ tabContentBlock?.innerBlocks?.map( ( block, index ) => {
								return {
									value: index === 0 ? '' : index + 1,
									label: index + 1,
								}
							} ) }
						/>
						<ControlSeparator />
						<AdvancedToolbarControl
							label={ __( 'Tab Orientation', i18n ) }
							controls={ [
								{
									value: '',
									title: __( 'Horizontal', i18n ),
								},
								{
									value: 'vertical',
									title: __( 'Vertical', i18n ),
								},
							] }
							attribute="tabOrientation"
						/>
						<AdvancedRangeControl
							label={ __( 'Tab Panel Offset', i18n ) }
							min={ 0 }
							sliderMax={ 100 }
							placeholder="16"
							attribute="tabPanelOffset"
							responsive="all"
						/>
						<AdvancedToolbarControl
							label={ __( 'Tab Panel Effect', i18n ) }
							controls={ [
								{
									value: '',
									title: __( 'Fade', i18n ),
								},
								{
									value: 'immediate',
									title: __( 'Immediate', i18n ),
								},
							] }
							attribute="tabPanelEffect"
						/>
					</InspectorLayoutControls>

					{ /* <Columns.InspectorControls /> */ }
					<InspectorLayoutControls>
						<ControlSeparator />
					</InspectorLayoutControls>
					<ContentAlign.InspectorControls />
					{ /* <Alignment.InspectorControls hasColumnJustify={ true } hasRowAlignment={ true } /> */ }
					<BlockDiv.InspectorControls />
					<Advanced.InspectorControls />
					<Transform.InspectorControls />
					<EffectsAnimations.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-tabs" />
					<Responsive.InspectorControls />
					<ConditionalDisplay.InspectorControls />
				</>
			) }

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<BlockStyles
					version={ VERSION }
					blockState={ props.blockState }
					clientId={ clientId }
				/>
				<CustomCSS mainBlockClass="stk-block-tabs" />

				{ ! hasInnerBlocks && <GroupPlaceholder /> }
				<Separator>
					<div
						className={ contentClassNames }
						data-align={ ! props.attributes.contentAlign ? undefined // Only needed in the backend
							: props.attributes.contentAlign === 'alignwide' ? 'wide'
								: props.attributes.contentAlign === 'alignfull' ? 'full' : undefined }
					>
						<InnerBlocks
							template={ TEMPLATE }
							templateLock="insert"
							orientation={ props.attributes.tabOrientation !== '' ? 'horizontal' : 'vertical' }
						/>
					</div>
				</Separator>
			</BlockDiv>
			{ props.isHovered && hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
	withActiveTab( 'initialTabOpen' ),
)( Edit )
