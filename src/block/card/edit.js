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
import {
	useBlockContext,
} from '~stackable/hooks'
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
	[ 'core/button', { content: 'Button' } ],
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
			<CustomCSS.InspectorControls mainBlockClass="stk-card" />
			<Responsive.InspectorControls />
			<ContainerDiv.InspectorControls sizeSelector=".stk-card__content" />

			<Style styleFunc={ createStyles( VERSION ) } />
			<CustomCSS mainBlockClass="stk-card" />

			<Column showHandle={ isHovered }>
				<BlockDiv className={ blockClassNames }>
					<ContainerDiv className={ contentClassNames }>
						<Image
							className="stk-card__image"
							enableWidth={ false }
							enableDiagonal={ false }
							heightUnits={ [ 'px' ] }
							width={ 100 }
							widthUnit="%"
							heightUnit="px"
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
