/**
 * Internal dependencies
 */
import { SubtitleStyles } from './style'

/**
 * External dependencies
k*/
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
import { InspectorTabs } from '~stackable/components'
import {
	withBlockAttributeContext,
	withBlockWrapper,
	withQueryLoopContext,
} from '~stackable/higher-order'
import { createBlockCompleter } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { createBlock } from '@wordpress/blocks'
import { addFilter } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'

/**
 * Add `autocompleters` support for stackable/subtitle
 *
 * @see ~stackable/util/blocks#createBlockCompleter
 */
addFilter( 'editor.Autocomplete.completers', 'stackable/subtitle', ( filteredCompleters, name ) => {
	if ( name === 'stackable/subtitle' ) {
		return [ ...filteredCompleters, createBlockCompleter() ]
	}
	return filteredCompleters
} )

const Edit = props => {
	const {
		className,
		onReplace,
		onRemove,
		mergeBlocks,
	} = props

	useGeneratedCss( props.attributes )

	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-subtitle',
	] )

	const textClassNames = classnames( [
		'stk-block-subtitle__text',
		'stk-subtitle',
		textClasses,
		blockAlignmentClass,
	] )

	return (
		<>

			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<Typography.InspectorControls
				hasTextTag={ false }
				isMultiline={ false }
				initialOpen={ true }
				hasTextShadow={ true }
			/>
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-subtitle" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<SubtitleStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-subtitle" />

			<BlockDiv className={ blockClassNames }>
				<Typography
					tagName="p"
					className={ textClassNames }
					placeholder={ __( 'Type / to choose a block', i18n ) }
					onMerge={ mergeBlocks }
					onRemove={ onRemove }
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

						const block = createBlock( 'stackable/subtitle', newAttributes )

						if ( isOriginal ) {
							block.clientId = props.clientId
						}

						return block
					} }
				/>
			</BlockDiv>
			<MarginBottom />
		</>
	)
}

export default compose(
	withBlockWrapper,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
