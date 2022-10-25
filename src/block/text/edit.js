/**
 * Internal dependencies
 */
import { TextStyles } from './style'

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
	InspectorTabs,
	InspectorStyleControls,
	PanelAdvancedSettings,
	AdvancedRangeControl,
} from '~stackable/components'
import { useBlockContext } from '~stackable/hooks'
import {
	withBlockAttributeContext,
	withBlockWrapper,
	withQueryLoopContext,
} from '~stackable/higher-order'
import { createBlockCompleter } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks'
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { compose } from '@wordpress/compose'

/**
 * Add `autocompleters` support for stackable/text
 *
 * @see ~stackable/util/blocks#createBlockCompleter
 */
addFilter( 'editor.Autocomplete.completers', 'stackable/text', ( filteredCompleters, name ) => {
	if ( name === 'stackable/text' ) {
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
		attributes,
		clientId,
	} = props

	useGeneratedCss( props.attributes )

	const textClasses = getTypographyClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const {
		parentBlock, isFirstBlock, isLastBlock,
	} = useBlockContext()

	const enableColumns = applyFilters( 'stackable.text.edit.enable-column', true, parentBlock )

	const blockClassNames = classnames( [
		className,
		'stk-block-text',
	] )

	const textClassNames = classnames( [
		'stk-block-text__text',
		textClasses,
		blockAlignmentClass,
	] )

	const placeholder = applyFilters( 'stackable.text.edit.placeholder', __( 'Type / to choose a block', i18n ), {
		parentBlock, isFirstBlock, isLastBlock,
	} )

	const onSplit = ( value, isOriginal ) => {
		// @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/paragraph/edit.js
		let newAttributes

		if ( isOriginal || value ) {
			newAttributes = {
				...attributes,
				text: value,
			}
		}

		const block = createBlock( 'stackable/text', newAttributes )

		if ( isOriginal ) {
			block.clientId = props.clientId
		}

		return block
	}

	return (
		<>

			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />

			{ enableColumns &&
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
							allowReset={ true }
							attribute="columnGap"
							min="0"
							sliderMax="50"
							responsive="all"
						/>
					</PanelAdvancedSettings>
				</InspectorStyleControls>
			}

			<Typography.InspectorControls
				{ ...props }
				hasTextTag={ false }
				isMultiline={ true }
				initialOpen={ ! enableColumns }
				hasTextShadow={ true }
			/>
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-text" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<TextStyles
				version={ VERSION }
				blockState={ props.blockState }
				clientId={ clientId }
			/>
			<CustomCSS mainBlockClass="stk-block-text" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<Typography
					tagName={ props.attributes.innerTextTag || 'p' }
					className={ textClassNames }
					placeholder={ placeholder }
					onMerge={ mergeBlocks }
					onRemove={ onRemove }
					onReplace={ onReplace }
					onSplit={ onSplit }
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
