/**
 * Internal dependencies
 */
import blockStyles from './style'

/**
 * External dependencies
 */
import {
	BlockDiv,
	CustomCSS,
	Responsive,
	Advanced,
	Typography,
	getTypographyClasses,
	getAlignmentClasses,
	Alignment,
	MarginBottom,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Transform,
	useUniqueId,
} from '~stackable/block-components'
import { version as VERSION, i18n } from 'stackable'
import classnames from 'classnames'
import { kebabCase } from 'lodash'
import {
	InspectorTabs,
	InspectorStyleControls,
	PanelAdvancedSettings,
	ColorPaletteControl,
	AdvancedRangeControl,
	AlignButtonsControl,
	useBlockCssGenerator,
} from '~stackable/components'
import { createBlockCompleter } from '~stackable/util'
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
	useEffect, useState, useRef, memo,
} from '@wordpress/element'
import { sprintf, __ } from '@wordpress/i18n'
import { dispatch, useSelect } from '@wordpress/data'
import { addFilter, applyFilters } from '@wordpress/hooks'

/**
 * Add `autocompleters` support for stackable/heading
 *
 * @see ~stackable/util/blocks#createBlockCompleter
 */
addFilter( 'editor.Autocomplete.completers', 'stackable/heading', ( filteredCompleters, name ) => {
	if ( name === 'stackable/heading' ) {
		return [ ...filteredCompleters, createBlockCompleter() ]
	}
	return filteredCompleters
} )

const Edit = props => {
	const {
		className,
		onReplace,
		setAttributes,
		onRemove,
		mergeBlocks,
		attributes,
	} = props

	const { parentBlock } = useSelect( select => {
		const { getBlockRootClientId, getBlock } = select( 'core/block-editor' )
		const parentClientId = getBlockRootClientId( props.clientId )
		return {
			parentBlock: getBlock( parentClientId ),
		}
	}, [ props.clientId ] )
	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockClassNames = classnames( [
		className,
		'stk-block-heading',
		'stk-block-heading--v2',
	] )

	const textClassNames = classnames( [
		'stk-block-heading__text',
		textClasses,
		blockAlignmentClass,
	], {
		'stk-block-heading--use-theme-margins': attributes.useThemeTextMargins,
	} )

	useUniqueId( attributes, true )

	// Auto-generate anchors in Stackable headings.
	const [ prevText, setPrevText ] = useState( props.attributes.text )
	const updateTimeout = useRef( null )

	useEffect( () => {
		clearTimeout( updateTimeout.current )
		const anchor = props.attributes.anchor
		const text = props.attributes.text
		updateTimeout.current = setTimeout( () => {
			const cleanAnchorValue = kebabCase( anchor )
			if ( cleanAnchorValue === kebabCase( prevText ) || ! anchor ) {
				dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
				setAttributes( { anchor: kebabCase( text ) } )
			}
			setPrevText( text )
		}, 300 )
	}, [ props.attributes.anchor, props.attributes.text ] )

	const blockCss = useBlockCssGenerator( {
		attributes: props.attributes,
		blockStyles,
		clientId: props.clientId,
		context: props.context,
		setAttributes: props.setAttributes,
		blockState: props.blockState,
		version: VERSION,
	} )

	return (
		<>
			<InspectorControls
				showTopLine={ props.attributes.showTopLine }
				showBottomLine={ props.attributes.showBottomLine }
				setAttributes={ setAttributes }
				parentBlock={ parentBlock }
				blockState={ props.blockState }
			/>
			{ blockCss && <style key="block-css">{ blockCss }</style> }
			<CustomCSS mainBlockClass="stk-block-heading" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				{ props.attributes.showTopLine && <div className="stk-block-heading__top-line" /> }
				<Typography
					defaultTag="h2"
					placeholder={ __( 'Add heading text here', i18n ) }
					className={ textClassNames }
					onMerge={ mergeBlocks }
					onRemove={ onRemove }
					onReplace={ onReplace }
				/>
				{ props.attributes.showBottomLine && <div className="stk-block-heading__bottom-line" /> }
			</BlockDiv>
			{ props.isHovered && <MarginBottom /> }
		</>
	)
}

const InspectorControls = memo( props => {
	return (
		<>
			<InspectorTabs />

			<Typography.InspectorControls
				{ ...props }
				hasRemoveMargins={ true }
				initialOpen={ true }
				hasTextShadow={ true }
			/>

			<Alignment.InspectorControls labelContentAlign={ sprintf( __( '%s Alignment', i18n ), __( 'Text', i18n ) ) } />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />

			{ !! applyFilters( 'stackable.heading.edit.top-bottom-line.enable-handlers', true, props.parentBlock ) && (
				<InspectorStyleControls>
					<PanelAdvancedSettings
						title={ __( 'Top Line', i18n ) }
						id="top-line"
						hasToggle={ true }
						checked={ props.showTopLine }
						onChange={ value => props.setAttributes( { showTopLine: value } ) }
					>
						<ColorPaletteControl
							label={ __( 'Line Color', i18n ) }
							attribute="topLineColor"
							hover="all"
						/>

						<AdvancedRangeControl
							label={ __( 'Width', i18n ) }
							units={ [ 'px', '%', 'vw' ] }
							attribute="topLineWidth"
							min="0"
							sliderMax={ [ 200, 100 ] }
							hover="all"
						/>

						<AdvancedRangeControl
							label={ __( 'Height', i18n ) }
							attribute="topLineHeight"
							min="0"
							sliderMax="20"
							placeholder="4"
						/>

						<AdvancedRangeControl
							label={ __( 'Margin', i18n ) }
							attribute="topLineMargin"
							responsive="all"
							sliderMin="0"
							sliderMax="100"
						/>

						<AlignButtonsControl
							label={ __( 'Align', i18n ) }
							attribute="topLineAlign"
							responsive="all"
						/>

					</PanelAdvancedSettings>
					<PanelAdvancedSettings
						title={ __( 'Bottom Line', i18n ) }
						id="bottom-line"
						hasToggle={ true }
						checked={ props.showBottomLine }
						onChange={ value => props.setAttributes( { showBottomLine: value } ) }
					>

						<ColorPaletteControl
							label={ __( 'Line Color', i18n ) }
							attribute="bottomLineColor"
							hover="all"
						/>

						<AdvancedRangeControl
							label={ __( 'Width', i18n ) }
							units={ [ 'px', '%', 'vw' ] }
							attribute="bottomLineWidth"
							min={ 0 }
							sliderMax={ [ 200, 100 ] }
							hover="all"
						/>

						<AdvancedRangeControl
							label={ __( 'Height', i18n ) }
							attribute="bottomLineHeight"
							min="0"
							sliderMax="20"
							placeholder="4"
						/>

						<AdvancedRangeControl
							label={ __( 'Margin', i18n ) }
							attribute="bottomLineMargin"
							responsive="all"
							sliderMin="0"
							sliderMax="100"
						/>

						<AlignButtonsControl
							label={ __( 'Align', i18n ) }
							attribute="bottomLineAlign"
							responsive="all"
						/>

					</PanelAdvancedSettings>
				</InspectorStyleControls>
			) }

			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-heading" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />
		</>
	)
} )

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
