/**
 * Internal dependencies
 */
import { DividerStyles } from './style'
import { blockStyles } from './block-styles'

/**
 * External dependencies
k*/
import {
	BlockStyle,
	BlockDiv,
	useGeneratedCss,
	CustomCSS,
	Responsive,
	Advanced,
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
	InspectorTabs,
	InspectorStyleControls,
	PanelAdvancedSettings,
	AdvancedRangeControl,
	ColorPaletteControl,
} from '~stackable/components'
import { useBlockStyle } from '~stackable/hooks'
import {
	withBlockAttributeContext, withBlockWrapperIsHovered, withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'

const Edit = props => {
	const {
		clientId,
		className,
		isSelected,
	} = props

	useGeneratedCss( props.attributes )

	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockStyle = useBlockStyle( blockStyles )

	const blockClassNames = classnames( [
		className,
		'stk-block-divider',
		blockAlignmentClass,
	] )

	return (
		<>
			{ isSelected && (
				<>
					<InspectorTabs />

					<Alignment.InspectorControls />
					<BlockDiv.InspectorControls />

					<BlockStyle.InspectorControls styles={ blockStyles } />
					<InspectorStyleControls>
						<PanelAdvancedSettings
							title={ __( 'General', i18n ) }
							id="general"
						>
							<ColorPaletteControl
								label={ __( 'Color', i18n ) }
								attribute="color"
							/>
							<AdvancedRangeControl
								label={ __( 'Height / Size', i18n ) }
								responsive="all"
								attribute="height"
								min={ 1 }
								sliderMax={ 100 }
								placeholder=""
							/>
							<AdvancedRangeControl
								label={ __( 'Width', i18n ) + ' (%)' }
								responsive="all"
								attribute="width"
								min={ 1 }
								max={ 100 }
								placeholder=""
							/>
						</PanelAdvancedSettings>
					</InspectorStyleControls>

					<Advanced.InspectorControls />
					<Transform.InspectorControls />
					<EffectsAnimations.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-divider" />
					<Responsive.InspectorControls />
					<ConditionalDisplay.InspectorControls />
				</>
			) }

			<DividerStyles
				version={ VERSION }
				blockState={ props.blockState }
				clientId={ clientId }
			/>
			<CustomCSS mainBlockClass="stk-block-divider" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				{ [ 'dots', 'asterisks' ].includes( blockStyle ) ? (
					<div className="stk-block-divider__dots" aria-hidden="true">
						<div className="stk-block-divider__dot" />
						<div className="stk-block-divider__dot" />
						<div className="stk-block-divider__dot" />
					</div>
				) : <hr className="stk-block-divider__hr" /> }
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
