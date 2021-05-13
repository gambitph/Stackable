/**
 * Internal dependencies
 */
import createStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION } from 'stackable'
import {
	InspectorTabs,
} from '~stackable/components'
import { useBlockContext, useBlockStyle } from '~stackable/hooks'
import {
	withIsHovered,
} from '~stackable/higher-order'
import {
	Column,
	getColumnClasses,
	BlockDiv,
	Style,
	Image,
	getAlignmentClasses,
	Alignment,
	useAlignment,
	Advanced,
	CustomCSS,
	Responsive,
	ContainerDiv,
	Linking,
	BlockStyle,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { InnerBlocks } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'
import { BlockLink } from '~stackable/block-components/block-link'

const TEMPLATE = [
	[ 'core/heading', {} ],
	[ 'core/paragraph', { content: 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.' } ],
	[ 'core/buttons', {}, [
		[ 'core/button', { text: 'Button' } ],
	] ],
]

const Edit = props => {
	const { hasInnerBlocks } = useBlockContext()

	const {
		hasContainer,
	} = props.attributes

	const {
		className, isHovered,
	} = props

	const { blockOrientation } = useAlignment()
	const [ columnClass, columnWrapperClass ] = getColumnClasses( props.attributes )
	const blockAlignmentClass = getAlignmentClasses( props.attributes )
	const blockStyle = useBlockStyle()

	const blockClassNames = classnames( [
		className,
		'stk-card',
		columnClass,
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		columnWrapperClass,
		'stk--no-padding',
	] )

	const innerClassNames = classnames( [
		'stk-inner-blocks',
		blockAlignmentClass,
		'stk-card__content',
	], {
		'stk-container-padding': hasContainer,
	} )

	return (
		<Fragment>

			<InspectorTabs />

			<Alignment.InspectorControls hasColumnAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<BlockLink.InspectorControls />
			<BlockStyle.InspectorControls />
			<Image.InspectorControls
				hasWidth={ blockStyle === 'horizontal' }
				hasHeight={ blockStyle !== 'horizontal' }
				heightUnits={ [ 'px' ] }
				widthUnits={ [ 'px' ] }
				hasBorderRadius={ false }
				hasShape={ false }
			/>
			<ContainerDiv.InspectorControls sizeSelector=".stk-card__content" />
			<CustomCSS.InspectorControls mainBlockClass="stk-card" />
			<Responsive.InspectorControls />

			<Style styleFunc={ createStyles( VERSION ) } />
			<CustomCSS mainBlockClass="stk-card" />

			<Column showHandle={ isHovered }>
				<Linking show={ isHovered } />
				<BlockDiv className={ blockClassNames }>
					<ContainerDiv className={ contentClassNames }>
						<Image
							className="stk-card__image"
							enableWidth={ blockStyle === 'horizontal' }
							enableHeight={ blockStyle !== 'horizontal' }
							enableDiagonal={ false }
							widthUnits={ [ 'px' ] }
							heightUnits={ [ 'px' ] }
							defaultWidth={ 250 }
							width={ blockStyle !== 'horizontal' ? 100 : undefined }
							widthUnit={ blockStyle !== 'horizontal' ? '%' : 'px' }
							height={ blockStyle !== 'horizontal' ? undefined : 100 }
							heightUnit={ blockStyle !== 'horizontal' ? 'px' : '%' }
						/>
						<div className={ innerClassNames }>
							<InnerBlocks
								template={ TEMPLATE }
								orientation={ blockOrientation }
								renderAppender={ () => ! hasInnerBlocks ? <InnerBlocks.ButtonBlockAppender /> : <InnerBlocks.DefaultBlockAppender /> }
								templateInsertUpdatesSelection={ true }
							/>
						</div>
					</ContainerDiv>
				</BlockDiv>
			</Column>
		</Fragment>
	)
}

export default compose(
	withIsHovered,
)( Edit )
