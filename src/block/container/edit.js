/**
 * Internal dependencies
 */
import { ContainerStyles } from './style'
import { blockStyles } from './block-styles'

/**
 * External dependencies
 */
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import {
	InspectorTabs,
} from '~stackable/components'
import {
	Image,
	BlockDiv,
	ContainerDiv,
	Alignment,
	getAlignmentClasses,
	EffectsAnimations,
	CustomAttributes,
	CustomCSS,
	Responsive, Advanced,
	MarginBottom,
	BlockStyle,
	BlockLink,
} from '~stackable/block-components'
import {
	useBlockHoverClass, useBlockStyle,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'

const Edit = props => {
	const {
		className,
	} = props

	const {
		hasContainer,
	} = props.attributes

	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockHoverClass = useBlockHoverClass()
	const blockStyle = useBlockStyle( blockStyles )

	const blockClassNames = classnames( [
		className,
		'stk-container',
		blockHoverClass,
	] )

	const contentClassNames = classnames( [ 'stk-block-content', 'stk--no-padding' ] )

	const innerClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-container__content',
	], {
		'stk--container-padding': hasContainer,
	} )

	return (
		<Fragment>

			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<BlockLink.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-container" />
			<Responsive.InspectorControls />

			<BlockStyle.InspectorControls styles={ blockStyles } />
			<Image.InspectorControls
				hasWidth={ blockStyle !== 'image' }
				hasHeight={ blockStyle === 'image' }
				widthUnits={ [ 'px' ] }
				heightUnits={ [ 'px' ] }
				hasBorderRadius={ false }
				hasShape={ false }
			/>
			<ContainerDiv.InspectorControls sizeSelector=".stk-block-content" />

			<BlockDiv className={ blockClassNames }>
				<ContainerStyles version={ VERSION } />
				<CustomCSS mainBlockClass="stk-container" />

				<ContainerDiv className={ contentClassNames }>
					{ props.attributes.showImage && (
						<Image
							className="stk-container__image"
							enableWidth={ blockStyle !== 'image' }
							enableHeight={ blockStyle === 'image' }
							widthResizePosition={ blockStyle === 'image-2' ? 'right' : 'left' }
							enableDiagonal={ false }
							defaultWidth={ 250 }
							defaultHeight={ 300 }
							widthUnits={ [ 'px' ] }
							heightUnits={ [ 'px' ] }
							width={ blockStyle !== 'image' ? undefined : 100 }
							widthUnit={ blockStyle !== 'image' ? 'px' : '%' }
							height={ blockStyle !== 'image' ? 100 : undefined }
							heightUnit={ blockStyle !== 'image' ? '%' : 'px' }
						/>
					) }
					<div className={ innerClassNames }>
						<InnerBlocks
							templateLock={ false }
							templateInsertUpdatesSelection={ true }
						/>
					</div>
				</ContainerDiv>
				<MarginBottom />
			</BlockDiv>
		</Fragment>
	)
}

export default Edit
