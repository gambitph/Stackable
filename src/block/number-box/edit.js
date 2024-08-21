/**
 * Internal dependencies
 */
import { HeadingStyles } from './style'

/**
 * External dependencies
 */
import {
	BlockDiv,
	useGeneratedCss,
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
import {
	withBlockAttributeContext, withBlockWrapperIsHovered, withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { memo } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

const Edit = props => {
	const {
		clientId,
		className,
		attributes,
		setAttributes,
	} = props

	useGeneratedCss( props.attributes )

	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockClassNames = classnames( [
		className,
		'stk-block-number-box',
		blockAlignmentClass,
	], {
		'stk--has-shape': props.attributes.hasShape,
	} )

	const textClassNames = classnames( [
		'stk-block-number-box__text',
		textClasses,
	] )

	return (
		<>

			<InspectorControls
				setAttributes={ setAttributes }
				blockState={ props.blockState }
				hasShape={ attributes.hasShape }
			/>

			<HeadingStyles
				version={ VERSION }
				blockState={ props.blockState }
				clientId={ clientId }
			/>
			<CustomCSS mainBlockClass="stk-block-number-box" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<Typography
					tagName="div"
					placeholder="1"
					className={ textClassNames }
				/>
			</BlockDiv>
			{ props.isHovered && <MarginBottom /> }
		</>
	)
}

const InspectorControls = memo( props => {
	return (
		<>
			<InspectorTabs />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Shape', i18n ) }
					id="shape"
					initialOpen={ true }
					hasToggle={ true }
					checked={ props.hasShape }
					onChange={ hasShape => props.setAttributes( { hasShape } ) }
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
			<Typography.InspectorControls
				{ ...props }
				initialOpen={ false }
				hasTextTag={ false }
				sizePlaceholder="56"
			/>

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-number-box" />
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
