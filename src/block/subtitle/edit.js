/**
 * Internal dependencies
 */
import blockStyles from './style'

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
	Transform,
} from '~stackable/block-components'
import { version as VERSION, i18n } from 'stackable'
import classnames from 'classnames'
import { InspectorTabs, useBlockCssGenerator } from '~stackable/components'
import {
	withBlockAttributeContext,
	withBlockWrapperIsHovered,
	withQueryLoopContext,
} from '~stackable/higher-order'
import { createBlockCompleter } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { addFilter } from '@wordpress/hooks'
import { sprintf, __ } from '@wordpress/i18n'
import { memo } from '@wordpress/element'

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
			<InspectorControls blockState={ props.blockState } />

			{ blockCss && <style key="block-css">{ blockCss }</style> }
			<CustomCSS mainBlockClass="stk-block-subtitle" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<Typography
					tagName="p"
					className={ textClassNames }
					placeholder={ __( 'Type / to choose a block', i18n ) }
					onMerge={ mergeBlocks }
					onRemove={ onRemove }
					onReplace={ onReplace }
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

			<Typography.InspectorControls
				{ ...props }
				hasTextTag={ false }
				isMultiline={ false }
				initialOpen={ true }
				hasTextShadow={ true }
			/>

			<Alignment.InspectorControls labelContentAlign={ sprintf( __( '%s Alignment', i18n ), __( 'Text', i18n ) ) } />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-subtitle" />
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
