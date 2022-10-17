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
	withBlockAttributeContext, withBlockWrapper, withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { useBlockHoverState } from '~stackable/hooks'

const Edit = props => {
	const {
		clientId,
		className,
	} = props

	useGeneratedCss( props.attributes )

	const [ blockState ] = useBlockHoverState()
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
		<Fragment>

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
			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<Typography.InspectorControls
				hasTextTag={ false }
				hasTextShadow={ true }
				initialOpen={ false }
			/>
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-count-up" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<HeadingStyles
				version={ VERSION }
				blockState={ blockState }
				clientId={ clientId }
			/>
			<CustomCSS mainBlockClass="stk-block-count-up" />

			<BlockDiv className={ blockClassNames }>
				<Typography
					tagName="div"
					placeholder={ __( '1,234.56', i18n ) }
					className={ textClassNames }
				/>
			</BlockDiv>
			<MarginBottom />
		</Fragment>
	)
}

export default compose(
	withBlockWrapper,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
