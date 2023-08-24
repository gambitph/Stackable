/**
 * Internal dependencies
 */
import BlockStyles from './style'

/**
 * External dependencies
 */
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import {
	ColumnInnerBlocks,
	ControlSeparator,
	GroupPlaceholder,
	InspectorLayoutControls,
	InspectorTabs,
} from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	MarginBottom,
	getRowClasses,
	Alignment,
	getAlignmentClasses,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	ConditionalDisplay,
	Separator,
	getSeparatorClasses,
	Transform,
	ContentAlign,
	getContentAlignmentClasses,
	Columns,
} from '~stackable/block-components'
import { useBlockContext } from '~stackable/hooks'
import {
	withBlockAttributeContext,
	withBlockWrapperIsHovered,
	withQueryLoopContext,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data'
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import { useState, useEffect } from '@wordpress/element'

const ALLOWED_INNER_BLOCKS = [ 'stackable/column' ]

const Edit = props => {
	const {
		className,
		clientId,
		isSelected,
	} = props

	useGeneratedCss( props.attributes )

	const rowClass = getRowClasses( props.attributes )
	const separatorClass = getSeparatorClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const {
		hasInnerBlocks, numInnerBlocks, innerBlocks,
	} = useBlockContext()
	const [ columnProviderValue, columnTooltipClass ] = ColumnInnerBlocks.useContext()
	const [ numInnerColumns, setNumInnerColumns ] = useState( null )
	const [ hasRemoved, setHasRemoved ] = useState( false )

	const blockClassNames = classnames( [
		className,
		'stk-block-columns',
		rowClass,
		separatorClass,
		columnTooltipClass,
	] )

	useEffect( () => {
		setNumInnerColumns( numInnerBlocks )
	}, [] )

	useEffect( () => {
		if ( numInnerBlocks < numInnerColumns ) {
			setHasRemoved( true )
		}

		if ( numInnerBlocks === 1 && hasRemoved ) {
			const removedAttributes = {
				columnAdjacentCount: undefined,
				columnWidthTablet: undefined,
				columnWidthMobile: undefined,
				columnAdjacentCountTablet: undefined,
				columnAdjacentCountMobile: undefined,
			}
			dispatch( 'core/block-editor' ).updateBlockAttributes( innerBlocks[ 0 ].clientId, removedAttributes )
			setHasRemoved( false )
		}

		setNumInnerColumns( numInnerBlocks )
	}, [ numInnerBlocks, hasRemoved ] )

	const contentClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-content',
	], getContentAlignmentClasses( props.attributes ) )

	return (
		<>
			{ isSelected && (
				<>
					<InspectorTabs />

					<Columns.InspectorControls />
					<InspectorLayoutControls>
						<ControlSeparator />
					</InspectorLayoutControls>
					<ContentAlign.InspectorControls />
					<Alignment.InspectorControls
						hasContainerSize={ true }
						containerSizePriority={ 1 }
						hasContainerHeight={ false }
						hasColumnJustify={ true }
						hasRowAlignment={ true }
					/>
					<BlockDiv.InspectorControls />
					<Separator.InspectorControls />
					<Advanced.InspectorControls />
					<Transform.InspectorControls />
					<EffectsAnimations.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-columns" />
					<Responsive.InspectorControls />
					<ConditionalDisplay.InspectorControls />
				</>
			) }

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
				enableVariationPicker={ true }
			>
				<BlockStyles
					version={ VERSION }
					blockState={ props.blockState }
					clientId={ clientId }
				/>
				<CustomCSS mainBlockClass="stk-block-columns" />

				{ ! hasInnerBlocks && <GroupPlaceholder /> }
				<Separator>
					<div
						className={ contentClassNames }
						data-align={ ! props.attributes.contentAlign ? undefined // Only needed in the backend
							: props.attributes.contentAlign === 'alignwide' ? 'wide'
								: props.attributes.contentAlign === 'alignfull' ? 'full' : undefined }
					>
						<ColumnInnerBlocks
							providerValue={ columnProviderValue }
							orientation="horizontal"
							allowedBlocks={ ALLOWED_INNER_BLOCKS }
							renderAppender={ false }
							templateLock={ props.attributes.templateLock || false }
						/>
					</div>
				</Separator>
			</BlockDiv>
			{ props.isHovered && hasInnerBlocks && <MarginBottom /> }
		</>
	)
}

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
