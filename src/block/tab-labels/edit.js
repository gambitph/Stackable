import { TabLabelStyle } from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { InspectorTabs } from '~stackable/components'
import {
	BlockDiv,
	useGeneratedCss,
	CustomCSS,
	CustomAttributes,
} from '~stackable/block-components'
import {
	withBlockAttributeContext,
	withBlockWrapperIsHovered,
	withQueryLoopContext,
} from '~stackable/higher-order'
import { version as VERSION } from 'stackable'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'
import { __ } from '@wordpress/i18n'
import { dispatch, select } from '@wordpress/data'
import { attributes } from '../tabs/schema'
import { useCallback } from '@wordpress/element'
import { getBlockFromExample } from '@wordpress/blocks'

export const checkOpen = i => {
	if ( i === 1 ) {
		return true
	}
	return false
}

const Edit = props => {
	const {
		className,
		isSelected,
	} = props

	useGeneratedCss( props.attributes )

	const {
		insertBlock, updateBlockAttributes,
	} = dispatch( 'core/block-editor' )

	const {
		getBlockRootClientId, getNextBlockClientId,
	} = select( 'core/block-editor' )

	const blockClassNames = classnames( [
		className,
		'stk-block-tab-labels',
	] )

	const handleClick = useCallback( el => {
		const tabContent = getNextBlockClientId( props.clientId )
		const dataTab = parseInt( el.target.getAttribute( 'data-tab' ), 10 )
		const tabContentBlock = document.querySelector( `[data-block="${ tabContent }"]` )
		const columns = tabContentBlock.querySelectorAll( '[data-type="stackable/column"]' )
		columns.forEach( ( element, index ) => {
			if ( dataTab === index + 1 ) {
				element.classList.remove( 'stk-block-tabs__content--hidden' )
				element.classList.add( 'stk-block-tabs__content--shown' )
			} else {
				element.classList.remove( 'stk-block-tabs__content--shown' )
				element.classList.add( 'stk-block-tabs__content--hidden' )
			}
		} )
	} )

	const tabs = []

	for ( let i = 1; i <= props.attributes.tabCount; i++ ) {
		tabs.push(
			<button className="stk-block-tabs__tab stk-tabs__tab-desktop"
				data-tab={ i }
				data-initial-open={ props.attributes.initialTabOpen === i.toString() ? true : false }
				onClick={ handleClick }
			>
				Tab { i }
			</button>
		)
	}

	return (
		<>
			{ isSelected && (
				<>
					<InspectorTabs />
					<BlockDiv.InspectorControls />
					<CustomAttributes.InspectorControls />
					<CustomCSS.InspectorControls mainBlockClass="stk-block-tab-labels" />
				</>
			) }

			<BlockDiv
				blockHoverClass={ props.blockHoverClass }
				clientId={ props.clientId }
				attributes={ props.attributes }
				className={ blockClassNames }
			>
				<TabLabelStyle
					version={ VERSION }
					blockState={ props.blockState }
					clientId={ props.clientId }
				/>
				<div className="stk-block-tab-labels__wrapper">
					{ tabs }
					<button
						className="stk-block-tabs__tab stk-tabs__tab-desktop stk-tabs__add-tab"
						onClick={ () => {
							const tabContent = getNextBlockClientId( props.clientId )
							const tabsBlock = getBlockRootClientId( props.clientId )
							const tabCount = props.attributes.tabCount || 0
							const tabsInnerBlocksClientIds = []
							tabsInnerBlocksClientIds.push( tabsBlock, tabContent, props.clientId )
							const tabsUpdatedAttributes = {}
							const block = getBlockFromExample( 'stackable/column', {} ) // eslint-disable-line

							tabsInnerBlocksClientIds.push( props.clientId )
							tabsInnerBlocksClientIds.forEach( clientId => {
								tabsUpdatedAttributes[ clientId ] = { tabCount: parseInt( tabCount, 10 ) + 1 }
							} )
							updateBlockAttributes( tabsInnerBlocksClientIds, tabsUpdatedAttributes, true ) // eslint-disable-line stackable/no-update-block-attributes
							insertBlock( block, attributes.tabCount, tabContent, false )
						} }
					>
						+
					</button>
				</div>
			</BlockDiv>
		</>
	)
}

export default compose(
	withBlockWrapperIsHovered,
	withQueryLoopContext,
	withBlockAttributeContext,
)( Edit )
