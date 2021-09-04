/**
 * Internal dependencies
 */
import { IconStyles } from './style'
/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION, i18n } from 'stackable'
import {
	InspectorTabs, InspectorAdvancedControls, PanelAdvancedSettings, AdvancedTextControl,
} from '~stackable/components'
import {
	useBlockHoverClass,
} from '~stackable/hooks'
import {
	BlockDiv,
	Icon,
	getAlignmentClasses,
	Alignment,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	MarginBottom,
	BlockLink,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

const Edit = props => {
	const { className, attributes } = props

	const blockAlignmentClass = getAlignmentClasses( attributes )
	const blockHoverClass = useBlockHoverClass()

	const blockClassNames = classnames( [
		className,
		'stk-block-icon',
		blockHoverClass,
		blockAlignmentClass,
	] )

	return (
		<Fragment>
			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<BlockLink.InspectorControls />
			<Advanced.InspectorControls />

			<InspectorAdvancedControls>
				<PanelAdvancedSettings
					title={ __( 'Accessibility', i18n ) }
					id="accessibility"
				>
					<AdvancedTextControl
						isDynamic={ false }
						label={ __( 'Icon Label', i18n ) }
						attribute="ariaLabel"
					/>
				</PanelAdvancedSettings>
			</InspectorAdvancedControls>

			<EffectsAnimations.InspectorControls />
			<Icon.InspectorControls initialOpen={ true } hasMultiColor={ true } />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-icon" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<IconStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-icon" />
			<BlockDiv className={ blockClassNames }>
				<Icon />
			</BlockDiv>
			<MarginBottom />
		</Fragment>
	)
}

export default Edit
