/**
 * Internal dependencies
 */
import { SeparatorStyles } from './style'

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
} from '~stackable/components'
import {
	withBlockAttributeContext, withBlockWrapperIsHovered, withQueryLoopContext,
} from '~stackable/higher-order'
import {
	BlockDiv,
	useGeneratedCss,
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
import { useMemo } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

const Edit = props => {
	const {
		clientId,
		className,
		attributes,
		isSelected,
	} = props

	useGeneratedCss( props.attributes )

	const PremiumSeparatorControls = useMemo( () => applyFilters( 'stackable.block.separator.edit.after', null ), [] )

	const {
		separatorDesign,
		separatorInverted,
	} = attributes

	const blockClassNames = classnames( [
		className,
		'stk-block-separator',
		'stk--no-padding',
	] )

	const separatorClassNames = classnames( [
		'stk-block-separator__inner',
	] )

	return (
		<>
			{ isSelected && (
				<>
					<InspectorTabs />

					<BlockDiv.InspectorControls />

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

					<Advanced.InspectorControls />
					<Transform.InspectorControls />
					<EffectsAnimations.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-separator" />
					<Responsive.InspectorControls />
					<ConditionalDisplay.InspectorControls />
				</>
			) }

			<SeparatorStyles
				version={ VERSION }
				blockState={ props.blockState }
				clientId={ clientId }
			/>
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

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
