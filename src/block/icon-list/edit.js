/**
 * Internal dependencies
 */
import { IconListStyles } from './style'

/***
 * External dependencies
 */
import classnames from 'classnames'
import { i18n, version as VERSION } from 'stackable'
import {
	InspectorTabs,
	InspectorStyleControls,
	PanelAdvancedSettings,
	AdvancedRangeControl,
	AdvancedToggleControl,
	IconControl,
	ColorPaletteControl,
	AdvancedToolbarControl,
	AdvancedSelectControl,
	AlignButtonsControl,
} from '~stackable/components'
import {
	withBlockAttributeContext, withBlockWrapperIsHovered, withQueryLoopContext,
} from '~stackable/higher-order'
import {
	Typography,
	BlockDiv,
	useGeneratedCss,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	getTypographyClasses,
	ConditionalDisplay,
	MarginBottom,
	Alignment,
	getAlignmentClasses,
	Transform,
} from '~stackable/block-components'
import { useBlockContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { sprintf, __ } from '@wordpress/i18n'
import { DEFAULT_SVG, IconSvgDef } from './util'
import { compose } from '@wordpress/compose'
import { useInnerBlocksProps } from '@wordpress/block-editor'
import { dispatch } from '@wordpress/data'
import { addFilter } from '@wordpress/hooks'

const ALLOWED_INNER_BLOCKS = [ 'stackable/icon-list-item' ]

const TEMPLATE = [
	[ 'stackable/icon-list-item', {	text: '' } ],
]

const listTypeOptions = [
	{
		label: __( 'Unordered List', i18n ),
		value: 'unordered',
	},
	{
		label: __( 'Ordered List', i18n ),
		value: 'ordered',
	},
]

const listStyleTypeOptions = [
	{
		label: __( 'Number', i18n ),
		value: 'decimal',
	},
	{
		label: __( 'Padded Number', i18n ),
		value: 'decimal-leading-zero',
	},
	{
		label: __( 'Lowercase Roman', i18n ),
		value: 'lower-roman',
	},
	{
		label: __( 'Uppercase Roman', i18n ),
		value: 'upper-roman',
	},
	{
		label: __( 'Lowercase Letters', i18n ),
		value: 'lower-alpha',
	},
	{
		label: __( 'Uppercase Letters', i18n ),
		value: 'upper-alpha',
	},
]

const BORDER_CONTROLS = [
	{
		value: '',
		title: __( 'None', i18n ),
	},
	{
		value: 'solid',
		title: __( 'Solid', i18n ),
	},
	{
		value: 'dashed',
		title: __( 'Dashed', i18n ),
	},
	{
		value: 'dotted',
		title: __( 'Dotted', i18n ),
	},
]

const Edit = props => {
	const {
		clientId,
		attributes,
		setAttributes,
		className,
		isSelected,
	} = props

	useGeneratedCss( props.attributes )

	const {
		ordered, icon, listItemBorderStyle,
	} = attributes
	const TagName = ordered ? 'ol' : 'ul'
	const tagNameClass = ordered ? 'stk-block-icon-list__ol' : 'stk-block-icon-list__ul'

	const textClasses = getTypographyClasses( attributes )
	const blockAlignmentClass = getAlignmentClasses( attributes )
	const { innerBlocks } = useBlockContext()

	const blockClassNames = classnames( [
		className,
		'stk-block-icon-list',
		blockAlignmentClass,
		textClasses,
	] )

	const resetCustomIcons = () => {
		innerBlocks.forEach( block => {
			dispatch( 'core/block-editor' ).updateBlockAttributes( block.clientId, { icon: '' } )
		} )
	}

	const innerBlocksProps = useInnerBlocksProps( {
		className: tagNameClass,
	}, {
		allowedBlocks: ALLOWED_INNER_BLOCKS,
		template: TEMPLATE,
		templateInsertUpdatesSelection: true,
		renderAppender: false,
		__experimentalCaptureToolbars: true,
	} )

	return (
		<>
			{ isSelected && (
				<>
					<InspectorTabs />

					<InspectorStyleControls>
						<PanelAdvancedSettings
							title={ __( 'General', i18n ) }
							initialOpen={ true }
							id="general"
						>
							<AdvancedSelectControl
								label={ __( 'List Type', i18n ) }
								options={ listTypeOptions }
								value={ ordered ? 'ordered' : 'unordered' }
								onChange={ v => setAttributes( { ordered: v === 'ordered' } ) }
								default="unordered"
							/>

							<AdvancedRangeControl
								label={ __( 'Columns', i18n ) }
								attribute="columns"
								min="1"
								sliderMax="3"
								step="1"
								placeholder="1"
								responsive="all"
							/>

							<AdvancedRangeControl
								label={ __( 'Column Gap', i18n ) }
								attribute="columnGap"
								min="0"
								sliderMax="50"
								responsive="all"
								placeholder="16"
							/>

							<AdvancedRangeControl
								label={ __( 'Row Gap', i18n ) }
								attribute="rowGap"
								min="0"
								sliderMax="50"
								responsive="all"
							/>

							<AdvancedRangeControl
								label={ __( 'Icon Gap', i18n ) }
								attribute="iconGap"
								min="0"
								sliderMax="20"
								responsive="all"
							/>

							<AdvancedRangeControl
								label={ __( 'Indentation', i18n ) }
								attribute="indentation"
								min="0"
								sliderMax="50"
								responsive="all"
								placeholder=""
							/>
							<AlignButtonsControl
								label={ sprintf( __( '%s Alignment', i18n ), __( 'List', i18n ) ) }
								attribute="listAlignment"
								responsive="all"
							/>
						</PanelAdvancedSettings>
					</InspectorStyleControls>

					<InspectorStyleControls>
						<PanelAdvancedSettings
							title={ __( 'Icons & Numbers', i18n ) }
							initialOpen={ false }
							id="icon-and-markers"
						>
							<IconControl
								label={ __( 'Icon', i18n ) }
								value={ attributes.icon }
								onChange={ icon => {
									setAttributes( { icon } )
									// Reset custom individual icons.
									resetCustomIcons()
								} }
								defaultValue={ DEFAULT_SVG }
							/>

							<AdvancedSelectControl
								label={ __( 'List Type', i18n ) }
								attribute="listType"
								options={ listStyleTypeOptions }
							/>

							<ColorPaletteControl
								label={ __( 'Color', i18n ) }
								attribute="markerColor"
								hover="all"
							/>

							<AdvancedRangeControl
								label={ __( 'Icon / Number Size', i18n ) }
								attribute="iconSize"
								min={ 0 }
								max={ 50 }
								step={ 1 }
								allowReset={ true }
								responsive="all"
								placeholder="16"
							/>

							<AdvancedRangeControl
								label={ __( 'Icon Opacity', i18n ) }
								attribute="iconOpacity"
								min={ 0 }
								max={ 1 }
								step={ 0.1 }
								allowReset={ true }
								placeholder="1.0"
								hover="all"
							/>

							<AdvancedRangeControl
								label={ __( 'Icon Rotation', i18n ) }
								attribute="iconRotation"
								min={ 0 }
								max={ 360 }
								allowReset={ true }
								placeholder="0"
							/>

							<AdvancedToolbarControl
								label={ __( 'Icon Vertical Alignment', i18n ) }
								controls="vertical"
								attribute="iconVerticalAlignment"
								fullwidth={ true }
								responsive="all"
								help={ __( 'Visible if you have long text in your list.', i18n ) }
							/>

							<AdvancedRangeControl
								label={ __( 'Icon Vertical Offset', i18n ) }
								attribute="iconVerticalOffset"
								min={ -1000 }
								sliderMin={ -50 }
								sliderMax={ 50 }
								step={ 1 }
								allowReset={ true }
								responsive="all"
								placeholder="0"
							/>
						</PanelAdvancedSettings>

						<PanelAdvancedSettings
							title={ __( 'Icon List Item Borders', i18n ) }
							initialOpen={ false }
							id="icon-list-item-borders"
						>
							<AdvancedToolbarControl
								label={ __( 'Borders', i18n ) }
								controls={ BORDER_CONTROLS }
								className="ugb-border-controls__border-type-toolbar"
								attribute="listItemBorderStyle"
								fullwidth={ true }
								isSmall={ true }
							/>

							{ listItemBorderStyle &&
								<AdvancedRangeControl
									label={ __( 'Border Width', i18n ) }
									attribute="listItemBorderWidth"
									responsive="all"
									min={ 0 }
									max={ 99 }
									step={ 1 }
									sliderMax={ 5 }
									defaultLocked={ true }
									placeholder="1"
								/>
							}

							{ listItemBorderStyle &&
								<ColorPaletteControl
									label={ __( 'Border Color', i18n ) }
									attribute="listItemBorderColor"
									default="#00000066"
								/>
							}

							{ listItemBorderStyle &&
								<AdvancedToggleControl
									label={ __( 'Full Width Borders', i18n ) }
									attribute="listItemBorderFullWidth"
									defaultValue={ false }
								/> }

						</PanelAdvancedSettings>
					</InspectorStyleControls>

					<Typography.InspectorControls
						{ ...props }
						isMultiline={ true }
						initialOpen={ false }
						hasTextTag={ false }
						hasTextContent={ false }
					/>

					<Alignment.InspectorControls />
					<BlockDiv.InspectorControls />
					<Advanced.InspectorControls />
					<Transform.InspectorControls />
					<EffectsAnimations.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-icon-list" />
					<Responsive.InspectorControls />
					<ConditionalDisplay.InspectorControls />
				</>
			) }

			<IconListStyles
				version={ VERSION }
				blockState={ props.blockState }
				clientId={ clientId }
			/>
			<CustomCSS mainBlockClass="stk-block-icon-list" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				{ ! ordered && <IconSvgDef icon={ icon } uniqueId={ attributes.uniqueId } /> }
				<TagName { ...innerBlocksProps } />
			</BlockDiv>
			{ props.isHovered && <MarginBottom /> }
		</>
	)
}

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )

addFilter( 'stackable.edit.margin-bottom.enable-handlers', 'stackable/icon-list', ( enabled, parentBlock ) => {
	return parentBlock?.name === 'stackable/icon-list-item' ? false : enabled
} )
