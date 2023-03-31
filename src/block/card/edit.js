/**
 * Internal dependencies
 */
import { CardStyles } from './style'
import variations from './variations'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION } from 'stackable'
import { last } from 'lodash'
import {
	InspectorBottomTip,
	InspectorStyleControls,
	InspectorTabs,
} from '~stackable/components'
import {
	useBlockContext, useBlockStyle, useDeviceType,
} from '~stackable/hooks'
import {
	withBlockAttributeContext,
	withBlockWrapperIsHovered,
	withQueryLoopContext,
} from '~stackable/higher-order'
import {
	BlockDiv,
	useGeneratedCss,
	Image,
	getAlignmentClasses,
	Alignment,
	Advanced,
	CustomCSS,
	Responsive,
	ContainerDiv,
	CustomAttributes,
	EffectsAnimations,
	BlockLink,
	ConditionalDisplay,
	Transform,
	MarginBottom,
	getBlockOrientation,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'

const TEMPLATE = variations[ 0 ].innerBlocks

const widthUnit = [ 'px' ]
const heightUnit = [ 'px' ]

const Edit = props => {
	const {
		hasInnerBlocks, innerBlocks,
	} = useBlockContext()

	const {
		hasContainer,
	} = props.attributes

	useGeneratedCss( props.attributes )

	const {
		clientId,
		className, //isHovered,
		isSelected,
	} = props

	const blockOrientation = getBlockOrientation( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockStyle = useBlockStyle( variations )

	const blockClassNames = classnames( [
		className,
		'stk-block-card',
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		'stk--no-padding',
	] )

	const innerClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-block-card__content',
	], {
		'stk-container-padding': hasContainer,
	} )

	const lastBlockName = last( innerBlocks )?.name
	const renderAppender = hasInnerBlocks ? ( [ 'stackable/text', 'core/paragraph' ].includes( lastBlockName ) ? () => <></> : InnerBlocks.DefaultBlockAppender ) : InnerBlocks.ButtonBlockAppender

	let hasHeight = [ 'default', 'default-2' ].includes( blockStyle )
	const deviceType = useDeviceType()
	// In horizontal layout, show height if in mobile view.
	if ( blockStyle === 'horizontal' && deviceType === 'Mobile' ) {
		hasHeight = true
	}

	return (
		<>
			{ isSelected && (
				<>
					<InspectorTabs />

					<Alignment.InspectorControls hasBlockAlignment={ true } />
					<BlockDiv.InspectorControls />
					<Advanced.InspectorControls />
					<Transform.InspectorControls />
					<BlockLink.InspectorControls />
					<Image.InspectorControls
						{ ...props }
						hasWidth={ blockStyle === 'horizontal' }
						hasHeight={ hasHeight }
						widthUnits={ widthUnit }
						heightUnits={ heightUnit }
						hasBorderRadius={ false }
						hasShape={ false }
						hasShadow={ false }
					/>
					<ContainerDiv.InspectorControls sizeSelector=".stk-block-card__content" />
					<EffectsAnimations.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-card" />
					<Responsive.InspectorControls />
					<ConditionalDisplay.InspectorControls />

					<InspectorStyleControls>
						<InspectorBottomTip />
					</InspectorStyleControls>
				</>
			) }

			<CardStyles
				version={ VERSION }
				blockState={ props.blockState }
				clientId={ clientId }
			/>
			<CustomCSS mainBlockClass="stk-block-card" />

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
				enableVariationPicker={ true }
			>
				<ContainerDiv className={ contentClassNames }>
					<Image
						showTooltips={ props.isHovered }
						className="stk-block-card__image"
						enableWidth={ blockStyle === 'horizontal' }
						enableHeight={ hasHeight }
						enableDiagonal={ false }
						widthUnits={ widthUnit }
						heightUnits={ heightUnit }
						defaultWidth={ 250 }
						width={ blockStyle !== 'horizontal' ? 100 : undefined }
						widthUnit={ blockStyle !== 'horizontal' ? '%' : 'px' }
						height={ blockStyle !== 'horizontal' ? undefined : 100 }
						heightUnit={ blockStyle !== 'horizontal' ? 'px' : '%' }
						hasTooltip={ ! [ 'full', 'faded' ].includes( blockStyle ) }
					/>
					<div className={ innerClassNames }>
						<InnerBlocks
							template={ TEMPLATE }
							orientation={ blockOrientation }
							renderAppender={ renderAppender }
						/>
					</div>
				</ContainerDiv>
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
