/**
 * Internal dependencies
 */
import { TabStyles } from './style'
import { useSetActiveTabContext } from '../tabs/with-active-tab'
import { defaultIcon } from './schema'
import { blockStyles as _blockStyles } from './block-styles'
import SVGIconLeft from './images/icon-left.svg'
import SVGIconRight from './images/icon-right.svg'
import SVGIconTop from './images/icon-top.svg'
import SVGIconBottom from './images/icon-bottom.svg'

/**
 * External dependencies
 */
import {
	BlockDiv,
	useGeneratedCss,
	CustomCSS,
	Responsive,
	Advanced,
	Typography,
	getTypographyClasses,
	getAlignmentClasses,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Transform,
	Icon,
	Button,
} from '~stackable/block-components'
import { i18n, version as VERSION } from 'stackable'
import classnames from 'classnames'
import {
	InspectorTabs,
	InspectorLayoutControls,
	InspectorAdvancedControls,
	AdvancedTextControl,
	AdvancedToggleControl,
	AdvancedRangeControl,
	InspectorStyleControls,
	PanelAdvancedSettings,
	ControlSeparator,
	AdvancedToolbarControl,
	AlignButtonsControl,
	ColorPaletteControl,
	BlockStyles,
	RichText,
} from '~stackable/components'
import {
	withBlockAttributeContext,
	withBlockWrapper,
	withQueryLoopContext,
} from '~stackable/higher-order'
import { getBlockStyle } from '~stackable/hooks'
import { cloneDeep, kebabCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	useRef, useCallback, createRef, useState, useEffect, memo,
} from '@wordpress/element'
import { dispatch, useSelect } from '@wordpress/data'
import { compose } from '@wordpress/compose'
import { BlockControls } from '@wordpress/block-editor'
import {
	ToolbarGroup, ToolbarButton,
	BaseControl as GutBaseControl,
} from '@wordpress/components'
import { getBlockFromExample } from '@wordpress/blocks'

// These are the style names (in block-styles.js) that are only available if the
// parent tabs block orientation is horizontal.
const HORIZONTAL_STYLES = [ 'centered-buttons' ]

const ICON_ALIGN_OPTIONS = [
	{
		value: '',
		title: __( 'Left', i18n ),
		icon: <SVGIconLeft />,
	},
	{
		value: 'right',
		title: __( 'Right', i18n ),
		icon: <SVGIconRight />,
	},
	{
		value: 'top',
		title: __( 'Top', i18n ),
		icon: <SVGIconTop />,
	},
	{
		value: 'bottom',
		title: __( 'Bottom', i18n ),
		icon: <SVGIconBottom />,
	},
]

const Edit = props => {
	const {
		className,
		clientId,
		isSelected,
		setAttributes,
		context,
	} = props

	useGeneratedCss( props.attributes )

	const [ activeTab, setActiveTab, , setTemplateLock ] = useSetActiveTabContext()
	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { parentBlock } = useSelect(
		select => {
			const parentClientId = select( 'core/block-editor' ).getBlockRootClientId( clientId )
			const parentBlock = select( 'core/block-editor' ).getBlock( parentClientId )
			return {
				parentBlock,
			}
		},
		[ clientId ]
	)

	const getRef = useGetRef()

	const onClick = index => {
		setActiveTab( index )
		if ( ! isSelected ) {
			dispatch( 'core/block-editor' ).clearSelectedBlock()
		}
	}

	const updateTabLabel = ( content, index ) => {
		const updatedLabels = cloneDeep( props.attributes.tabLabels )
		updatedLabels[ index ].label = content
		setAttributes( { tabLabels: updatedLabels } )
	}

	const updateTabIcon = ( icon, index ) => {
		const updatedLabels = cloneDeep( props.attributes.tabLabels )
		updatedLabels[ index ].icon = icon
		setAttributes( { tabLabels: updatedLabels } )
	}

	const moveActiveTabRight = () => {
		// Move the tab label
		const index = activeTab - 1
		const updatedLabels = cloneDeep( props.attributes.tabLabels )
		const temp = updatedLabels[ index ]
		updatedLabels[ index ] = updatedLabels[ index + 1 ]
		updatedLabels[ index + 1 ] = temp
		setAttributes( { tabLabels: updatedLabels } )

		// Move the tab content
		const tabContentBlock = parentBlock.innerBlocks[ 0 ].name === 'stackable/tab-content' ? parentBlock.innerBlocks[ 0 ] : parentBlock.innerBlocks[ 1 ]
		dispatch( 'core/block-editor' ).moveBlocksDown( [ tabContentBlock.innerBlocks[ index ].clientId ], tabContentBlock.clientId )

		// Change the active tab
		setActiveTab( activeTab + 1 )
	}

	const moveActiveTabLeft = () => {
		// Move the tab label
		const index = activeTab - 1
		const updatedLabels = cloneDeep( props.attributes.tabLabels )
		const temp = updatedLabels[ index ]
		updatedLabels[ index ] = updatedLabels[ index - 1 ]
		updatedLabels[ index - 1 ] = temp
		setAttributes( { tabLabels: updatedLabels } )

		// Move the tab content
		const tabContentBlock = parentBlock.innerBlocks[ 0 ].name === 'stackable/tab-content' ? parentBlock.innerBlocks[ 0 ] : parentBlock.innerBlocks[ 1 ]
		dispatch( 'core/block-editor' ).moveBlocksUp( [ tabContentBlock.innerBlocks[ index ].clientId ], tabContentBlock.clientId )

		// Change the active tab
		setActiveTab( activeTab - 1 )
	}

	const addNewTab = index => {
		// Ada a new tab label
		const updatedLabels = cloneDeep( props.attributes.tabLabels )
		updatedLabels.splice( index, 0, { label: '', icon: '' } )
		setAttributes( { tabLabels: updatedLabels } )

		// Add a new tab content
		setTemplateLock( false )
		setTimeout( () => { // We need to wait a bit for the templateLock to get applied to the tabContent component.
			const tabContentBlock = parentBlock.innerBlocks[ 0 ].name === 'stackable/tab-content' ? parentBlock.innerBlocks[ 0 ] : parentBlock.innerBlocks[ 1 ]
			const block = getBlockFromExample( 'stackable/column', {
				attributes: {
					customAttributes: [ [ 'role', 'tabpanel' ] ],
				},
			} )

			dispatch( 'core/block-editor' ).insertBlock( block, index, tabContentBlock.clientId, false )
			setTemplateLock( true )
		}, 1 )

		// Focus on the new tab label
		setTimeout( () => {
			const range = document.createRange()
			range.selectNodeContents( getRef( index ).current )
			range.collapse( false )

			const selection = window.getSelection() // eslint-disable-line
			selection.removeAllRanges()
			selection.addRange( range )
		}, 1 )

		// Change the active tab
		setActiveTab( index + 1 )
	}

	const duplicateTab = index => {
		// Duplicate the tab label
		const updatedLabels = cloneDeep( props.attributes.tabLabels )
		updatedLabels.splice( index, 0, { label: updatedLabels[ index - 1 ].label, icon: updatedLabels[ index - 1 ].icon } )
		setAttributes( { tabLabels: updatedLabels } )

		// Duplicate the tab content
		setTemplateLock( false )
		setTimeout( () => { // We need to wait a bit for the templateLock to get applied to the tabContent component.
			const tabContentBlock = parentBlock.innerBlocks[ 0 ].name === 'stackable/tab-content' ? parentBlock.innerBlocks[ 0 ] : parentBlock.innerBlocks[ 1 ]

			dispatch( 'core/block-editor' ).duplicateBlocks( [ tabContentBlock.innerBlocks[ index - 1 ].clientId ], false )
			setTemplateLock( true )
		}, 1 )

		// Focus on the new tab label
		setTimeout( () => {
			const range = document.createRange()
			range.selectNodeContents( getRef( index ).current )
			range.collapse( false )

			const selection = window.getSelection() // eslint-disable-line
			selection.removeAllRanges()
			selection.addRange( range )
		}, 1 )

		// Change the active tab
		setActiveTab( index + 1 )
	}

	const deleteActiveTab = () => {
		const index = activeTab - 1
		// Delete the tab label
		const updatedLabels = cloneDeep( props.attributes.tabLabels )
		updatedLabels.splice( index, 1 )
		setAttributes( { tabLabels: updatedLabels } )

		// Delete the tab content
		setTemplateLock( false )
		setTimeout( () => {
			const tabContentBlock = parentBlock.innerBlocks[ 0 ].name === 'stackable/tab-content' ? parentBlock.innerBlocks[ 0 ] : parentBlock.innerBlocks[ 1 ]
			dispatch( 'core/block-editor' ).removeBlocks( [ tabContentBlock.innerBlocks[ index ].clientId ], false )
			setTemplateLock( true )
		}, 1 )

		// The next index should be the same, unless we're deleting the last tab
		const newIndex = index === updatedLabels.length ? index - 1 : index

		// Focus on the new tab label index
		setTimeout( () => {
			const range = document.createRange()
			range.selectNodeContents( getRef( newIndex ).current )
			range.collapse( false )

			const selection = window.getSelection() // eslint-disable-line
			selection.removeAllRanges()
			selection.addRange( range )
		}, 200 )

		// Change the active tab
		setActiveTab( newIndex + 1 )
	}

	// Filter the available styles depending on the context.
	const blockStyles = _blockStyles.map( style => {
		let disabled = false
		if ( context[ 'stackable/tabOrientation' ] === 'vertical' ) {
			if ( HORIZONTAL_STYLES.includes( style.name ) ) {
				disabled = true
			}
		}
		return {
			...style,
			disabled,
		}
	} )

	const [ tabLabels, setTabLabels ] = useState( props.attributes.tabLabels )

	useEffect( () => {
		setTabLabels( props.attributes.tabLabels )
	}, [ props.attributes.tabLabels ] )

	const blockClassNames = classnames( [
		className,
		'stk-block-tab-labels',
		{
			'stk-block-tab-labels--wrap-mobile': ! props.attributes.scrollableOnMobile,
		},
	] )

	const textClassNames = classnames( [
		'stk-block-tab-labels__text',
		textClasses,
		blockAlignmentClass,
	] )

	return (
		<>
			<InspectorControls
				activeTab={ activeTab }
				moveActiveTabLeft={ moveActiveTabLeft }
				moveActiveTabRight={ moveActiveTabRight }
				addNewTab={ addNewTab }
				deleteActiveTab={ deleteActiveTab }
				duplicateTab={ duplicateTab }
				tabLabels={ tabLabels }
				setTabLabels={ setTabLabels }
				context={ context }
				blockStyles={ blockStyles }
				setAttributes={ setAttributes }
				blockState={ props.blockState }
				attributes={ {
					tabLabels: props.attributes.tabLabels,
					className: props.attributes.className,
					blockMargin: props.attributes.blockMargin,
					iconPosition: props.attributes.iconPosition,
					showIcon: props.attributes.showIcon,
					fullWidth: props.attributes.fullWidth,
				} }
			/>

			<TabStyles
				version={ VERSION }
				blockState={ props.blockState }
				clientId={ clientId }
			/>
			<CustomCSS mainBlockClass="stk-block-tab-labels" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<div className="stk-block-tab-labels__wrapper">
					{ props.attributes.tabLabels.map( ( tab, index ) => {
						return (
							// eslint-disable-next-line jsx-a11y/role-supports-aria-props
							<button
								className={ classnames( 'stk-block-tabs__tab', {
									'stk-block-tabs__tab--active': activeTab === index + 1,
								} ) }
								aria-selected={ activeTab === index + 1 ? 'true' : 'false' }
								key={ index }
								onClick={ () => onClick( index + 1 ) }
							>
								{ props.attributes.showIcon && (
									<Icon
										onChange={ icon => updateTabIcon( icon, index ) }
										value={ props.attributes.tabLabels[ index ].icon }
									/>
								) }
								<div className={ textClassNames }>
									<RichText
										key={ index }
										ref={ getRef( index ) }
										tagName="span"
										value={ tab.label }
										onChange={ content => {
											updateTabLabel( content, index )
										} }
										__unstableOnSplitAtEnd={ () => {
											addNewTab( index + 1 )
										} }
										onRemove={ () => {
											// Only do this when there is more than 1 tab
											if ( props.attributes.tabLabels.length > 1 ) {
												// Prompt first if the user really wants to delete the tab
												if ( confirm( __( 'Are you sure you want to delete this tab?', i18n ) ) ) { // eslint-disable-line no-alert
													deleteActiveTab()
												}
											}
										} }
										withoutInteractiveFormatting
										allowedFormats={ [] }
										placeholder={ __( 'Tab Label', i18n ) }
										attrNameTemplate="tab%s"
									/>
								</div>
							</button>
		 )
					} ) }
				</div>
			</BlockDiv>
		</>
	)
}

/**
 * Allows for multiple refs to be used in a loop.
 *
 * @see https://stackoverflow.com/a/70572294
 */
const useGetRef = () => {
	const refs = useRef( {} )
	return useCallback(
	  idx => ( refs.current[ idx ] ??= createRef() ),
	  [ refs ]
	)
}

const InspectorControls = memo( props => {
	return (
		<>
			<InspectorTabs />

			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						label={ __( 'Move left', i18n ) }
						icon="arrow-left-alt2"
						disabled={ props.activeTab === 1 }
						onClick={ props.moveActiveTabLeft }
					/>
					<ToolbarButton
						label={ __( 'Move right', i18n ) }
						icon="arrow-right-alt2"
						disabled={ props.activeTab === props.attributes.tabLabels.length }
						onClick={ props.moveActiveTabRight }
					/>
				</ToolbarGroup>
			</BlockControls>

			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						label={ __( 'Add tab', i18n ) }
						icon="plus-alt2"
						onClick={ () => props.addNewTab( props.activeTab ) }
					/>
					<ToolbarButton
						label={ __( 'Duplicate tab', i18n ) }
						icon="admin-page"
						onClick={ () => props.duplicateTab( props.activeTab ) }
					/>
					<ToolbarButton
						label={ __( 'Delete tab', i18n ) }
						icon="trash"
						disabled={ props.attributes.tabLabels.length === 1 }
						onClick={ () => {
							// Prompt first if the user really wants to delete the tab
							if ( confirm( __( 'Are you sure you want to delete this tab?', i18n ) ) ) { // eslint-disable-line no-alert
								props.deleteActiveTab()
							}
						} }
					/>
				</ToolbarGroup>
			</BlockControls>

			<InspectorLayoutControls>
				{ props.context[ 'stackable/tabOrientation' ] !== 'vertical' && <>
					<AdvancedToggleControl
						label={ __( 'Full Width', i18n ) }
						attribute="fullWidth"
						defaultValue={ false }
						onChange={ fullWidth => {
							const newAttributes = { fullWidth }

							// For ceneterd pills, we have block margin
							// left/right set to auto, so the full width
							// option would look like it's not working,
							// change the margins too.
							const activeStyle = getBlockStyle( props.blockStyles, props.attributes.className )
							if ( activeStyle.name === 'centered-pills' ) {
								props.attributes.blockMargin = {
									top: props.attributes.blockMargin?.top || '',
									bottom: props.attributes.blockMargin?.bottom || '',
								}
								if ( fullWidth ) {
									const right = props.attributes.blockMargin?.right || ''
									const left = props.attributes.blockMargin?.left || ''
									props.attributes.blockMargin.right = right === 'auto' ? '' : right
									props.attributes.blockMargin.left = left === 'auto' ? '' : left
								} else {
									const right = props.attributes.blockMargin?.right || 'auto'
									const left = props.attributes.blockMargin?.left || 'auto'
									props.attributes.blockMargin.right = right === '' ? 'auto' : right
									props.attributes.blockMargin.left = left === '' ? 'auto' : left
								}
							}

							props.setAttributes( newAttributes )
						} }
					/>
				</> }

				{ ( ( props.attributes.iconPosition === '' || props.attributes.iconPosition === 'right' ) && props.attributes.showIcon ) && // Check if icon position is left or right
							( ( props.context[ 'stackable/tabOrientation' ] !== 'vertical' && props.attributes.fullWidth ) || props.context[ 'stackable/tabOrientation' ] === 'vertical' ) && // Show if its in horizontal position and fullWidth OR show on vertical position
								<AdvancedToggleControl
									label={ __( 'Fixed Icon Position', i18n ) }
									attribute="fixedIconPosition"
									defaultValue={ false }
								/>
				}

				{ props.attributes.showIcon &&
					<AdvancedToolbarControl
						label={ __( 'Icon Position', i18n ) }
						controls={ ICON_ALIGN_OPTIONS }
						attribute="iconPosition"
					/>
				}

				{ props.context[ 'stackable/tabOrientation' ] !== 'vertical' && <>
					{ ! props.attributes.fullWidth && (
						<AdvancedToolbarControl
							label={ __( 'Tab Alignment', i18n ) }
							attribute="tabAlignment"
							controls="horizontal"
							// default="flex-start"
							responsive="all"
							// value={ props.attributes.tabAlignment |' }
						/>
					) }
				</> }

				{ ( props.attributes.fullWidth || props.context[ 'stackable/tabOrientation' ] === 'vertical' || props.attributes.iconPosition === 'top' || props.attributes.iconPosition === 'bottom' ) && <>
					<AlignButtonsControl
						label={ __( 'Text Alignment', i18n ) }
						attribute="contentAlign"
						responsive="all"
					/>
				</> }

				{ props.context[ 'stackable/tabOrientation' ] !== 'vertical' && <>
					<AdvancedRangeControl
						label={ __( 'Column Gap', i18n ) }
						attribute="columnGap"
						min={ 0 }
						sliderMax={ 50 }
						placeholder="12"
						responsive="all"
					/>
				</> }

				<AdvancedRangeControl
					label={ __( 'Row Gap', i18n ) }
					attribute="rowGap"
					min={ 0 }
					sliderMax={ 50 }
					placeholder="8"
					responsive="all"
				/>

				{ props.attributes.showIcon &&
					<AdvancedRangeControl
						label={ __( 'Icon Gap', i18n ) }
						attribute="iconGap"
						min={ 0 }
						sliderMax={ 50 }
						placeholder="8"
					/>
				}

				<AdvancedToggleControl
					label={ __( 'Scrollable Tabs on Mobile', i18n ) }
					attribute="scrollableOnMobile"
					defaultValue={ true }

				/>

			</InspectorLayoutControls>

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Tab', i18n ) }
					initialOpen={ true }
					id="tab"
				>
					<BlockStyles styles={ props.blockStyles } context={ props.context } />
					<ControlSeparator />

					<Button.InspectorControls.Colors.Controls
						// We add our own text color and icon color
						hasTextColor={ false }
						hasIconColor={ false }
						attrNameTemplate="tab%s"
					/>
					<ColorPaletteControl
						label={ __( 'Text Color', i18n ) }
						attribute="tabTextColor1"
						hover="all"
					/>
					{ props.attributes.showIcon &&
						<ColorPaletteControl
							label={ __( 'Icon Color', i18n ) }
							// We need this name because the Button Block Component uses this.
							attribute="tabIconColor1"
							hover="all"
						/>
					}
					<ControlSeparator />
					<Button.InspectorControls.Size.Controls
						attrNameTemplate="tab%s"
					/>
					<ControlSeparator />
					<Button.InspectorControls.Borders.Controls
						attrNameTemplate="tab%s"
					/>
				</PanelAdvancedSettings>

				<PanelAdvancedSettings
					title={ __( 'Tab Active State', i18n ) }
					id="tab-active-state"
				>
					<Button.InspectorControls.Colors.Controls
						hasTextColor={ false }
						hasIconColor={ false }
						attrNameTemplate="activeTab%s"
					/>
					<ColorPaletteControl
						label={ __( 'Text Color', i18n ) }
						attribute="activeTabTextColor"
						hover="all"
					/>
					{ props.attributes.showIcon &&
						<ColorPaletteControl
							label={ __( 'Icon Color', i18n ) }
							// We need this name because the Button Block Component uses this.
							attribute="activeTabIconColor1"
							hover="all"
						/>
					}
					<ControlSeparator />
					<Button.InspectorControls.Borders.Controls
						attrNameTemplate="activeTab%s"
						hasBorderType={ false }
						borderTypeValue={ props.attributes.tabBorderType } // Change this to the value of the border type control
						hasBorderRadius={ false }
					/>
				</PanelAdvancedSettings>

				<PanelAdvancedSettings
					title={ __( 'Typography', i18n ) }
					initialOpen={ false }
					id="typography"
				>
					<Typography.InspectorControls.Controls
						attrNameTemplate="tab%s"
						{ ...props }
						hasTextContent={ false }
						hasTextTag={ false }
						isMultiline={ true }
						initialOpen={ true }
						hasTextShadow={ true }
						hasGradient={ false }
						hasInset={ false }
					/>
				</PanelAdvancedSettings>

				<PanelAdvancedSettings
					title={ __( 'Icon', i18n ) }
					initialOpen={ false }
					hasToggle={ true }
					checked={ props.attributes.showIcon }
					onChange={ showIcon => props.setAttributes( { showIcon } ) }
					id="icon"
				>
					<Icon.InspectorControls
						attrNameTemplate="tab%s"
						wrapInPanels={ false }
						hasGradient={ false }
						hasShape={ false }
						hasBackgroundShape={ false }
						hasIconGap={ true }
						hasIconPosition={ false }
						defaultValue={ defaultIcon }
						iconControlHelp={ __( 'Change icons individually by clicking on each tab\'s icon.', i18n ) }
						iconGapPlaceholder="8"
						onChangeIcon={ icon => {
							// Reset all tab label icons.
							const newTabLabels = cloneDeep( props.attributes.tabLabels ).map(
								tab => ( {
									...tab,
									icon: '',
								} )
							)
							props.setAttributes( {
								icon,
								tabLabels: newTabLabels,
							} )
						} }
					>
						<AdvancedToolbarControl
							label={ __( 'Icon Position', i18n ) }
							controls={ ICON_ALIGN_OPTIONS }
							attribute="iconPosition"
						/>
					</Icon.InspectorControls>
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<BlockDiv.InspectorControls />

			<InspectorAdvancedControls>
				<PanelAdvancedSettings
					title={ __( 'Tab Anchors', i18n ) }
					id="tabAnchors"
				>
					<GutBaseControl help={ __( "Assign unique anchor names to each tab so you'll be able to link directly and open each one.", i18n ) } />
					{ props.tabLabels.map( ( tab, index ) => (
						<AdvancedTextControl
							label={ sprintf(
								// Translators: %s is the tab label.
								__( '%s Anchor', i18n ),
								// eslint-disable-next-line @wordpress/i18n-no-variables
								__( tab.label, i18n )
							) }
							value={ props.tabLabels[ index ].anchor }
							placeholder={ __( 'Tab Anchor', i18n ) }
							key={ `tab-anchors-${ index }` }
							onChange={ value => {
								const updatedLabels = cloneDeep( props.tabLabels )
								updatedLabels[ index ].anchor = value
								props.setTabLabels( updatedLabels )

								if ( ! value ) {
									props.setAttributes( { tabLabels: updatedLabels } )
								}
							} }
							onBlur={ () => {
								const updatedLabels = props.tabLabels
								if ( updatedLabels[ index ].anchor ) {
									updatedLabels[ index ].anchor = kebabCase( updatedLabels[ index ].anchor )
									props.setAttributes( { tabLabels: updatedLabels } )
								}
							} }
						/>
					) ) }

				</PanelAdvancedSettings>
			</InspectorAdvancedControls>

			<Advanced.InspectorControls />
			<Transform.InspectorControls />

			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-tab-labels" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />
		</>
	)
} )

export default compose(
	withBlockWrapper,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
