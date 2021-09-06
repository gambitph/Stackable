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
	BorderControls,
	BackgroundControls,
	Transform,
} from '~stackable/block-components'
import { version as VERSION, i18n } from 'stackable'
import classnames from 'classnames'
import {
	AdvancedRangeControl,
	InspectorStyleControls,
	InspectorTabs,
	PanelAdvancedSettings,
} from '~stackable/components'
import { useBlockHoverClass } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { useDispatch } from '@wordpress/data'
import { __ } from '@wordpress/i18n'

const Edit = props => {
	const {
		clientId,
		className,
		attributes,
	} = props

	const blockHoverClass = useBlockHoverClass()
	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const blockClassNames = classnames( [
		className,
		'stk-block-number-box',
		blockHoverClass,
		blockAlignmentClass,
	], {
		'stk--has-shape': props.attributes.hasShape,
	} )

	const textClassNames = classnames( [
		'stk-block-number-box__text',
		textClasses,
	] )

	return (
		<Fragment>

			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-number-box" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Shape', i18n ) }
					id="shape"
					initialOpen={ true }
					checked={ attributes.hasShape }
					onChange={ hasShape => updateBlockAttributes( clientId, { hasShape } ) }
				>
					<AdvancedRangeControl
						label={ __( 'Size', i18n ) }
						attribute="shapeSize"
						responsive="all"
						min="0"
						sliderMax="200"
						placeholder="96"
					/>
					<BackgroundControls
						attrNameTemplate="shape%s"
						hasGradient={ false }
						hasBackgroundImage={ false }
						hasBackgroundGradientBlendMode={ false }
					/>
					<BorderControls
						attrNameTemplate="shape%s"
						borderSliderMax="100"
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>
			<Typography.InspectorControls hasTextTag={ false } sizePlaceholder="56" />

			<HeadingStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-number-box" />

			<BlockDiv className={ blockClassNames }>
				<Typography
					tagName="div"
					placeholder="1"
					className={ textClassNames }
				/>
			</BlockDiv>
			<MarginBottom />
		</Fragment>
	)
}

export default Edit
