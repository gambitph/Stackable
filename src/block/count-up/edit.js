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
import { useBlockHoverClass } from '~stackable/hooks'
import { withQueryLoopContext } from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

const Edit = props => {
	const {
		className,
	} = props

	useGeneratedCss( props.attributes )

	const blockHoverClass = useBlockHoverClass()
	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockClassNames = classnames( [
		className,
		'stk-block-count-up',
		blockHoverClass,
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
						max={ 10000 }
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

			<HeadingStyles version={ VERSION } />
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

export default withQueryLoopContext( Edit )
