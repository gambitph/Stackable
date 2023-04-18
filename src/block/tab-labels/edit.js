/**
 * Internal dependencies
 */
import { TabLabelStyle } from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import {
	InspectorTabs, Button, InspectorStyleControls, AdvancedRangeControl, AdvancedToggleControl, PanelAdvancedSettings,
} from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	CustomCSS,
	CustomAttributes,
	Icon,
	BackgroundControls,
	SizeControls,
	BorderControls,
	Typography,
	getTypographyClasses,
} from '~stackable/block-components'
import {
	withBlockAttributeContext,
	withBlockWrapperIsHovered,
	withQueryLoopContext,
} from '~stackable/higher-order'
import { version as VERSION, i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import { dispatch, select } from '@wordpress/data'
import { attributes } from '../tabs/schema'
import { useEffect } from '@wordpress/element'
import { getBlockFromExample } from '@wordpress/blocks'
import { BlockControls, RichText } from '@wordpress/block-editor'
import { useSetActiveTabContext } from './with-active-tab'
import { ToolbarGroup } from '@wordpress/components'
import { addFilter } from '@wordpress/hooks'

export const checkOpen = i => {
	if ( i === 1 ) {
		return true
	}
	return false
}

addFilter( 'stackable.icon-position-options', 'tab-labels', ( output, blockName ) => {
	if ( blockName !== 'stackable/tab-labels' ) {
		return output
	}

	return (
		[
			...output,
			{ value: 'top', label: __( 'Top', i18n ) },
			{ value: 'bottom', label: __( 'Bottom', i18n ) },
		]
	)
} )

const Edit = props => {
	const {
		className,
		isSelected,
		setAttributes,
	} = props

	const labelTextClasses = getTypographyClasses( props.attributes )

	useGeneratedCss( props.attributes )
	const [ activeTab, setActiveTab ] = useSetActiveTabContext()
	const initialTabOpen = props.context[ 'stackable/initialTabOpen' ]

	// In charge of setting the active tab class - used for displaying the
	// current tab content.
	useEffect( () => {
		setActiveTab( currentActiveTab => {
			if ( currentActiveTab === null ) {
				return initialTabOpen
			} else if ( currentActiveTab > props.attributes.tabCount ) {
				return props.attributes.tabCount
			}
			return currentActiveTab
		} )
	}, [ initialTabOpen, props.attributes.tabCount ] )

	const {
		insertBlock, updateBlockAttributes, removeBlock, replaceInnerBlocks,
	} = dispatch( 'core/block-editor' )

	const {
		getBlockRootClientId, getNextBlockClientId, getBlock,
	} = select( 'core/block-editor' )

	const updateTabLabel = ( content, index ) => {
		const updatedLabels = [ ...props.attributes.tabs ]
		updatedLabels[ index ].label = content
		setAttributes( { tabs: updatedLabels } )
	}

	const blockClassNames = classnames( [
		className,
		'stk-block-tab-labels',
	] )

	const labelClassNames = classnames( [
		labelTextClasses,
		'stk-block-tab-labels__text',
	] )

	const tabs = props.attributes.tabs.map( ( tab, index ) => {
		return (
			<button className="stk-block-tabs__tab"
				key={ index }
				onClick={ () => setActiveTab( index + 1 ) }
			>
				{ props.attributes.iconPosition !== 'right' && <Icon /> }
				<div className={ labelClassNames }>
					<RichText
						key={ index }
						tagName="p"
						value={ tab.label }
						onChange={ content => {
							updateTabLabel( content, index )
						} }
						withoutInteractiveFormatting
						allowedFormats={ [] }
					/>
				</div>
				{ props.attributes.iconPosition === 'right' && <Icon /> }
			</button>
		 )
	} )

	return (
		<>
			{ isSelected && (
				<>
					<BlockControls>
						<ToolbarGroup className="stackable-dynamic-content">
							{ activeTab !== 1 && <Button
								icon="arrow-left-alt2"
								onClick={ () => {
									const tabContentClientId = getNextBlockClientId( props.clientId )
									const tabContentInnerBlocks = getBlock( tabContentClientId ).innerBlocks

									const tabLabels = [ ...props.attributes.tabs ]
									const tempLabel = tabLabels[ activeTab - 1 ]
									tabLabels[ activeTab - 1 ] = tabLabels[ activeTab - 2 ]
									tabLabels[ activeTab - 2 ] = tempLabel

									setAttributes( { tabs: tabLabels } )
									setActiveTab( activeTab - 1 )

									const tempColumn = tabContentInnerBlocks[ activeTab - 1 ]
									tabContentInnerBlocks[ activeTab - 1 ] = tabContentInnerBlocks[ activeTab - 2 ]
									tabContentInnerBlocks[ activeTab - 2 ] = tempColumn
									replaceInnerBlocks( tabContentClientId, tabContentInnerBlocks, false, null )
								} }
							/> }
							{ activeTab < props.attributes.tabs.length && <Button
								icon="arrow-right-alt2"
								onClick={ () => {
									const tabContentClientId = getNextBlockClientId( props.clientId )
									const tabContentInnerBlocks = getBlock( tabContentClientId ).innerBlocks

									const tabLabels = [ ...props.attributes.tabs ]
									const tempLabel = tabLabels[ activeTab - 1 ]
									tabLabels[ activeTab - 1 ] = tabLabels[ activeTab ]
									tabLabels[ activeTab ] = tempLabel

									setAttributes( { tabs: tabLabels } )
									setActiveTab( activeTab + 1 )

									const tempColumn = tabContentInnerBlocks[ activeTab - 1 ]
									tabContentInnerBlocks[ activeTab - 1 ] = tabContentInnerBlocks[ activeTab ]
									tabContentInnerBlocks[ activeTab ] = tempColumn
									replaceInnerBlocks( tabContentClientId, tabContentInnerBlocks, false, null )
								} }
							/> }
							<Button
								icon="no-alt"
								onClick={ () => {
									const tabsBlockClientId = getBlockRootClientId( props.clientId )
									const tabContentClientId = getNextBlockClientId( props.clientId )
									const tabContent = getBlock( tabContentClientId )
									// console.log( activeTab a)
									const updatedLabels = [ ...props.attributes.tabs ]
									updatedLabels.splice( activeTab - 1, 1 )
									removeBlock( tabContent.innerBlocks[ activeTab - 1 ].clientId, false )
									updateBlockAttributes( tabsBlockClientId, { tabCount: props.attributes.tabs.length - 1 }, false ) // eslint-disable-line stackable/no-update-block-attributes
									setActiveTab( activeTab - 1 )
									setAttributes( { tabs: updatedLabels } )
								} }
							/>
						</ToolbarGroup>
					</BlockControls>
					<InspectorTabs />
					<InspectorStyleControls>
						<PanelAdvancedSettings
							title={ __( 'General', i18n ) }
							id="tab-labels"
							initialOpen={ true }
						>
							<AdvancedRangeControl
								label={ __( 'Gap', i18n ) }
								attribute="gap"
								min={ 0 }
							/>
							<AdvancedToggleControl
								label={ __( 'Full Width', i18n ) }
								attribute="fullWidth"
								default={ false }
							/>
						</PanelAdvancedSettings>
						<PanelAdvancedSettings
							title={ __( 'Labels Background', i18n ) }
							id="tabLabelsBackground"
						>
							<BackgroundControls attrNameTemplate="tabLabels%s" />
						</PanelAdvancedSettings>
						<PanelAdvancedSettings
							title={ __( 'Labels Spacing', i18n ) }
							id="tabLabelsSpacing"
						>
							<SizeControls attrNameTemplate="tabLabels%s" />
						</PanelAdvancedSettings>
						<PanelAdvancedSettings
							title={ __( 'Labels Borders & Shadows', i18n ) }
							id="tabLabelsBorderAndShadows"
						>
							<BorderControls attrNameTemplate="tabLabels%s" />
						</PanelAdvancedSettings>
					</InspectorStyleControls>
					<Typography.InspectorControls
						label={ __( 'Label', i18n ) }
						hasTextTag={ false }
						hasTextContent={ false }
						initialOpen={ false }
					/>
					<Icon.InspectorControls
						hasColor={ true }
						hasGradient={ false }
						hasShape={ false }
						hasBackgroundShape={ false }
						hasIconGap={ true }
						hasIconPosition={ true }
						defaultValue=""
						blockName={ props.name }
					/>
					<BlockDiv.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-tab-labels" />
				</>
			) }

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<TabLabelStyle
					version={ VERSION }
					blockState={ props.blockState }
					clientId={ props.clientId }
				/>
				<div className="stk-block-tab-labels__wrapper">
					{ tabs }
					{ isSelected && <button
						className="stk-tabs__add-tab"
						onClick={ () => {
							const tabContent = getNextBlockClientId( props.clientId )
							const tabsBlock = getBlockRootClientId( props.clientId )
							const block = getBlockFromExample( 'stackable/column', {} ) // eslint-disable-line
							const newTabCount = props.attributes.tabs.length + 1
							updateBlockAttributes( tabsBlock, { tabCount: newTabCount }, false ) // eslint-disable-line stackable/no-update-block-attributes
							insertBlock( block, attributes.tabCount, tabContent, false )
							setAttributes( { tabs: [ ...props.attributes.tabs, { label: __( 'Tab', i18n ) + ` ${ props.attributes.tabs.length + 1 }`, icon: '' } ] } )
							setActiveTab( newTabCount )
						} }
					>
						+
					</button> }
				</div>
			</BlockDiv>
		</>
	)
}

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
