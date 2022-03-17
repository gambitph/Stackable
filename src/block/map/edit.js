/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION } from 'stackable'
import { InspectorTabs } from '~stackable/components'
import { useBlockHoverClass, useBlockContext } from '~stackable/hooks'
import {
	BlockDiv,
	useGeneratedCss,
	Image,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	MarginBottom,
	Transform,
	getAlignmentClasses,
	Link,
} from '~stackable/block-components'
import { withQueryLoopContext } from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import { SandBox, Disabled } from '@wordpress/components'
// import { useSelect } from '@wordpress/data'

const heightUnit = [ 'px', 'vh', '%' ]

const Edit = props => {
	const {
		clientId,
		className,
		isSelected,
	} = props

	useGeneratedCss( props.attributes )

	const styles = []
	// const styles = useSelect( select => {
	// 	// Default styles used to unset some of the styles
	// 	// that might be inherited from the editor style.
	// 	const defaultStyles = `
	// 		html,body,:root {
	// 			margin: 0 !important;
	// 			padding: 0 !important;
	// 			overflow: visible !important;
	// 			min-height: auto !important;
	// 		}
	// 	`

	// 	return [
	// 		defaultStyles,
	// 		...transformStyles( select( blockEditorStore ).getSettings().styles ),
	// 	]
	// }, [] )

	const blockHoverClass = useBlockHoverClass()
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const { parentBlock } = useBlockContext( clientId )

	// Allow special or layout blocks to disable the link for the image block,
	// e.g. image box doesn't need the image to have a link since it has it's
	// own link.
	const enableLink = applyFilters( 'stackable.edit.image.enable-link', true, parentBlock )

	const blockClassNames = classnames( [
		className,
		'stk-block-image',
		blockHoverClass,
		blockAlignmentClass,
	] )

	const content = `<iframe
				title="test"
				src="https://maps.google.com/maps?q=14.633600461871746, 121.04300214414138&t=&z=12&ie=UTF8&iwloc=&output=embed"
				className="stk-map"
				height="300"
				frameBorder="0"
				style="border:0;width: 100%; max-width: none;"
				allowFullScreen=""
				aria-hidden="false"
				tabIndex="0"
			></iframe>`

	return (
		<Fragment>
			<InspectorTabs />

			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<Image.InspectorControls
				initialOpen={ true }
				heightUnits={ heightUnit }
			/>
			{ enableLink && <Link.InspectorControls hasTitle={ true } /> }
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-image" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<BlockStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-image" />

			<BlockDiv className={ blockClassNames }>
				<SandBox
					html={ content }
					styles={ styles }
				/>
			</BlockDiv>
			<MarginBottom />
		</Fragment>
	)
}

export default withQueryLoopContext( Edit )
