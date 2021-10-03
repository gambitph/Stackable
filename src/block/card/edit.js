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
	InspectorTabs,
} from '~stackable/components'
import {
	useBlockContext, useBlockHoverClass, useBlockStyle,
} from '~stackable/hooks'
import {
	BlockDiv,
	Image,
	getAlignmentClasses,
	Alignment,
	useAlignment,
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
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import {
	Fragment, useMemo,
} from '@wordpress/element'

const TEMPLATE = variations[ 0 ].innerBlocks

const widthUnit = [ 'px' ]
const heightUnit = [ 'px' ]

const Edit = props => {
	const { hasInnerBlocks, innerBlocks } = useBlockContext()

	const {
		hasContainer,
	} = props.attributes

	const {
		className, //isHovered,
	} = props

	const { blockOrientation } = useAlignment()
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockStyle = useBlockStyle( variations )
	const blockHoverClass = useBlockHoverClass()

	const blockClassNames = classnames( [
		className,
		'stk-block-card',
		blockHoverClass,
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

	const renderAppender = useMemo( () => {
		return hasInnerBlocks ? ( [ 'stackable/text', 'core/paragraph' ].includes( last( innerBlocks )?.name ) ? () => <></> : InnerBlocks.DefaultBlockAppender ) : InnerBlocks.ButtonBlockAppender
	}, [ hasInnerBlocks, innerBlocks ] )

	return (
		<Fragment>

			<InspectorTabs />

			<Alignment.InspectorControls hasColumnAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<BlockLink.InspectorControls />
			<Image.InspectorControls
				hasWidth={ blockStyle === 'horizontal' }
				hasHeight={ [ 'default', 'default-2' ].includes( blockStyle ) }
				widthUnits={ widthUnit }
				heightUnits={ heightUnit }
				hasBorderRadius={ false }
				hasShape={ false }
			/>
			<ContainerDiv.InspectorControls sizeSelector=".stk-block-card__content" />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-card" />
			<Responsive.InspectorControls />
			<ConditionalDisplay.InspectorControls />

			<CardStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-card" />

			<BlockDiv className={ blockClassNames } enableVariationPicker={ true }>
				<ContainerDiv className={ contentClassNames }>
					<Image
						className="stk-block-card__image"
						enableWidth={ blockStyle === 'horizontal' }
						enableHeight={ [ 'default', 'default-2' ].includes( blockStyle ) }
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
			{ hasInnerBlocks && <MarginBottom /> }
		</Fragment>
	)
}

export default Edit
