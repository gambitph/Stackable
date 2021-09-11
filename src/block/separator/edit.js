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
	useBlockHoverClass,
} from '~stackable/hooks'
import {
	BlockDiv,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Separator,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

const Edit = props => {
	const {
		className,
		attributes,
	} = props

	const {
		separatorDesign,
		separatorInverted,
	} = attributes

	const blockHoverClass = useBlockHoverClass()

	const blockClassNames = classnames( [
		className,
		'stk-block-separator',
		blockHoverClass,
		'stk--no-padding',
	] )

	const separatorClassNames = classnames( [
		'stk-block-separator__inner',
	] )

	return (
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
				{ applyFilters( 'stackable.block.separator.edit.after', null, props ) }
			</InspectorStyleControls>

			<Advanced.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-separator" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<SeparatorStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-separator" />

			<BlockDiv className={ blockClassNames }>
				<div className={ separatorClassNames }>
					<Separator2
						design={ separatorDesign }
						inverted={ separatorInverted }
					/>
					{ applyFilters( 'stackable.block.separator.edit.output.layers', null, props ) }
				</div>
			</BlockDiv>
		</>
	)
}

export default Edit
