/**
 * Internal dependencies
 */
import { CardStyles } from './style'
import { blockStyles } from './block-styles'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { version as VERSION } from 'stackable'
import {
	InspectorTabs,
} from '~stackable/components'
import {
	useBlockContext, useBlockHoverClass, useBlockStyle,
} from '~stackable/hooks'
import {
	withIsHovered,
} from '~stackable/higher-order'
import {
	Column,
	getColumnClasses,
	BlockDiv,
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
import {
	Fragment, useCallback,
} from '@wordpress/element'
import { BlockLink } from '~stackable/block-components/block-link'

const TEMPLATE = [
	[ 'stackable/advanced-heading', {} ],
	[ 'stackable/advanced-text', { content: 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.' } ],
	[ 'stackable/button-group', {}, [
		[ 'stackable/button', { text: 'Button' } ],
	] ],
]

const widthUnit = [ 'px' ]
const heightUnit = [ 'px' ]

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
	const blockStyle = useBlockStyle( blockStyles )
	const blockHoverClass = useBlockHoverClass()

	const blockClassNames = classnames( [
		className,
		'stk-card',
		columnClass,
		blockHoverClass,
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

	const renderAppender = useCallback(
		() => ! hasInnerBlocks ? <InnerBlocks.ButtonBlockAppender /> : <InnerBlocks.DefaultBlockAppender />,
		[ hasInnerBlocks ]
	)

	return (
		<Fragment>

			<InspectorTabs />

			<Alignment.InspectorControls hasColumnAlignment={ true } />
			<BlockDiv.InspectorControls />
			<Advanced.InspectorControls />
			<BlockLink.InspectorControls />
			<BlockStyle.InspectorControls styles={ blockStyles } />
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

			<CardStyles version={ VERSION } />
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
							widthUnits={ widthUnit }
							heightUnits={ heightUnit }
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
								renderAppender={ renderAppender }
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
