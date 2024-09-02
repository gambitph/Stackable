/**
 * Internal dependencies
 */
import blockStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION, i18n } from 'stackable'
import {
	InspectorTabs,
	InspectorStyleControls,
	PanelAdvancedSettings,
	Separator2,
	AdvancedRangeControl,
	AdvancedToggleControl,
	useBlockCssGenerator,
} from '~stackable/components'
import {
	withBlockAttributeContext, withBlockWrapperIsHovered, withQueryLoopContext,
} from '~stackable/higher-order'
import {
	BlockDiv,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Separator,
	MarginBottom,
	Transform,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { useMemo, memo } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

const Edit = props => {
	const {
		className,
		attributes,
		setAttributes,
	} = props

	const {
		separatorDesign,
		separatorInverted,
	} = attributes

	const attributesToPass = {
		separatorLayer2Show: attributes.separatorLayer2Show,
		separatorLayer3Show: attributes.separatorLayer3Show,
	}
	const blockClassNames = classnames( [
		className,
		'stk-block-separator',
		'stk--no-padding',
	] )

	const separatorClassNames = classnames( [
		'stk-block-separator__inner',
	] )

	// Generate the CSS styles for the block.
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
			<InspectorControls attributes={ attributesToPass } setAttributes={ setAttributes } />

			{ blockCss && <style key="block-css">{ blockCss }</style> }
			<CustomCSS mainBlockClass="stk-block-separator" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<div className={ separatorClassNames }>
					<Separator2
						design={ separatorDesign }
						inverted={ separatorInverted }
					/>
					{ applyFilters( 'stackable.block.separator.edit.output.layers', null, props ) }
				</div>
			</BlockDiv>
			{ props.isHovered && <MarginBottom /> }
		</>
	)
}

const InspectorControls = memo( props => {
	const PremiumSeparatorControls = useMemo( () => applyFilters( 'stackable.block.separator.edit.after', null ), [] )
	return (
		<>
			<InspectorTabs hasLayoutPanel={ false } />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					id="general"
					initialOpen={ true }
				>
					<AdvancedRangeControl
						label={ __( 'Height', i18n ) }
						min={ 30 }
						sliderMax={ 400 }
						placeholder=""
						attribute="separatorHeight"
						responsive="all"
					/>
					<AdvancedToggleControl
						label={ __( 'Flip Horizontally', i18n ) }
						attribute="separatorFlipHorizontally"
					/>
					<AdvancedToggleControl
						label={ __( 'Flip Vertically', i18n ) }
						attribute="separatorFlipVertically"
					/>
				</PanelAdvancedSettings>
				<PanelAdvancedSettings
					title={ __( 'Separator', i18n ) }
					id="separator"
				>
					<Separator.InspectorControls.SeparatorControls hasFlipVertically={ true } />
				</PanelAdvancedSettings>
				{ PremiumSeparatorControls && <PremiumSeparatorControls { ...props } /> }
			</InspectorStyleControls>

			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-separator" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />
		</> )
} )

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
