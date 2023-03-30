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
import { useEffect } from '@wordpress/element'
import { getBlockFromExample } from '@wordpress/blocks'
import { useSetActiveTabContext } from './with-active-tab'

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

	const setActiveTab = useSetActiveTabContext()
	const initialTabOpen = props.context[ 'stackable/initialTabOpen' ]

	// In charge of setting the active tab class - used for displaying the
	// current tab content.
	useEffect( () => {
		setActiveTab( currentActiveTab => {
			if ( currentActiveTab === null ) {
				return initialTabOpen
			} else if ( currentActiveTab > props.attributes.tabCount ) {
				return props.attributes.tabCount
			}
			return currentActiveTab
		} )
	}, [ initialTabOpen, props.attributes.tabCount ] )

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

	const tabs = []

	for ( let i = 1; i <= props.attributes.tabCount; i++ ) {
		tabs.push(
			<button className="stk-block-tabs__tab stk-tabs__tab-desktop"
				key={ i }
				data-tab={ i }
				data-initial-open={ props.attributes.initialTabOpen === i.toString() ? true : false }
				onClick={ () => setActiveTab( i ) }
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

							const newTabCount = parseInt( tabCount, 10 ) + 1
							tabsInnerBlocksClientIds.push( props.clientId )
							tabsInnerBlocksClientIds.forEach( clientId => {
								tabsUpdatedAttributes[ clientId ] = { tabCount: newTabCount }
							} )
							updateBlockAttributes( tabsInnerBlocksClientIds, tabsUpdatedAttributes, true ) // eslint-disable-line stackable/no-update-block-attributes
							insertBlock( block, attributes.tabCount, tabContent, false )

							setActiveTab( newTabCount )
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
