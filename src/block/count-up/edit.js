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
	Transform,
} from '~stackable/block-components'
import { version as VERSION, i18n } from 'stackable'
import classnames from 'classnames'
import {
	InspectorTabs, InspectorStyleControls, PanelAdvancedSettings, AdvancedRangeControl,
} from '~stackable/components'
import {
	withBlockAttributeContext, withBlockWrapperIsHovered, withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import { memo }	from '@wordpress/element'

const Edit = props => {
	const {
		clientId,
		className,
	} = props

	useGeneratedCss( props.attributes )

	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockClassNames = classnames( [
		className,
		'stk-block-count-up',
	] )

	const textClassNames = classnames( [
		'stk-block-count-up__text',
		textClasses,
		blockAlignmentClass,
	] )

	return (
		<>

			<InspectorControls blockState={ props.blockState } />
			<HeadingStyles
				version={ VERSION }
				blockState={ props.blockState }
				clientId={ clientId }
			/>
			<CustomCSS mainBlockClass="stk-block-count-up" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<Typography
					tagName="div"
					placeholder={ __( '1,234.56', i18n ) }
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
					title={ __( 'Counter', i18n ) }
					id="count-up"
					initialOpen={ true }
				>
					<AdvancedRangeControl
						label={ __( 'Duration (ms)', i18n ) }
						attribute="duration"
						min={ 100 }
						sliderMax={ 5000 }
						step={ 100 }
						placeholder="1000"
					>

					</AdvancedRangeControl>
				</PanelAdvancedSettings>
			</InspectorStyleControls>
			<Typography.InspectorControls
				{ ...props }
				hasTextTag={ false }
				hasTextShadow={ true }
				initialOpen={ false }
			/>
			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-count-up" />
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
