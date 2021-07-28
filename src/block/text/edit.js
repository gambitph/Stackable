/**
 * Internal dependencies
 */
import { TextStyles } from './style'

/**
 * External dependencies
k*/
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
} from '~stackable/block-components'
import { version as VERSION, i18n } from 'stackable'
import classnames from 'classnames'
import {
	InspectorTabs, InspectorStyleControls, PanelAdvancedSettings, AdvancedRangeControl,
} from '~stackable/components'
import { useBlockHoverClass } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { createBlock } from '@wordpress/blocks'
import { __ } from '@wordpress/i18n'

const Edit = props => {
	const {
		className,
		onReplace,
	} = props

	const blockHoverClass = useBlockHoverClass()
	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-text',
		blockHoverClass,
	] )

	const textClassNames = classnames( [
		'stk-text__text',
		textClasses,
		blockAlignmentClass,
	] )

	return (
		<Fragment>

			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					initialOpen={ true }
					id="general"
				>
					<AdvancedRangeControl
						label={ __( 'Columns', i18n ) }
						allowReset={ true }
						attribute="columns"
						min="1"
						sliderMax="3"
						step="1"
						placeholder="1"
						responsive="all"
					/>

					<AdvancedRangeControl
						label={ __( 'Column Gap', i18n ) }
						allowRest={ true }
						attribute="columnGap"
						min="0"
						sliderMax="50"
						responsive="all"
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<Typography.InspectorControls
				hasTextTag={ false }
				isMultiline={ true }
				initialOpen={ false }
			/>
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-text" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<TextStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-text__text" />

			<BlockDiv className={ blockClassNames }>
				<Typography
					tagName="p"
					className={ textClassNames }
					onReplace={ onReplace }
					onSplit={ ( value, isOriginal ) => {
						// @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/paragraph/edit.js
						let newAttributes

						if ( isOriginal || value ) {
							newAttributes = {
								...props.attributes,
								text: value,
							}
						}

						const block = createBlock( 'stackable/text', newAttributes )

						if ( isOriginal ) {
							block.clientId = props.clientId
						}

						return block
					} }
				/>
			</BlockDiv>
			<MarginBottom />
		</Fragment>
	)
}

export default Edit
