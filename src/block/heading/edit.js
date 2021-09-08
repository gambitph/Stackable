/**
 * Internal dependencies
 */
import { HeadingStyles } from './style'

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
} from '~stackable/block-components'
import { version as VERSION, i18n } from 'stackable'
import classnames from 'classnames'
import {
	InspectorTabs, InspectorStyleControls, PanelAdvancedSettings, ColorPaletteControl, AdvancedRangeControl, AlignButtonsControl,
} from '~stackable/components'
import { useBlockHoverClass } from '~stackable/hooks'
import { createBlockCompleter } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { createBlock } from '@wordpress/blocks'
import { addFilter } from '@wordpress/hooks'

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
		clientId,
		setAttributes,
		onRemove,
		mergeBlocks,
	} = props

	const blockHoverClass = useBlockHoverClass()
	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockClassNames = classnames( [
		className,
		'stk-block-heading',
		blockHoverClass,
	] )

	const textClassNames = classnames( [
		'stk-block-heading__text',
		textClasses,
		blockAlignmentClass,
	] )

	return (
		<Fragment>

			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />

			<Typography.InspectorControls hasRemoveMargins={ true } initialOpen={ true } />
			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Top Line', i18n ) }
					id="top-line"
					hasToggle={ true }
					checked={ props.attributes.showTopLine }
					onChange={ value => setAttributes( { showTopLine: value } ) }
				>
					<ColorPaletteControl
						label={ __( 'Line Color', i18n ) }
						attribute="topLineColor"
						hover="all"
					/>

					<AdvancedRangeControl
						label={ __( 'Width', i18n ) }
						units={ [ 'px', '%' ] }
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
					checked={ props.attributes.showBottomLine }
					onChange={ value => setAttributes( { showBottomLine: value } ) }
				>

					<ColorPaletteControl
						label={ __( 'Line Color', i18n ) }
						attribute="bottomLineColor"
						hover="all"
					/>

					<AdvancedRangeControl
						label={ __( 'Width', i18n ) }
						units={ [ 'px', '%' ] }
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

			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-heading" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<HeadingStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-heading" />

			<BlockDiv className={ blockClassNames }>
				{ props.attributes.showTopLine && <div className="stk-block-heading__top-line" /> }
				<Typography
					defaultTag="h2"
					placeholder={ __( 'Title for This Block', i18n ) }
					className={ textClassNames }
					onMerge={ mergeBlocks }
					onRemove={ onRemove }
					onReplace={ onReplace }
					onSplit={ ( value, isOriginal ) => {
						let block

						if ( isOriginal || value ) {
							block = createBlock( 'stackable/heading', {
								...props.attributes,
								text: value,
							} )
						} else {
							block = createBlock( 'stackable/text' )
						}

						if ( isOriginal ) {
							block.clientId = clientId
						}

						return block
					} }
				/>
				{ props.attributes.showBottomLine && <div className="stk-block-heading__bottom-line" /> }
			</BlockDiv>
			<MarginBottom />
		</Fragment>
	)
}

export default Edit
