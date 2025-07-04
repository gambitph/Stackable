
/**
 * Internal dependencies
 */
import './store'

/**
 * External dependencies
 */
import {
	i18n, isPro, showProNotice,
} from 'stackable'
import {
	PanelAdvancedSettings,
	ProControl,
} from '~stackable/components'
import {
	getFilteredAttributes, STACKABLE_FILTERS, isBlockStyleAttributesModified,
} from '~stackable/util'

/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks'
import {
	Fragment, useState, useEffect,
} from '@wordpress/element'
import { dispatch, select } from '@wordpress/data'
import { __ } from '@wordpress/i18n'
import { getBlockType } from '@wordpress/blocks'

export { GlobalBlockStyles } from './editor-loader'

addFilter( 'stackable.global-settings.inspector', 'stackable/global-block-styles', output => {
	const [ isOpen, setIsOpen ] = useState( false )

	// Update block attributes if there have been changes with the block styles
	useEffect( () => {
		setTimeout( updateAllBlocksWithBlockStyle, 500 )
	}, [] )

	if ( showProNotice || isPro ) {
		return (
			<Fragment>
				{ output }
				<PanelAdvancedSettings
					title={ __( 'Global Block Styles', i18n ) }
					className="ugb-global-block-styles__panel"
					isPremiumPanel={ ! isPro }
					onToggle={ isOpen => setIsOpen( isOpen ) }
				>
					{ ! isPro && <ProControl type="global-block-styles" /> }
					{ isPro && applyFilters( 'stackable.global-settings.inspector.global-block-styles.control', Fragment, isOpen ) }

				</PanelAdvancedSettings>
			</Fragment>
		)
	}

	return <Fragment />
}, 8 )

const updateAllBlocksWithBlockStyle = () => {
	const clientIds = []
	const clientIdAttributeMap = {}

	const allBlockStyles = select( 'stackable/global-block-styles' ).getAllBlockStyles()

	if ( ! Object.keys( allBlockStyles ).length ) {
		return
	}

	const defaultBlockSettings = Object.keys( allBlockStyles ).reduce( ( output, blockName ) => {
		const blockAttrs = getBlockType( blockName ).attributes
		const blockAttrsFilter = [ ...( STACKABLE_FILTERS[ blockName ] || [] ), 'uniqueId' ]
		const defaultBlockAttrs = getFilteredAttributes( blockAttrs, blockAttrsFilter )

		const blockStyles = allBlockStyles[ blockName ].reduce( ( styles, blockStyle, index ) => {
			styles[ blockStyle.slug ] = index
			return styles
		}, {} )
		output[ blockName ] = {
			blockAttributes: defaultBlockAttrs,
			blockStyles,
		}
		return output
	}, {} )

	const updateBlockAttributesRecursive = blocks => {
		blocks.forEach( block => {
			if ( ! block.name.startsWith( 'stackable/' ) ||
				! block.attributes.blockStyle ||
				( block.attributes.blockStyle && block.attributes.modifiedBlockStyle ) ||
				! ( block.name in defaultBlockSettings &&
					block.attributes.blockStyle in defaultBlockSettings[ block.name ].blockStyles
				)
			) {
				return
			}

			const blockStyle = block.attributes.blockStyle

			const blockStyleIndex = defaultBlockSettings[ block.name ].blockStyles[ blockStyle ]

			if ( isBlockStyleAttributesModified( block.name, blockStyle, block.attributes ) ) {
				clientIds.push( block.clientId )
				clientIdAttributeMap[ block.clientId ] = {
					...defaultBlockSettings[ block.name ].blockAttributes,
					...allBlockStyles[ block.name ][ blockStyleIndex ].attributes,
					blockStyle,
				}
			}

			// Also adjust the inner blocks.
			if ( block.innerBlocks && block.innerBlocks.length ) {
				updateBlockAttributesRecursive( block.innerBlocks )
			}
		} )
	}
	updateBlockAttributesRecursive( select( 'core/block-editor' ).getBlocks() )

	if ( clientIds.length ) {
		dispatch( 'core/block-editor' ).updateBlockAttributes( clientIds, clientIdAttributeMap, true )
	}
}
