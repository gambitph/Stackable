import createStyles from './style'
import {
	InnerBlocks,
} from '@wordpress/block-editor'
import {
	Fragment,
} from '@wordpress/element'
import classnames from 'classnames'
import { i18n, version as VERSION } from 'stackable'
import {
	InspectorTabs,
	InspectorStyleControls,
	PanelAdvancedSettings,
} from '~stackable/components'
import {
	useBlockContext,
} from '~stackable/hooks'
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import {
	withIsHovered,
} from '~stackable/higher-order'
import {
	Column, getColumnClasses, BlockDiv, Style, Image,
} from '~stackable/block-components'

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
		className, setAttributes, isHovered,
	} = props

	const [ columnClass, columnWrapperClass ] = getColumnClasses( props.attributes )

	const blockClassNames = classnames( [
		className,
		'stk-card',
		columnClass,
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
		columnWrapperClass,
	], {
		'stk-container--no-padding': hasContainer,
	} )

	const innerClassNames = classnames( [
		'stk-inner-blocks',
		'stk-card__content',
	], {
		'stk-container-padding': hasContainer,
	} )

	return (
		<Fragment>

			<InspectorTabs />

			<BlockDiv.InspectorControls />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Container', i18n ) }
					id="container"
					checked={ hasContainer }
					onChange={ hasContainer => setAttributes( { hasContainer } ) }
					// toggleOnSetAttributes={ [
					// 	'arrowSize',
					// 	'arrowColor',
					// ] }
					toggleAttributeName="hasContainer"
				>
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<Style styleFunc={ createStyles( VERSION ) } />

			<Column showHandle={ isHovered }>
				<BlockDiv className={ blockClassNames }>
					<div className={ contentClassNames }>
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
								renderAppender={ () => ! hasInnerBlocks ? <InnerBlocks.ButtonBlockAppender /> : <InnerBlocks.DefaultBlockAppender /> }
								templateInsertUpdatesSelection={ true }
							/>
						</div>
					</div>
				</BlockDiv>
			</Column>
		</Fragment>
	)
}

export default compose(
	withIsHovered,
)( Edit )
