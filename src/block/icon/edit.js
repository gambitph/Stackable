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
	Link,
	Transform,
} from '~stackable/block-components'
import {
	getUniqueBlockClass,
} from '~stackable/util'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { useBlockProps } from '@wordpress/block-editor'

const Edit = props => {
	const { className, attributes } = props

	const blockAlignmentClass = getAlignmentClasses( attributes )
	const blockHoverClass = useBlockHoverClass()

	const blockClassNames = classnames( [
		className,
		'stk-block-icon',
		blockAlignmentClass,
	] )

	const wrapperClassNames = classnames( [
		getUniqueBlockClass( attributes.uniqueId ),
		blockHoverClass,
	] )

	return (
		<Fragment>
			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />

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
			<Link.InspectorControls />
			<Icon.InspectorControls initialOpen={ true } hasMultiColor={ true } />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-icon" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<div { ...useBlockProps( { className: wrapperClassNames } ) }>
				<IconStyles version={ VERSION } />
				<CustomCSS mainBlockClass="stk-block-icon" />
				<BlockDiv className={ blockClassNames } withUniqueClass={ false }>
					<Link linkTrigger=".stk--inner-svg">
						<Icon />
					</Link>
				</BlockDiv>
				<MarginBottom />
			</div>
		</Fragment>
	)
}

export default Edit
