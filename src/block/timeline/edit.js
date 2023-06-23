/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import { i18n, version as VERSION } from 'stackable'
import classnames from 'classnames'
import {
	AdvancedRangeControl,
	AdvancedToolbarControl,
	ColorPaletteControl,
	ControlSeparator,
	GroupPlaceholder,
	InspectorLayoutControls,
	InspectorStyleControls,
	InspectorTabs,
	PanelAdvancedSettings,
} from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	MarginBottom,
	getRowClasses,
	getAlignmentClasses,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	getSeparatorClasses,
	Transform,
	ContentAlign,
	getContentAlignmentClasses,
	Typography,
} from '~stackable/block-components'
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
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
import { InnerBlocks } from '@wordpress/block-editor'

const ALLOWED_INNER_BLOCKS = [ 'stackable/column' ]

const TEMPLATE = [
	[ 'stackable/column', {
		columnSpacing: {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
		},
	}, [
		[ 'stackable/text', {
			text: _x( 'Description for this block. Use this space for describing your block. Any text will do.', 'Content placeholder', i18n ),
		} ],
	] ],
]

const COLOR_TYPE_CONTROLS = [
	{
		value: '',
		title: __( 'Single', i18n ),
	},
	{
		value: 'gradient',
		title: __( 'Gradient', i18n ),
	},
]

const Edit = props => {
	const {
		className,
		clientId,
		isSelected,
	} = props

	useGeneratedCss( props.attributes )

	const rowClass = getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { hasInnerBlocks } = useBlockContext()

	const blockClassNames = classnames( [
		className,
		'stk-block-timeline',
		rowClass,
		separatorClass,
		{
			'stk-block-timeline--left': props.attributes.timelinePosition !== 'right',
			'stk-block-timeline--right': props.attributes.timelinePosition === 'right',
		},
	] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	], getContentAlignmentClasses( props.attributes ) )

	return (
		<>
			{ isSelected && (
				<>
					<InspectorTabs />

					<InspectorLayoutControls>
						<AdvancedToolbarControl
							label={ __( 'Content Position', i18n ) }
							attribute="timelinePosition"
							controls={ [
								{ value: '', title: __( 'Left', i18n ) },
								{ value: 'right', title: __( 'Right', i18n ) },
							] }
						/>
						<AdvancedRangeControl
							label={ sprintf( __( '%s Gap', i18n ), __( 'Timeline', i18n ) ) }
							attribute="timelineGap"
							sliderMax={ 100 }
							min={ 0 }
							responsive="all"
							placeholder="16"
						/>
					</InspectorLayoutControls>

					<InspectorStyleControls>
						<PanelAdvancedSettings
							title={ __( 'Timeline', i18n ) }
							initialOpen={ true }
							id="timeline"
						>
							<AdvancedRangeControl
								label={ __( 'Accent Anchor Position', i18n ) }
								attribute="timelineAnchor"
								sliderMax={ 100 }
								min={ 0 }
								placeholder="50"
								responsive="all"
								help={ __( 'Succeeding timeline blocks will also use this value.', i18n ) }
							/>

							<ControlSeparator />

							<AdvancedRangeControl
								label={ sprintf( __( '%s Size', i18n ), __( 'Dot', i18n ) ) }
								attribute="timelineDotSize"
								sliderMax={ 100 }
								sliderMin={ props.attributes.timelineThickness || 3 }
								min={ 1 }
								placeholder="11"
							/>
							<AdvancedRangeControl
								label={ sprintf( __( '%s Border Radius', i18n ), __( 'Dot', i18n ) ) }
								attribute="timelineDotBorderRadius"
								sliderMax={ props.attributes.timelineDotSize / 2 }
								min={ 0 }
								placeholder=""
							/>
							<AdvancedRangeControl
								label={ __( 'Thickness', i18n ) }
								attribute="timelineThickness"
								sliderMax={ 20 }
								min={ 1 }
								placeholder="3"
							/>
							<AdvancedRangeControl
								label={ __( 'Horizontal Offset', i18n ) }
								attribute="timelineOffset"
								sliderMax={ 100 }
								min={ 0 }
								placeholder="40"
							/>

							<ControlSeparator />

							<AdvancedToolbarControl
								controls={ COLOR_TYPE_CONTROLS }
								attribute="timelineAccentColorType"
								fullwidth={ false }
								isSmall={ true }
							/>
							<ColorPaletteControl
								label={
									props.attributes.timelineAccentColorType === 'gradient'
										? sprintf( _x( '%s #%d', 'option title', i18n ), __( 'Timeline Accent Color', i18n ), 1 )
										: __( 'Timeline Accent Color', i18n )
								}
								attribute="timelineAccentColor"
								hasTransparent={ true }
							/>
							{ props.attributes.timelineAccentColorType === 'gradient' &&
								<ColorPaletteControl
									label={ sprintf( _x( '%s #%d', 'option title', i18n ), __( 'Timeline Accent Color', i18n ), 2 ) }
									attribute="timelineAccentColor2"
									hasTransparent={ true }
								/>
							}
							<ColorPaletteControl
								label={ __( 'Timeline Background Color', i18n ) }
								attribute="timelineBackgroundColor"
								hasTransparent={ true }
							/>
						</PanelAdvancedSettings>
					</InspectorStyleControls>

					<Typography.InspectorControls
						{ ...props }
						hasTextTag={ false }
						isMultiline={ true }
						initialOpen={ true }
						hasTextShadow={ true }
					/>
					<InspectorLayoutControls>
						<ControlSeparator />
					</InspectorLayoutControls>
					<ContentAlign.InspectorControls />
					<BlockDiv.InspectorControls />
					<Advanced.InspectorControls />
					<Transform.InspectorControls />
					<EffectsAnimations.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-timeline" />
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
				<CustomCSS mainBlockClass="stk-block-timeline" />

				{ ! hasInnerBlocks && <GroupPlaceholder /> }
				<div
					className={ contentClassNames }
					data-align={ ! props.attributes.contentAlign ? undefined // Only needed in the backend
						: props.attributes.contentAlign === 'alignwide' ? 'wide'
							: props.attributes.contentAlign === 'alignfull' ? 'full' : undefined }
				>
					<Typography
						tagName="div"
						className="stk-block-timeline__date"
						placeholder={ _x( 'Text for This Block', 'Text placeholder', i18n ) }
					/>
					<div className="stk-block-timeline__middle"></div>
					<div className="stk-block-timeline__content">
						<InnerBlocks
							template={ TEMPLATE }
							allowedBlocks={ ALLOWED_INNER_BLOCKS }
							renderAppender={ false }
							templateLock="all"
						/>
					</div>
				</div>
				{ /* </Separator> */ }
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
