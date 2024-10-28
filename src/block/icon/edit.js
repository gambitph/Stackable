/** Internal dependencies
 */
import blockStyles from './style'
/**
 * External dependencies
 */
import classnames from 'classnames'
import { omit } from 'lodash'
import { version as VERSION, i18n } from 'stackable'
import {
	InspectorTabs,
	InspectorAdvancedControls,
	PanelAdvancedSettings,
	AdvancedTextControl,
	useBlockCssGenerator,
} from '~stackable/components'
import {
	withBlockAttributeContext, withBlockWrapperIsHovered, withQueryLoopContext,
} from '~stackable/higher-order'
import {
	BlockDiv,
	Icon,
	getAlignmentClasses,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	MarginBottom,
	Link,
	Transform,
	Alignment,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { defaultIcon } from './schema'
import { memo } from '@wordpress/element'

const Edit = props => {
	const {
		className,
		attributes,
	} = props

	const blockAlignmentClass = getAlignmentClasses( attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-icon',
		blockAlignmentClass,
	] )

	const derivedIcon = applyFilters( 'stackable.block-component.icon.default', defaultIcon )

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
			<InspectorControls
				derivedIcon={ derivedIcon }
			/>

			{ blockCss && <style key="block-css">{ blockCss }</style> }
			<CustomCSS mainBlockClass="stk-block-icon" />
			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<Link linkTrigger=".stk--inner-svg">
					<Icon defaultValue={ defaultIcon } />
				</Link>
			</BlockDiv>
			{ props.isHovered && <MarginBottom /> }
		</>
	)
}

const InspectorControls = memo( props => {
	return (
		<>
			<InspectorTabs />

			<Alignment.InspectorControls />
			<Icon.InspectorControls initialOpen={ true } hasMultiColor={ true } defaultValue={ props.derivedIcon } />
			<BlockDiv.InspectorControls />
			<Link.InspectorControls hasToggle={ true } isAdvancedTab={ true } />

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

			<Advanced.InspectorControls />
			<Transform.InspectorControls />

			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-icon" />
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

// When saving block styles, don't save the icons used by the block.
//
// We need to prevent this because the saved default icon also gets applied to
// other blocks such as the blockquote block and the accordion block.
//
// TODO: if we can ensure that the icon block's default icon doesn't get applied
// to those other blocks, then we can remove this.
addFilter( 'stackable.icon.design.filtered-block-attributes', 'stackable/table-of-contents', attributes => {
	return omit( attributes, [ 'icon', 'icon2' ] )
} )
